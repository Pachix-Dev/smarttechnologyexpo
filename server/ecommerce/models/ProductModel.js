import mysql from 'mysql2/promise';
import 'dotenv/config';

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export class ProductModel {
  /**
   * Obtiene todos los productos activos con disponibilidad calculada
   * @returns {Promise<Array>} Array de productos con available_capacity
   */
  static async getActiveProducts() {
    const connection = await mysql.createConnection(config);
    try {
      const [products] = await connection.query(
        `SELECT * FROM products WHERE status = 'active' ORDER BY event_date ASC`
      );

      // Calcular disponibilidad para cada producto
      const productsWithAvailability = await Promise.all(
        products.map(async (product) => {
          const available = await this.getAvailableCapacity(product.id_product);
          return {
            ...product,
            available_capacity: available,
          };
        })
      );

      return productsWithAvailability;
    } catch (error) {
      console.error('Error fetching active products:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Obtiene un producto por ID
   * @param {number} id_product - ID del producto
   * @returns {Promise<Object|null>}
   */
  static async findById(id_product) {
    const connection = await mysql.createConnection(config);
    try {
      const [rows] = await connection.query(
        'SELECT * FROM products WHERE id_product = ?',
        [id_product]
      );
      if (rows.length === 0) return null;

      const product = rows[0];
      const available = await this.getAvailableCapacity(id_product);
      return {
        ...product,
        available_capacity: available,
      };
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Calcula la capacidad disponible de un producto
   * Cuenta boletos ya vendidos y los resta de la capacidad total
   * @param {number} id_product - ID del producto
   * @returns {Promise<number>} Capacidad disponible
   */
  static async getAvailableCapacity(id_product) {
    const connection = await mysql.createConnection(config);
    try {
      const [product] = await connection.query(
        'SELECT capacity_limit FROM products WHERE id_product = ?',
        [id_product]
      );

      if (product.length === 0 || product[0].capacity_limit === null) {
        return null; // Sin límite de capacidad
      }

      const capacityLimit = product[0].capacity_limit;

      // Contar boletos pagados (órdenes que existen en la base de datos)
      const [sold] = await connection.query(
        `SELECT COUNT(*) as sold_count FROM ticket_purchases 
         WHERE product_id = ? AND order_id IN (
           SELECT id_order FROM orders WHERE paypal_transaction_id IS NOT NULL
         )`,
        [id_product]
      );

      const soldCount = sold[0].sold_count || 0;
      const available = Math.max(0, capacityLimit - soldCount);

      return available;
    } catch (error) {
      console.error('Error calculating available capacity:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Valida que los productos existan y estén activos
   * @param {Array<number>} productIds - Array de IDs de productos
   * @returns {Promise<boolean>}
   */
  static async validateProductsExist(productIds) {
    const connection = await mysql.createConnection(config);
    try {
      const placeholders = productIds.map(() => '?').join(',');
      const [results] = await connection.query(
        `SELECT COUNT(*) as count FROM products 
         WHERE id_product IN (${placeholders}) AND status = 'active'`,
        productIds
      );
      return results[0].count === productIds.length;
    } catch (error) {
      console.error('Error validating products:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  /**
   * Obtiene múltiples productos por IDs
   * @param {Array<number>} productIds - Array de IDs
   * @returns {Promise<Array>}
   */
  static async findByIds(productIds) {
    const connection = await mysql.createConnection(config);
    try {
      const placeholders = productIds.map(() => '?').join(',');
      const [products] = await connection.query(
        `SELECT * FROM products WHERE id_product IN (${placeholders})`,
        productIds
      );
      return products;
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }
}
