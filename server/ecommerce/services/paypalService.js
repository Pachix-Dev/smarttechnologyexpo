import 'dotenv/config';

/**
 * PayPal Service
 * Maneja la integración con la API de PayPal
 * Soporta:
 * - Obtención de access token
 * - Creación de órdenes
 * - Captura de órdenes
 */

const PAYPAL_ENVIRONMENT =
  process.env.ENVIRONMENT || process.env.PAYPAL_ENVIRONMENT || 'sandbox';
const PAYPAL_CLIENT_ID =
  process.env.CLIENT_ID ||
  process.env.PAYPAL_CLIENT_ID ||
  process.env.PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET =
  process.env.CLIENT_SECRET ||
  process.env.PAYPAL_CLIENT_SECRET ||
  process.env.PUBLIC_PAYPAL_CLIENT_SECRET;
export const PAYPAL_CURRENCY = process.env.PAYPAL_CURRENCY || 'MXN';

const PAYPAL_API_BASE = 
  PAYPAL_ENVIRONMENT === 'production'
    ? 'https://api.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

const getPrimaryOrigin = () => {
  const acceptedOriginsRaw = process.env.ACCEPTED_ORIGINS || '';
  const [firstOrigin = 'http://localhost:4321'] = acceptedOriginsRaw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return firstOrigin.replace(/\/$/, '');
};

export class PayPalService {
  /**
   * Obtiene un access token de PayPal
   * @returns {Promise<string>} Token de acceso
   */
  static async getAccessToken() {
    try {
      if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error('PayPal credentials are not configured (PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET)');
      }

      const auth = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
      ).toString('base64');

      const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error(`PayPal auth failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting PayPal access token:', error);
      throw error;
    }
  }

  /**
   * Crea una orden en PayPal
   * @param {Object} orderData - Datos de la orden
   * @returns {Promise<Object>} Response de PayPal con id
   */
  static async createOrder(orderData) {
    try {
      const accessToken = await this.getAccessToken();
      const {
        total_amount,
        subtotal_amount,
        discount_amount = 0,
        items_data,
        return_url,
        cancel_url,
      } = orderData;

      const defaultOrigin = getPrimaryOrigin();
      const normalizedSubtotal = Number(
        subtotal_amount ??
        items_data.reduce(
          (sum, item) => sum + Number(item.unit_amount.value) * Number(item.quantity),
          0
        )
      ).toFixed(2);
      const normalizedDiscount = Number(discount_amount || 0).toFixed(2);
      const normalizedTotal = Number(total_amount).toFixed(2);

      const payload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: PAYPAL_CURRENCY,
              value: normalizedTotal,
              breakdown: {
                item_total: {
                  currency_code: PAYPAL_CURRENCY,
                  value: normalizedSubtotal,
                },
                ...(Number(normalizedDiscount) > 0
                  ? {
                      discount: {
                        currency_code: PAYPAL_CURRENCY,
                        value: normalizedDiscount,
                      },
                    }
                  : {}),
              },
            },
            items: items_data, // Array de items con name, description, sku, unit_amount, quantity
          },
        ],
        application_context: {
          return_url: return_url || `${defaultOrigin}/checkout?success=true`,
          cancel_url: cancel_url || `${defaultOrigin}/checkout?cancelled=true`,
          user_action: 'PAY_NOW',
          brand_name: 'Smart Technology Expo',
        },
      };

      const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`PayPal create order failed: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return {
        success: true,
        paypal_order_id: data.id,
        status: data.status,
        links: data.links,
      };
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
  }

  /**
   * Captura una orden de PayPal
   * @param {string} paypal_order_id - ID de la orden en PayPal
   * @returns {Promise<Object>} Response de PayPal con detalles de la captura
   */
  static async captureOrder(paypal_order_id) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(
        `${PAYPAL_API_BASE}/v2/checkout/orders/${paypal_order_id}/capture`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`PayPal capture failed: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();

      // Extraer transaction ID del primer purchase_unit
      let transaction_id = null;
      let captured_amount = null;
      let captured_currency = null;
      if (
        data.purchase_units &&
        data.purchase_units[0] &&
        data.purchase_units[0].payments &&
        data.purchase_units[0].payments.captures &&
        data.purchase_units[0].payments.captures[0]
      ) {
        const capture = data.purchase_units[0].payments.captures[0];
        transaction_id = capture.id;
        captured_amount = capture.amount?.value ? Number(capture.amount.value) : null;
        captured_currency = capture.amount?.currency_code || null;
      }

      return {
        success: true,
        paypal_order_id: data.id,
        status: data.status,
        transaction_id: transaction_id,
        captured_amount,
        captured_currency,
        payer: data.payer,
        purchase_units: data.purchase_units,
      };
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      throw error;
    }
  }

  /**
   * Obtiene detalles de una orden de PayPal
   * @param {string} paypal_order_id - ID de la orden en PayPal
   * @returns {Promise<Object>} Detalles de la orden
   */
  static async getOrderDetails(paypal_order_id) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(
        `${PAYPAL_API_BASE}/v2/checkout/orders/${paypal_order_id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`PayPal get details failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting PayPal order details:', error);
      throw error;
    }
  }
}
