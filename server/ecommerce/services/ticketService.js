import mysql from 'mysql2/promise';
import 'dotenv/config';

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

/**
 * Ticket Service
 * Responsable de crear registros de boletos después del pago
 * Un boleto = un acceso vendido
 * Si quantity = 5, crea 5 boletos
 */

export class TicketService {
  /**
   * Crea boletos para una orden
   * @param {number} order_id - ID de la orden
   * @param {number} visitor_id - ID del visitante que compró
   * @param {Array} items - Items de compra [{product_id, quantity, unit_price}, ...]
   * @returns {Promise<Array>} Array de IDs de boletos creados
   */
  static async createTickets(order_id, visitor_id, items) {
    const connection = await mysql.createConnection(config);
    try {
      const ticketIds = [];

      for (const item of items) {
        const { product_id, quantity, unit_price } = item;

        // Crear tantos boletos como quantity
        for (let i = 0; i < quantity; i++) {
          const [result] = await connection.query(
            `INSERT INTO ticket_purchases (order_id, visitor_id, product_id, unit_price, status)
             VALUES (?, ?, ?, ?, 0)`,
            [order_id, visitor_id, product_id, unit_price]
          );

          ticketIds.push(result.insertId);
        }
      }

      return ticketIds;
    } catch (error) {
      console.error('Error creating tickets:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Obtiene boletos de una orden
   * @param {number} order_id - ID de la orden
   * @returns {Promise<Array>} Array de boletos
   */
  static async getTicketsByOrderId(order_id) {
    const connection = await mysql.createConnection(config);
    try {
      const [tickets] = await connection.query(
        `SELECT tp.*, p.name as product_name, p.event_date 
         FROM ticket_purchases tp
         JOIN products p ON tp.product_id = p.id_product
         WHERE tp.order_id = ?
         ORDER BY tp.created_at ASC`,
        [order_id]
      );

      return tickets;
    } catch (error) {
      console.error('Error fetching tickets by order ID:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Obtiene boletos de un visitante
   * @param {number} visitor_id - ID del visitante
   * @returns {Promise<Array>} Array de boletos
   */
  static async getTicketsByVisitorId(visitor_id) {
    const connection = await mysql.createConnection(config);
    try {
      const [tickets] = await connection.query(
        `SELECT tp.*, p.name as product_name, p.event_date, o.purchase_date
         FROM ticket_purchases tp
         JOIN products p ON tp.product_id = p.id_product
         JOIN orders o ON tp.order_id = o.id_order
         WHERE tp.visitor_id = ? AND o.paypal_transaction_id IS NOT NULL
         ORDER BY o.purchase_date DESC`,
        [visitor_id]
      );

      return tickets;
    } catch (error) {
      console.error('Error fetching tickets by visitor ID:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Obtiene el conteo de boletos vendidos para un producto
   * @param {number} product_id - ID del producto
   * @returns {Promise<number>} Cantidad de boletos vendidos
   */
  static async getTicketCountByProduct(product_id) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        `SELECT COUNT(*) as count FROM ticket_purchases 
         WHERE product_id = ? AND order_id IN (
           SELECT id_order FROM orders WHERE paypal_transaction_id IS NOT NULL
         )`,
        [product_id]
      );

      return result[0].count || 0;
    } catch (error) {
      console.error('Error getting ticket count:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Marca un boleto como usado (cuando se escanea en el evento)
   * @param {number} ticket_id - ID del boleto
   * @returns {Promise<void>}
   */
  static async markTicketAsUsed(ticket_id) {
    const connection = await mysql.createConnection(config);
    try {
      await connection.query(
        `UPDATE ticket_purchases SET status = 1, used_at = NOW() WHERE id_ticket = ?`,
        [ticket_id]
      );
    } catch (error) {
      console.error('Error marking ticket as used:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Obtiene un boleto específico
   * @param {number} ticket_id - ID del boleto
   * @returns {Promise<Object|null>}
   */
  static async getTicketById(ticket_id) {
    const connection = await mysql.createConnection(config);
    try {
      const [rows] = await connection.query(
        `SELECT tp.*, p.name as product_name, p.event_date
         FROM ticket_purchases tp
         JOIN products p ON tp.product_id = p.id_product
         WHERE tp.id_ticket = ?`,
        [ticket_id]
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching ticket by ID:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }
}
