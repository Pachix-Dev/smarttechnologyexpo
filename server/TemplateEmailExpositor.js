const email_template_expositor = ({
  sector,
  name,
  email,
  company,
  phone,
  message,
}) => {
  return `
  <div
  style="
    margin: 0;
    padding: 32px 16px;
    background-color: #f3f4f6;
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
  "
>
  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    "
  >
    <tr>
      <td
        style="
          padding: 28px 32px;
          background-color: #E30613;
          border-radius: 8px 8px 0 0;
          text-align: center;
        "
      >
        <h1
          style="
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            line-height: 32px;
          "
        >
          NUEVA SOLICITUD DE INFORMACIÓN
        </h1>

        <p
          style="
            margin: 8px 0 0;
            color: #ffffff;
            font-size: 14px;
            line-height: 21px;
          "
        >
          Un expositor potencial ha enviado sus datos de contacto.
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding: 32px">
        <p
          style="
            margin: 0 0 20px;
            color: #4b5563;
            font-size: 15px;
            line-height: 24px;
          "
        >
          A continuación se muestra la información recibida:
        </p>

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e5e7eb;
          "
        >
          <tr>
            <td
              width="32%"
              style="
                padding: 12px 16px;
                background-color: #f8fafc;
                border-bottom: 1px solid #e5e7eb;
                font-weight: bold;
              "
            >
              Sector
            </td>
            <td
              style="
                padding: 12px 16px;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              ${sector}
            </td>
          </tr>

          <tr>
            <td
              style="
                padding: 12px 16px;
                background-color: #f8fafc;
                border-bottom: 1px solid #e5e7eb;
                font-weight: bold;
              "
            >
              Nombre
            </td>
            <td
              style="
                padding: 12px 16px;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              ${name}
            </td>
          </tr>

          <tr>
            <td
              style="
                padding: 12px 16px;
                background-color: #f8fafc;
                border-bottom: 1px solid #e5e7eb;
                font-weight: bold;
              "
            >
              Correo electrónico
            </td>
            <td
              style="
                padding: 12px 16px;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              <a
                href="mailto:${email}"
                style="color: #005ea8; text-decoration: none"
              >
                ${email}
              </a>
            </td>
          </tr>

          <tr>
            <td
              style="
                padding: 12px 16px;
                background-color: #f8fafc;
                border-bottom: 1px solid #e5e7eb;
                font-weight: bold;
              "
            >
              Empresa
            </td>
            <td
              style="
                padding: 12px 16px;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              ${company}
            </td>
          </tr>

          <tr>
            <td
              style="
                padding: 12px 16px;
                background-color: #f8fafc;
                border-bottom: 1px solid #e5e7eb;
                font-weight: bold;
              "
            >
              Teléfono
            </td>
            <td
              style="
                padding: 12px 16px;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              <a
                href="tel:${phone}"
                style="color: #005ea8; text-decoration: none"
              >
                ${phone}
              </a>
            </td>
          </tr>

          <tr>
            <td
              style="
                padding: 12px 16px;
                background-color: #f8fafc;
                font-weight: bold;
                vertical-align: top;
              "
            >
              Mensaje
            </td>
            <td
              style="
                padding: 12px 16px;
                line-height: 22px;
                white-space: pre-line;
                overflow-wrap: anywhere;
              "
            >
              ${message}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td
        style="
          padding: 20px 32px;
          background-color: #f8fafc;
          border-top: 1px solid #e5e7eb;
          border-radius: 0 0 8px 8px;
          text-align: center;
        "
      >
        <p
          style="
            margin: 0;
            color: #ffffff;
            font-size: 12px;
            line-height: 18px;
          "
        >
          Italian German Exhibition Company México
        </p>
      </td>
    </tr>
  </table>
</div>
  `;
};

export { email_template_expositor };
