import { pool } from './db-pool.js';

export class ProductModel {
  /**
   * Obtiene todos los productos activos con disponibilidad calculada
   * @returns {Promise<Array>} Array de productos con available_capacity
   */
  static async getActiveProducts() {
    try {
      const [products] = await pool.query(
        `SELECT p.*,
           CASE
             WHEN p.capacity_limit IS NULL THEN NULL
             ELSE GREATEST(0, p.capacity_limit - COALESCE(sold.sold_count, 0))
           END AS available_capacity
         FROM products p
         LEFT JOIN (
           SELECT tp.product_id, COUNT(*) AS sold_count
           FROM ticket_purchases tp
           INNER JOIN orders o ON o.id_order = tp.order_id
             AND o.paypal_transaction_id IS NOT NULL
           GROUP BY tp.product_id
         ) sold ON sold.product_id = p.id_product
         WHERE p.status = 'active'
         ORDER BY p.event_date ASC`
      );
      return products;
    } catch (error) {
      console.error('Error fetching active products:', error);
      throw error;
    }
  }

  /**
   * Obtiene un producto por ID
   * @param {number} id_product - ID del producto
   * @returns {Promise<Object|null>}
   */
  static async findById(id_product) {
    try {
      const [rows] = await pool.query(
        `SELECT p.*,
           CASE
             WHEN p.capacity_limit IS NULL THEN NULL
             ELSE GREATEST(0, p.capacity_limit - COALESCE(sold.sold_count, 0))
           END AS available_capacity
         FROM products p
         LEFT JOIN (
           SELECT tp.product_id, COUNT(*) AS sold_count
           FROM ticket_purchases tp
           INNER JOIN orders o ON o.id_order = tp.order_id
             AND o.paypal_transaction_id IS NOT NULL
           GROUP BY tp.product_id
         ) sold ON sold.product_id = p.id_product
         WHERE p.id_product = ?`,
        [id_product]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  /**
   * Calcula la capacidad disponible de un producto
   * Cuenta boletos ya vendidos y los resta de la capacidad total
   * @param {number} id_product - ID del producto
   * @returns {Promise<number>} Capacidad disponible
   */
  static async getAvailableCapacity(id_product) {
    try {
      const [rows] = await pool.query(
        `SELECT
           CASE
             WHEN p.capacity_limit IS NULL THEN NULL
             ELSE GREATEST(0, p.capacity_limit - COALESCE(sold.sold_count, 0))
           END AS available_capacity
         FROM products p
         LEFT JOIN (
           SELECT tp.product_id, COUNT(*) AS sold_count
           FROM ticket_purchases tp
           INNER JOIN orders o ON o.id_order = tp.order_id
             AND o.paypal_transaction_id IS NOT NULL
           WHERE tp.product_id = ?
           GROUP BY tp.product_id
         ) sold ON sold.product_id = p.id_product
         WHERE p.id_product = ?`,
        [id_product, id_product]
      );
      if (rows.length === 0) return null;
      return rows[0].available_capacity;
    } catch (error) {
      console.error('Error calculating available capacity:', error);
      throw error;
    }
  }

  /**
   * Valida que los productos existan y estén activos
   * @param {Array<number>} productIds - Array de IDs de productos
   * @returns {Promise<boolean>}
   */
  static async validateProductsExist(productIds) {
    try {
      const placeholders = productIds.map(() => '?').join(',');
      const [results] = await pool.query(
        `SELECT COUNT(*) as count FROM products WHERE id_product IN (${placeholders}) AND status = 'active'`,
        productIds
      );
      return results[0].count === productIds.length;
    } catch (error) {
      console.error('Error validating products:', error);
      throw error;
    }
  }

  /**
   * Obtiene múltiples productos por IDs
   * @param {Array<number>} productIds - Array de IDs
   * @returns {Promise<Array>}
   */
  static async findByIds(productIds) {
    try {
      const placeholders = productIds.map(() => '?').join(',');
      const [products] = await pool.query(
        `SELECT * FROM products WHERE id_product IN (${placeholders})`,
        productIds
      );
      return products;
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      throw error;
    }
  }
}
