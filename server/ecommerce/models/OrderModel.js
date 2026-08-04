import mysql from 'mysql2/promise';
import 'dotenv/config';

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export class OrderModel {
  /**
   * Crea una nueva orden (antes de PayPal)
   * @param {Object} orderData - Datos de la orden
   * @returns {Promise<Object>} Objeto con id_order
   */
  static async create(orderData) {
    const connection = await mysql.createConnection(config);
    try {
      const {
        visitor_id,
        total_amount,
        discount_amount,
        final_amount,
        coupon_id,
        paypal_order_id,
        paypal_transaction_id,
      } =
        orderData;

      const [result] = await connection.query(
        `INSERT INTO orders (
          visitor_id,
          total_amount,
          discount_amount,
          final_amount,
          coupon_id,
          paypal_order_id,
          paypal_transaction_id
        )
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          visitor_id,
          total_amount,
          discount_amount,
          final_amount,
          coupon_id || null,
          paypal_order_id || null,
          paypal_transaction_id || null,
        ]
      );

      return {
        id_order: result.insertId,
        ...orderData,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Obtiene una orden por ID
   * @param {number} id_order - ID de la orden
   * @returns {Promise<Object|null>}
   */
  static async findById(id_order) {
    const connection = await mysql.createConnection(config);
    try {
      const [rows] = await connection.query(
        'SELECT * FROM orders WHERE id_order = ?',
        [id_order]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Obtiene una orden por PayPal Order ID
   * @param {string} paypal_order_id - PayPal Order ID
   * @returns {Promise<Object|null>}
   */
  static async findByPayPalOrderId(paypal_order_id) {
    const connection = await mysql.createConnection(config);
    try {
      const [rows] = await connection.query(
        'SELECT * FROM orders WHERE paypal_order_id = ?',
        [paypal_order_id]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching order by PayPal Order ID:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Actualiza una orden con información de PayPal
   * @param {number} id_order - ID de la orden
   * @param {Object} paypalData - Datos de PayPal
   * @returns {Promise<void>}
   */
  static async updatePayPalData(id_order, paypalData) {
    const connection = await mysql.createConnection(config);
    try {
      const { paypal_order_id, paypal_transaction_id } = paypalData;

      await connection.query(
        `UPDATE orders SET paypal_order_id = ?, paypal_transaction_id = ? WHERE id_order = ?`,
        [paypal_order_id, paypal_transaction_id, id_order]
      );
    } catch (error) {
      console.error('Error updating PayPal data:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Obtiene todas las órdenes de un visitante
   * @param {number} visitor_id - ID del visitante
   * @returns {Promise<Array>}
   */
  static async getByVisitorId(visitor_id) {
    const connection = await mysql.createConnection(config);
    try {
      const [orders] = await connection.query(
        `SELECT * FROM orders WHERE visitor_id = ? ORDER BY purchase_date DESC`,
        [visitor_id]
      );
      return orders;
    } catch (error) {
      console.error('Error fetching orders by visitor ID:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Verifica si una orden tiene transacción de PayPal
   * @param {number} id_order - ID de la orden
   * @returns {Promise<boolean>}
   */
  static async hasPayPalTransaction(id_order) {
    const connection = await mysql.createConnection(config);
    try {
      const [rows] = await connection.query(
        'SELECT paypal_transaction_id FROM orders WHERE id_order = ?',
        [id_order]
      );
      return rows.length > 0 && rows[0].paypal_transaction_id !== null;
    } catch (error) {
      console.error('Error checking PayPal transaction:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Obtiene el total de órdenes pagadas
   * @returns {Promise<number>}
   */
  static async getTotalPaidOrders() {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        `SELECT COUNT(*) as count FROM orders WHERE paypal_transaction_id IS NOT NULL`
      );
      return result[0].count || 0;
    } catch (error) {
      console.error('Error getting total paid orders:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }
}
