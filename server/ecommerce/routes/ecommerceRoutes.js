import express from 'express';
import path from 'path';
import { Resend } from 'resend';
import { VisitorModel } from '../models/VisitorModel.js';
import { ProductModel } from '../models/ProductModel.js';
import { CouponModel } from '../models/CouponModel.js';
import { OrderModel } from '../models/OrderModel.js';
import { PayPalService, PAYPAL_CURRENCY } from '../services/paypalService.js';
import { PricingService } from '../services/pricingService.js';
import { TicketService } from '../services/ticketService.js';
import {
  generatePDFEcommercePurchaseReceipt,
  generatePDF_freePass_ecomondo,
} from '../../generatePdf.js';
import { email_template_ecommerce_purchase } from '../../TemplateEmailEcommercePurchase.js';

const router = express.Router();

const getResendClient = () => {
  const apiKey = process.env.RESEND_APIKEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
};

/**
 * GET /ecommerce/paypal-config
 * Expone configuración pública mínima de PayPal para el frontend
 */
router.get('/paypal-config', async (_req, res) => {
  try {
    const environment = process.env.ENVIRONMENT || process.env.PAYPAL_ENVIRONMENT || 'sandbox';
    const clientId =
      process.env.CLIENT_ID ||
      process.env.PAYPAL_CLIENT_ID ||
      process.env.PUBLIC_PAYPAL_CLIENT_ID ||
      '';

    if (!clientId) {
      return res.status(500).json({
        success: false,
        message: 'PayPal client ID no configurado en servidor',
      });
    }

    res.json({
      success: true,
      paypal: {
        environment,
        client_id: clientId,
        currency: PAYPAL_CURRENCY,
      },
    });
  } catch (error) {
    console.error('Error in GET /paypal-config:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo configuración de PayPal',
    });
  }
});

/**
 * GET /ecommerce/products
 * Obtiene todos los productos activos con disponibilidad calculada
 */
router.get('/products', async (req, res) => {
  try {
    const products = await ProductModel.getActiveProducts();
    res.json({
      success: true,
      products: products,
    });
  } catch (error) {
    console.error('Error in GET /products:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo productos',
      error: error.message,
    });
  }
});

/**
 * GET /ecommerce/visitor
 * Valida si un visitante existe por email
 * Query param: email
 */
router.get('/visitor', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido',
      });
    }

    const visitor = await VisitorModel.findByEmail(email);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitante no registrado',
        visitor: null,
      });
    }

    res.json({
      success: true,
      message: 'Visitante encontrado',
      visitor: {
        id_visitor: visitor.id,
        name: visitor.name || visitor.nombre,
        email: visitor.email,
      },
    });
  } catch (error) {
    console.error('Error in GET /visitor:', error);
    res.status(500).json({
      success: false,
      message: 'Error validando visitante',
      error: error.message,
    });
  }
});

/**
 * POST /ecommerce/validate-coupon
 * Valida un cupón
 * Body: { code: string }
 */
router.post('/validate-coupon', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Código de cupón requerido',
      });
    }

    const validation = await CouponModel.validate(code);

    res.json({
      success: validation.valid,
      message: validation.message,
      coupon: validation.coupon,
    });
  } catch (error) {
    console.error('Error in POST /validate-coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error validando cupón',
      error: error.message,
    });
  }
});

/**
 * POST /ecommerce/create-order
 * Prepara una compra temporal y crea la orden en PayPal (sin persistir en DB)
 * Body: {
 *   visitor_email: string,
 *   cart_items: [{product_id, quantity}, ...],
 *   coupon_code: string (opcional)
 * }
 */
router.post('/create-order', async (req, res) => {
  try {
    const { visitor_email, cart_items, coupon_code } = req.body;

    // Validar entrada
    if (!visitor_email || !cart_items || cart_items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Email del visitante y carrito requeridos',
      });
    }

    // 1. Validar visitante
    const visitor = await VisitorModel.findByEmail(visitor_email);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitante no registrado. Por favor regístrese primero.',
      });
    }

    // 2. Validar y recalcular carrito
    const pricingData = await PricingService.validateCart(cart_items, coupon_code);

    // 3. Validar capacidad nuevamente
    await PricingService.validateCapacity(cart_items);

    // 4. Preparar datos para PayPal
    const itemsForPayPal = PricingService.formatItemsForPayPal(pricingData.items);

    const paypalOrderData = {
      total_amount: pricingData.final_amount,
      subtotal_amount: pricingData.subtotal,
      discount_amount: pricingData.discount,
      items_data: itemsForPayPal,
    };

    // 5. Crear orden en PayPal
    const paypalResult = await PayPalService.createOrder(paypalOrderData);

    if (!paypalResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Error creando orden en PayPal',
        error: paypalResult.message,
      });
    }

    res.json({
      success: true,
      message: 'Orden temporal preparada exitosamente',
      paypal_order_id: paypalResult.paypal_order_id,
      pricing: {
        subtotal: pricingData.subtotal,
        discount: pricingData.discount,
        final_amount: pricingData.final_amount,
      },
    });
  } catch (error) {
    console.error('Error in POST /create-order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando orden',
      error: error.message,
    });
  }
});

/**
 * POST /ecommerce/capture-order
 * Captura el pago de PayPal y SOLO entonces guarda la orden en DB
 * Body: {
 *   paypal_order_id: string,
 *   pending_order: {
 *     visitor_email: string,
 *     cart_items: [{product_id, quantity}, ...],
 *     coupon_code: string | null,
 *     pricing: {subtotal, discount, final_amount},
 *     paypal_order_id: string,
 *   }
 * }
 */
router.post('/capture-order', async (req, res) => {
  try {
    const { paypal_order_id, pending_order } = req.body;

    // Validar entrada
    if (!paypal_order_id || !pending_order) {
      return res.status(400).json({
        success: false,
        message: 'PayPal Order ID y pending_order son requeridos',
      });
    }

    const {
      visitor_email,
      cart_items,
      coupon_code,
      pricing: pendingPricing,
      paypal_order_id: preparedPaypalOrderId,
    } = pending_order;

    if (!visitor_email || !Array.isArray(cart_items) || cart_items.length === 0 || !pendingPricing) {
      return res.status(400).json({
        success: false,
        message: 'pending_order inválido',
      });
    }

    if (preparedPaypalOrderId && preparedPaypalOrderId !== paypal_order_id) {
      return res.status(400).json({
        success: false,
        message: 'El PayPal Order ID no coincide con la orden preparada',
      });
    }

    // 1. Evitar reprocesar órdenes ya capturadas
    const existingOrder = await OrderModel.findByPayPalOrderId(paypal_order_id);
    if (existingOrder && existingOrder.paypal_transaction_id) {
      return res.status(400).json({
        success: false,
        message: 'Esta orden ya fue pagada',
      });
    }

    // 2. Validar visitante nuevamente
    const visitor = await VisitorModel.findByEmail(visitor_email);
    if (!visitor) {
      return res.status(403).json({
        success: false,
        message: 'Visitante no válido para esta compra',
      });
    }

    // 3. Revalidar carrito y precios
    const pricingData = await PricingService.validateCart(cart_items, coupon_code || null);

    // Verificar que los importes no hayan cambiado entre preparación y captura
    if (
      Math.abs(pricingData.subtotal - Number(pendingPricing.subtotal || 0)) > 0.01 ||
      Math.abs(pricingData.discount - Number(pendingPricing.discount || 0)) > 0.01 ||
      Math.abs(pricingData.final_amount - Number(pendingPricing.final_amount || 0)) > 0.01
    ) {
      return res.status(400).json({
        success: false,
        message: 'El total de la compra ha cambiado desde la preparación. Por favor recalcule e intente nuevamente.',
      });
    }

    // 4. Revalidar capacidad
    await PricingService.validateCapacity(cart_items);

    // 5. Capturar en PayPal
    let paypalCapture;
    try {
      paypalCapture = await PayPalService.captureOrder(paypal_order_id);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error procesando pago PayPal',
        error: error.message,
      });
    }

    if (!paypalCapture.success) {
      return res.status(500).json({
        success: false,
        message: 'Error capturando pago en PayPal',
      });
    }

    // Validar que PayPal confirmó el pago
    if (paypalCapture.status !== 'COMPLETED' && paypalCapture.status !== 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'Pago no completado en PayPal',
        paypal_status: paypalCapture.status,
      });
    }

    if (
      paypalCapture.captured_amount !== null &&
      Math.abs(Number(paypalCapture.captured_amount) - pricingData.final_amount) > 0.01
    ) {
      return res.status(400).json({
        success: false,
        message: 'El monto capturado por PayPal no coincide con el total validado',
      });
    }

    if (
      paypalCapture.captured_currency &&
      String(paypalCapture.captured_currency).toUpperCase() !== String(PAYPAL_CURRENCY).toUpperCase()
    ) {
      return res.status(400).json({
        success: false,
        message: 'La moneda capturada por PayPal no coincide con la configuración del sistema',
      });
    }

    // 6. Persistir orden solo tras captura exitosa
    const order = await OrderModel.create({
      visitor_id: visitor.id,
      total_amount: pricingData.subtotal,
      discount_amount: pricingData.discount,
      final_amount: pricingData.final_amount,
      coupon_id: pricingData.coupon_id,
      paypal_order_id: paypalCapture.paypal_order_id,
      paypal_transaction_id: paypalCapture.transaction_id,
    });

    // 7. Crear boletos
    const ticketIds = await TicketService.createTickets(
      order.id_order,
      visitor.id,
      pricingData.items
    );

    let emailSent = false;
    let emailError = null;
    let receiptPdfFile = null;
    let badgePdfFile = null;
    const mailAttachments = [];

    try {
      // 8. Generar comprobante PDF (tabla de compra + datos de facturación)
      try {
        const receiptPdfPath = await generatePDFEcommercePurchaseReceipt({
          orderId: order.id_order,
          transactionId: paypalCapture.transaction_id,
          purchaseDate: new Date(),
          visitor,
          items: pricingData.items,
          pricing: pricingData,
          currency: PAYPAL_CURRENCY,
        });

        receiptPdfFile = path.basename(receiptPdfPath);
        mailAttachments.push({
          filename: receiptPdfFile,
          path: receiptPdfPath,
        });
      } catch (receiptError) {
        console.error('Error generating ecommerce receipt PDF:', receiptError);
      }

      // 9. Generar gafete PDF usando la lógica existente de registro
      try {
        const badgePdfPath = await generatePDF_freePass_ecomondo(
          {
            ...visitor,
            typeRegister: 'VISITANTE',
          },
          visitor.uuid || `visitor-${visitor.id}`
        );

        badgePdfFile = path.basename(badgePdfPath);
        mailAttachments.push({
          filename: badgePdfFile,
          path: badgePdfPath,
        });
      } catch (badgeError) {
        console.error('Error generating badge PDF:', badgeError);
      }

      const resend = getResendClient();
      if (!resend) {
        throw new Error('RESEND_APIKEY/RESEND_API_KEY no configurada');
      }

      // 10. Enviar correo inmediato con ambos adjuntos
      const html = await email_template_ecommerce_purchase({
        visitor,
        items: pricingData.items,
        pricing: pricingData,
        orderId: order.id_order,
        transactionId: paypalCapture.transaction_id,
      });

      const emailResponse = await resend.emails.send({
        from: 'Smart Technology Expo <noreply@smarttechnologyexpo.mx>',
        to: [visitor.email],
        cc: ['emmanuel.heredia@igeco.mx', 'jesus.zermeno@igeco.mx'],
        subject: `Your purchase confirmation - Order #${order.id_order}`,
        html,
        attachments: mailAttachments,
      });

      if (emailResponse?.error) {
        throw new Error(emailResponse.error.message || 'Resend no pudo procesar el envío');
      }

      emailSent = true;
    } catch (mailError) {
      emailError = mailError?.message || 'No se pudo enviar el correo de confirmación';
      console.error('Error sending ecommerce confirmation email:', mailError);
    }

    res.json({
      success: true,
      message: 'Pago procesado exitosamente',
      order_id: order.id_order,
      paypal_order_id: paypalCapture.paypal_order_id,
      transaction_id: paypalCapture.transaction_id,
      tickets_created: ticketIds.length,
      ticket_ids: ticketIds,
      email_sent: emailSent,
      email_error: emailError,
      receipt_pdf: receiptPdfFile,
      badge_pdf: badgePdfFile,
    });
  } catch (error) {
    console.error('Error in POST /capture-order:', error);
    res.status(500).json({
      success: false,
      message: 'Error capturando orden',
      error: error.message,
    });
  }
});

/**
 * GET /ecommerce/order/:order_id
 * Obtiene detalles de una orden
 */
router.get('/order/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await OrderModel.findById(order_id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada',
      });
    }

    const tickets = await TicketService.getTicketsByOrderId(order_id);

    res.json({
      success: true,
      order: order,
      tickets: tickets,
    });
  } catch (error) {
    console.error('Error in GET /order/:order_id:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo orden',
      error: error.message,
    });
  }
});

/**
 * GET /ecommerce/visitor/:visitor_id/tickets
 * Obtiene los boletos de un visitante
 */
router.get('/visitor/:visitor_id/tickets', async (req, res) => {
  try {
    const { visitor_id } = req.params;

    // Validar que el visitante exista
    const visitor = await VisitorModel.findById(visitor_id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitante no encontrado',
      });
    }

    const tickets = await TicketService.getTicketsByVisitorId(visitor_id);

    res.json({
      success: true,
      visitor_id: visitor_id,
      tickets: tickets,
    });
  } catch (error) {
    console.error('Error in GET /visitor/:visitor_id/tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo boletos',
      error: error.message,
    });
  }
});

export default router;
