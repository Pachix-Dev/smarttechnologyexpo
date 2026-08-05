import { ProductModel } from '../models/ProductModel.js';
import { CouponModel } from '../models/CouponModel.js';
import { PAYPAL_CURRENCY } from './paypalService.js';

/**
 * Pricing Service
 * Responsable de recalcular precios, aplicar descuentos y validar disponibilidad
 * El frontend NO calcula precios; todo se valida aquí en el backend
 */

export class PricingService {
  /**
   * Recalcula el total de una compra
   * @param {Array} cartItems - Array de items del carrito: [{product_id, quantity}, ...]
   * @param {string} coupon_code - Código de cupón (opcional)
   * @returns {Promise<Object>} { subtotal, discount, final_amount, coupon_id, coupon, items }
   */
  static async calculateTotal(cartItems, coupon_code = null) {
    try {
      // Validar que el carrito no esté vacío
      if (!cartItems || cartItems.length === 0) {
        throw new Error('El carrito está vacío');
      }

      // Obtener información de productos
      const productIds = cartItems.map((item) => item.product_id);
      const products = await ProductModel.findByIds(productIds);

      // Validar que todos los productos existan
      if (products.length !== productIds.length) {
        throw new Error('Uno o más productos no existen');
      }

      // Crear mapa de productos para búsqueda rápida
      const productMap = {};
      products.forEach((p) => {
        productMap[p.id_product] = p;
      });

      // Calcular subtotal
      let subtotal = 0;
      const itemsWithPrices = [];

      for (const item of cartItems) {
        const product = productMap[item.product_id];
        if (!product) {
          throw new Error(`Producto ${item.product_id} no encontrado`);
        }

        if (product.status !== 'active') {
          throw new Error(`Producto ${item.product_id} no está disponible`);
        }

        // Validar que el precio del archivo estático coincida con el de la DB
        if (item.expected_price !== undefined) {
          const dbPrice = parseFloat(product.price).toFixed(2);
          const sentPrice = parseFloat(item.expected_price).toFixed(2);
          if (dbPrice !== sentPrice) {
            throw new Error(
              `El precio del producto "${product.name}" ha cambiado. Recarga la página e intenta de nuevo.`
            );
          }
        }

        const itemTotal = parseFloat(product.price) * parseInt(item.quantity);
        subtotal += itemTotal;

        itemsWithPrices.push({
          product_id: item.product_id,
          name: product.name,
          unit_price: parseFloat(product.price),
          quantity: parseInt(item.quantity),
          total: itemTotal,
        });
      }

      // Aplicar cupón si existe
      let discount = 0;
      let coupon_id = null;
      let coupon = null;

      if (coupon_code) {
        const couponValidation = await CouponModel.validate(coupon_code);
        if (couponValidation.valid) {
          coupon = couponValidation.coupon;
          coupon_id = coupon.id_coupon;
          discount = CouponModel.calculateDiscount(coupon, subtotal);

          // Asegurar que el descuento no sea mayor que el subtotal
          discount = Math.min(discount, subtotal);
        } else {
          throw new Error(couponValidation.message);
        }
      }

      const finalAmount = subtotal - discount;

      return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        final_amount: parseFloat(finalAmount.toFixed(2)),
        coupon_id: coupon_id,
        coupon: coupon,
        items: itemsWithPrices,
      };
    } catch (error) {
      console.error('Error calculating total:', error);
      throw error;
    }
  }

  /**
   * Valida disponibilidad de capacidad para los items
   * @param {Array} cartItems - Array de items: [{product_id, quantity}, ...]
   * @returns {Promise<boolean>}
   */
  static async validateCapacity(cartItems) {
    try {
      for (const item of cartItems) {
        const available = await ProductModel.getAvailableCapacity(item.product_id);

        // Si capacity_limit es null, no hay límite
        if (available === null) {
          continue; // Sin validación de capacidad
        }

        // Si la cantidad solicitada supera disponibilidad
        if (parseInt(item.quantity) > available) {
          throw new Error(
            `Capacidad insuficiente para producto ${item.product_id}. ` +
            `Disponible: ${available}, Solicitado: ${item.quantity}`
          );
        }
      }

      return true;
    } catch (error) {
      console.error('Error validating capacity:', error);
      throw error;
    }
  }

  /**
   * Valida un carrito completo (productos, cantidades, descuentos, capacidad)
   * @param {Array} cartItems - Items del carrito
   * @param {string} coupon_code - Código de cupón (opcional)
   * @returns {Promise<Object>} Datos de compra validados
   */
  static async validateCart(cartItems, coupon_code = null) {
    try {
      // Validar que no esté vacío
      if (!cartItems || cartItems.length === 0) {
        throw new Error('El carrito está vacío');
      }

      // Validar capacidad
      await this.validateCapacity(cartItems);

      // Calcular totales
      const pricingData = await this.calculateTotal(cartItems, coupon_code);

      return {
        valid: true,
        ...pricingData,
      };
    } catch (error) {
      console.error('Error validating cart:', error);
      throw error;
    }
  }

  /**
   * Convierte items del carrito a formato PayPal
   * @param {Array} itemsWithPrices - Items con precios (del calculateTotal)
   * @returns {Array} Items formateados para PayPal
   */
  static formatItemsForPayPal(itemsWithPrices) {
    return itemsWithPrices.map((item) => ({
      name: item.name,
      sku: `PRODUCT-${item.product_id}`,
      unit_amount: {
        currency_code: PAYPAL_CURRENCY,
        value: item.unit_price.toFixed(2),
      },
      quantity: item.quantity.toString(),
    }));
  }
}
