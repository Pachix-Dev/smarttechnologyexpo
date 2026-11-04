import { pool } from './db-pool.js';

export class CouponValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CouponValidationError';
    this.code = 'INVALID_COUPON';
  }
}

export class CouponModel {
  /**
   * Busca un cupón por código
   * @param {string} code - Código del cupón
   * @returns {Promise<Object|null>}
   */
  static async findByCode(code) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM coupons WHERE code = ? AND status = "active"',
        [code]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching coupon by code:', error);
      throw error;
    }
  }

  /**
   * Obtiene un cupón por ID
   * @param {number} id_coupon - ID del cupón
   * @returns {Promise<Object|null>}
   */
  static async findById(id_coupon) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM coupons WHERE id_coupon = ?',
        [id_coupon]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching coupon by ID:', error);
      throw error;
    }
  }

  /**
   * Valida el código y que su producto esté en el carrito.
   * @param {string} code - Código del cupón
   * @param {Array} cartItems - Productos y cantidades del carrito
   * @returns {Promise<Object>} { valid: boolean, coupon: Object|null, message: string }
   */
  static async validate(code, cartItems = []) {
    try {
      if (typeof code !== 'string' || !code.trim()) {
        return { valid: false, coupon: null, message: 'Código de cupón requerido' };
      }

      const coupon = await this.findByCode(code.trim());

      if (!coupon) {
        return {
          valid: false,
          coupon: null,
          message: 'Cupón no válido o no activo',
        };
      }

      const productId = Number(coupon.product_id);
      if (!Number.isSafeInteger(productId) || productId <= 0) {
        return {
          valid: false,
          coupon: null,
          message: 'Este cupón no tiene un producto asignado',
        };
      }

      const hasEligibleProduct = Array.isArray(cartItems) && cartItems.some(
        (item) => Number(item?.product_id) === productId &&
          Number.isSafeInteger(Number(item?.quantity)) && Number(item.quantity) > 0
      );

      if (!hasEligibleProduct) {
        return {
          valid: false,
          coupon: null,
          message: 'Este cupón no aplica a los productos de tu carrito',
        };
      }

      return {
        valid: true,
        coupon: coupon,
        message: 'Cupón válido',
      };
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  }

  /**
   * Calcula el descuento basado en un cupón
   * @param {Object} coupon - Objeto cupón
   * @param {number} subtotal - Subtotal del producto autorizado, incluyendo su cantidad
   * @returns {number} Monto del descuento
   */
  static calculateDiscount(coupon, subtotal) {
    if (!coupon || !coupon.discount_value) return 0;

    const normalizedSubtotal = Number(subtotal || 0);
    const discountValue = Number(coupon.discount_value || 0);

    if (normalizedSubtotal <= 0 || discountValue <= 0) {
      return 0;
    }

    // Regla de negocio: se toma directamente el valor definido en coupons.discount_value.
    let discount = discountValue;

    // Compatibilidad futura: si luego existe max_discount en BD, se aplica automáticamente.
    if (coupon.max_discount !== undefined && coupon.max_discount !== null) {
      discount = Math.min(discount, Number(coupon.max_discount));
    }

    // El descuento nunca puede exceder el subtotal.
    const safeDiscount = Math.min(discount, normalizedSubtotal);
    return Number(safeDiscount.toFixed(2));
  }

  /**
   * Cuenta usos de un cupón por visitante
   * @param {number} coupon_id - ID del cupón
   * @param {number} visitor_id - ID del visitante
   * @returns {Promise<number>} Cantidad de usos
   */
  static async countUsageByVisitor(coupon_id, visitor_id) {
    try {
      const [result] = await pool.query(
        `SELECT COUNT(*) as usage_count FROM orders 
         WHERE coupon_id = ? AND visitor_id = ? AND paypal_transaction_id IS NOT NULL`,
        [coupon_id, visitor_id]
      );
      return result[0].usage_count || 0;
    } catch (error) {
      console.error('Error counting coupon usage:', error);
      throw error;
    }
  }
}
