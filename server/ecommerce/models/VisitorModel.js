import { pool } from './db-pool.js';

export class VisitorModel {
  /**
   * Busca un visitante por email en la tabla visitors_ste_2026
   * @param {string} email - Email del visitante
   * @returns {Promise<Object|null>} Objeto visitante o null
   */
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM visitors_ste_2026 WHERE email = ?',
        [email]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching visitor by email:', error);
      throw error;
    }
  }

  /**
   * Busca un visitante por ID
   * @param {number} id - ID del visitante
   * @returns {Promise<Object|null>} Objeto visitante o null
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM visitors_ste_2026 WHERE id = ?',
        [id]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching visitor by ID:', error);
      throw error;
    }
  }

  /**
   * Valida si un visitante existe
   * @param {string} email - Email del visitante
   * @returns {Promise<boolean>}
   */
  static async exists(email) {
    const visitor = await this.findByEmail(email);
    return visitor !== null;
  }
}
