import mysql from 'mysql2/promise';
import 'dotenv/config';
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

const hableError = (error) => {

  if (error?.sqlState === '23000') {
    return {
      status: false,
      message: 'Ya estas registrado con este correo electrónico...',
    }
  }


  return {
    status: false,
    message: 'Error al guardar tus datos, por favor intenta de nuevo.',
  }
}

export class RegisterModel {
  static async create_expositor_lead_ecomondo({
    sector,
    name,
    email,
    phone,
    message,
    company,
  }) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        "INSERT INTO expositor_landing_ecomondo	 ( sector, name, email, phone, message, company ) VALUES (?,?,?,?,?,?)",
        [sector, name, email, phone, message, company],
      );

      return {
        status: true,
        insertId: result.insertId,
        ...result,
      };
    } catch (error) {
      console.log(error);
      return hableError(error);
    } finally {
      await connection.end();
    }
  }

  static async create_suscriber_ecomondo({ name, email }) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        "INSERT INTO boletin_ecomondo ( name, email ) VALUES (?,?)",
        [name, email],
      );

      return {
        status: true,
        insertId: result.insertId,
        ...result,
      };
    } catch (error) {
      console.log(error);
      return hableError(error);
    } finally {
      await connection.end();
    }
  }

  static async create_user_ste({
    uuid,
    name,
    paternSurname,
    maternSurname,
    email,
    phone,
    typeRegister,
    genre,
    nacionality,
    code_invitation,

    company,
    rfcNif,
    industry,
    position,
    area,
    country,
    municipality,
    state,
    city,
    address,
    colonia,
    postalCode,
    webPage,
    phoneCompany,

    eventKnowledge,
    productInterest,
    levelInfluence,
    wannaBeExhibitor,
    alreadyVisited,
  }) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        "INSERT INTO visitors_ste_2026 (uuid, name, paternSurname, email, phone, typeRegister, genre, nacionality, code_invitation, company, rfcNif, industry, position, area, country, municipality, state, city, address, colonia, postalCode, webPage, phoneCompany, eventKnowledge, productInterest, levelInfluence, wannaBeExhibitor, alreadyVisited ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          uuid,
          name,
          paternSurname,
          email,
          phone,
          typeRegister,
          genre,
          nacionality,
          code_invitation,

          company,
          rfcNif,
          industry,
          position,
          area,
          country,
          municipality,
          state,
          city,
          address,
          colonia,
          postalCode,
          webPage,
          phoneCompany,

          eventKnowledge,
          productInterest,
          levelInfluence,
          wannaBeExhibitor,
          alreadyVisited,
        ],
      );

      return {
        status: true,
        insertId: result.insertId,
        ...result,
      };
    } catch (error) {
      console.log(error);
      return hableError(error);
    } finally {
      await connection.end();
    }
  }

  static async create_user_ecomondo_student({
    uuid,
    name,
    paternSurname,
    maternSurname,
    email,
    phone,
    typeRegister,
    genre,
    nacionality,
    code_invitation,

    company,
    industry,
    position,
    area,
    country,
    municipality,
    state,
    city,
    address,
    colonia,
    postalCode,
    webPage,
    phoneCompany,

    eventKnowledge,
    productInterest,
    levelInfluence,
    wannaBeExhibitor,
    alreadyVisited,
  }) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        "INSERT INTO users_ecomodo_students_2026 (uuid, name, paternSurname, maternSurname, email, phone, typeRegister, genre, nacionality, code_invitation, company, industry, position, area, country, municipality, state, city, address, colonia, postalCode, webPage, phoneCompany, eventKnowledge, productInterest, levelInfluence, wannaBeExhibitor, alreadyVisited, user_ecomondo ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?)",
        [
          uuid,
          name,
          paternSurname,
          maternSurname,
          email,
          phone,
          typeRegister,
          genre,
          nacionality,
          code_invitation,

          company,
          industry,
          position,
          area,
          country,
          municipality,
          state,
          city,
          address,
          colonia,
          postalCode,
          webPage,
          phoneCompany,

          eventKnowledge,
          productInterest,
          levelInfluence,
          wannaBeExhibitor,
          alreadyVisited,
          "si",
        ],
      );

      return {
        status: true,
        insertId: result.insertId,
        ...result,
      };
    } catch (error) {
      console.log(error);
      return hableError(error);
    } finally {
      await connection.end();
    }
  }

  // Funcion para guardar usuarios desde registro en sitio
  static async create_user_ecomondo_sitio({
    uuid,
    name,
    paternSurname,
    maternSurname,
    email,
    phone,
    typeRegister,
    genre,
    nacionality,
    code_invitation,

    company,
    industry,
    position,
    area,
    country,
    municipality,
    state,
    city,
    address,
    colonia,
    postalCode,
    webPage,
    phoneCompany,

    eventKnowledge,
    productInterest,
    levelInfluence,
    wannaBeExhibitor,
    alreadyVisited,
  }) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        "INSERT INTO users_ecomondo (uuid, name, paternSurname, maternSurname, email, phone, typeRegister, genre, nacionality, code_invitation, company, industry, position, area, country, municipality, state, city, address, colonia, postalCode, webPage, phoneCompany, eventKnowledge, productInterest, levelInfluence, wannaBeExhibitor, alreadyVisited, user_ecomondo, registro_en_sitio ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?)",
        [
          uuid,
          name,
          paternSurname,
          maternSurname,
          email,
          phone,
          typeRegister,
          genre,
          nacionality,
          code_invitation,

          company,
          industry,
          position,
          area,
          country,
          municipality,
          state,
          city,
          address,
          colonia,
          postalCode,
          webPage,
          phoneCompany,

          eventKnowledge,
          productInterest,
          levelInfluence,
          wannaBeExhibitor,
          alreadyVisited,
          "si",
          1,
        ],
      );

      return {
        status: true,
        insertId: result.insertId,
        ...result,
      };
    } catch (error) {
      console.log(error);
      return hableError(error);
    } finally {
      await connection.end();
    }
  }

  static async update_print_user(uuid) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        "UPDATE users_ecomondo SET imprimir_gafete	 = 1 WHERE uuid = ?",
        [uuid],
      );
      return {
        status: true,
        result,
      };
    } finally {
      await connection.end(); // Close the connection
    }
  }

  static async search_user(uuid) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        "SELECT * FROM users_ecomondo WHERE uuid = ?",
        [uuid],
      );
      if (result.length === 0) {
        return {
          status: false,
          message: "No se encontró el usuario",
        };
      } else {
        return {
          status: true,
          user: { ...result[0] },
        };
      }
    } finally {
      await connection.end(); // Close the connection
    }
  }

  static async save_order(user_id, product_id, total, id_order) {
    const connection = await mysql.createConnection(config);
    try {
      const [registers] = await connection.query(
        "INSERT INTO users_ecomondo_trip (user_id, product_id, total, id_order) VALUES (?,?,?,?)",
        [user_id, product_id.toString(), total, id_order],
      );
      return registers;
    } finally {
      await connection.end(); // Close the connection
    }
  }

  static async get_user_by_email(email) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT * FROM users_ecomondo WHERE email = ?",
        [email],
      );
      if (users.length === 0) {
        return {
          status: false,
          error: "No se encontró el usuario",
        };
      }

      return {
        status: true,
        ...users[0],
      };
    } finally {
      await connection.end();
    }
  }

  static async get_ecomondo_trip() {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT * FROM users_ecomondo_trip",
      );
      return users;
    } finally {
      await connection.end();
    }
  }

  // check code cortesia
  static async check_code_cortesia(code_cortesia) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        'SELECT * FROM codigos_cortesia WHERE code = ? AND already_used = "" ',
        [code_cortesia],
      );
      if (result.length === 0) {
        return {
          status: false,
          message: "Código invalido",
        };
      } else {
        return {
          status: true,
          result,
        };
      }
    } finally {
      await connection.end(); // Close the connection
    }
  }

  // use code cortesia
  static async use_code_cortesia(code_cortesia) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        'UPDATE codigos_cortesia SET already_used="si" WHERE code = ?',
        [code_cortesia],
      );
      if (result.length === 0) {
        return {
          status: false,
          message: "Código invalido",
        };
      } else {
        return {
          status: true,
          result,
        };
      }
    } finally {
      await connection.end(); // Close the connection
    }
  }

  // get product to calculate total
  static async get_products() {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query("SELECT * FROM products");
      return {
        status: true,
        result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
      };
    } finally {
      await connection.end(); // Close the connection
    }
  }

  static async get_info_user(uuid) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        'SELECT id, uuid, name, paternSurname, maternSurname, company, position,  phone, email, country city, municipality, CASE WHEN user_amof IS NULL THEN "ITM"  ELSE "AMOF"  END AS event  FROM users WHERE uuid = ?',
        [uuid],
      );
      if (result.length === 0) {
        return {
          status: false,
          message: "No se encontró el usuario",
        };
      }
      return {
        status: true,
        result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
      };
    } finally {
      await connection.end(); // Close the connection
    }
  }

  // checar si el usuario ya visito antes la feria
  static async get_user_visit_last_fair(email) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT * FROM users_ecomondo WHERE email = ?",
        [email],
      );

      if (users.length === 0) {
        return {
          status: false,
          error: "No se encontró el usuario",
        };
      } else {
        return {
          status: true,
          ...users[0],
        };
      }
    } finally {
      await connection.end();
    }
  }

  // Obtener usuario por email para reimpresion de gafete
  static async get_raw_user_by_email(email) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT * FROM users_ecomondo_2026 WHERE email = ? ORDER BY id DESC LIMIT 1",
        [email],
      );
      if (users.length === 0) {
        return { status: false, error: "No se encontró el usuario" };
      }
      return { status: true, user: users[0] };
    } finally {
      await connection.end();
    }
  }

  // Validar si un usuario ya existe en tabla users_ste_2026
  static async check_user_exists_2026(email) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT id FROM visitors_ste_2026 WHERE email = ? LIMIT 1",
        [email],
      );
      return users.length > 0;
    } finally {
      await connection.end();
    }
  }

  // Validar si un usuario ya existe en tabla users_ste_students_2026
  static async check_student_user_exists_2026(email) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT id FROM users_ste_students_2026 WHERE email = ? LIMIT 1",
        [email],
      );
      return users.length > 0;
    } finally {
      await connection.end();
    }
  }

  // Validar si un usuario ya existe en tabla boletin_ecomondo
  static async check_subscriber_exists(email) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT id FROM boletin_ecomondo WHERE email = ? LIMIT 1",
        [email],
      );
      return users.length > 0;
    } finally {
      await connection.end();
    }
  }

  // Validar si un usuario ya existe en tabla expositor_landing_ecomondo
  static async check_expositor_exists(email) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT id FROM expositor_landing_ecomondo WHERE email = ? LIMIT 1",
        [email],
      );
      return users.length > 0;
    } finally {
      await connection.end();
    }
  }

  // ============================================================
  //  TALLERES — Consultas y registro de asistencia
  // ============================================================

  // -------------------------------------------------------------------
  // Buscar un VISITANTE por su correo.
  // Se usa en el Paso 1 del formulario y también antes de registrar.
  // -------------------------------------------------------------------
  static async get_visitor_ste_by_email(email) {
    // Abrimos una conexión a la base con la configuración (host, user, etc.).
    const connection = await mysql.createConnection(config);
    try {
      // Consulta: traer los datos del visitante cuyo correo coincida.
      //   El "?" es un parámetro seguro: evita inyección SQL (el correo
      //   entra como dato, no como código).
      //   LIMIT 1: nos basta con el primero (el correo es único).
      const [rows] = await connection.query(
        "SELECT id, uuid, name, paternSurname, email, phone, company, position " +
          "FROM visitors_ste_2026 WHERE email = ? LIMIT 1",
        [email],
      );
      // rows es un arreglo. Si hay resultado devolvemos el primero;
      //   si no, devolvemos null (no existe ese visitante).
      return rows[0] || null;
    } finally {
      // finally se ejecuta SIEMPRE (haya o no error): cerramos la conexión
      //   para no dejar conexiones abiertas.
      await connection.end();
    }
  }

  // -------------------------------------------------------------------
  // Listar los TALLERES activos con su cupo y sus inscritos.
  // Alimenta el catálogo (barra de cupo) y la lista del formulario.
  // Traemos id, nombres y capacity (el cupo total). Y con una
  //   subconsulta contamos cuántas inscripciones hay para CADA taller
  //   (esto es "registered" = inscritos reales).
  //   Así el cupo disponible siempre es exacto: capacity - registered.
  // WHERE is_active = 1: solo talleres visibles.
  // ORDER BY workshop_id: orden estable (1, 2, 3, 4).
  // -------------------------------------------------------------------
  static async get_active_workshops() {
    const connection = await mysql.createConnection(config);

    try {
      const [rows] = await connection.query(
        `SELECT w.workshop_id, w.name_es, w.name_en, w.capacity,(SELECT COUNT(*) FROM workshop_attendance a WHERE a.workshop_id = w.workshop_id) AS registered FROM workshops w WHERE w.is_active = 1 ORDER BY w.workshop_id`,
      );
      
      // Devolvemos todas las filas (cada taller con capacity y registered).
      return rows;
    } finally {
      await connection.end();
    }
  }

  // -------------------------------------------------------------------
  // Traer UN taller por su id (para validarlo antes de inscribir).
  // -------------------------------------------------------------------
  static async get_workshop_by_id(id) {
    const connection = await mysql.createConnection(config);
    try {
      const [rows] = await connection.query(
        // Solo talleres activos (is_active = 1) y con ese id.
        "SELECT * FROM workshops WHERE workshop_id = ? AND is_active = 1 LIMIT 1",
        [id],
      );
      // El taller si existe, o null si no.
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }

  // -------------------------------------------------------------------
  // Registrar la ASISTENCIA (inscripción) de un visitante a un taller.
  // La restricción única de la tabla evita duplicados automáticamente.
  // -------------------------------------------------------------------
  static async register_workshop_attendance({ workshop_id, visitor_id, uuid }) {
    const connection = await mysql.createConnection(config);
    try {
      // Insertamos la inscripción. Si el visitante YA estaba inscrito a ese
      //   taller, la base lanza un error de "entrada duplicada".
      await connection.query(
        "INSERT INTO workshop_attendance (workshop_id, visitor_id, uuid) VALUES (?,?,?)",
        [workshop_id, visitor_id, uuid],
      );
      // Si llegó aquí, se guardó bien.
      return { status: true };
    } catch (error) {
      // Detectamos el error de duplicado (código ER_DUP_ENTRY / sqlState 23000)
      //   y respondemos amablemente en vez de romper: "ya estás registrado".
      if (error?.code === "ER_DUP_ENTRY" || error?.sqlState === "23000") {
        return {
          status: false,
          duplicate: true,
          message: "Ya estás registrado a este taller.",
        };
      }
      // Cualquier otro error: lo registramos y devolvemos un mensaje genérico.
      console.log(error);
      return { status: false, message: "Error al registrar tu asistencia." };
    } finally {
      await connection.end();
    }
  }
}