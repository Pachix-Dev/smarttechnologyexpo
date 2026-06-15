const email_template_ecomondo = async ({  name,   paternSurname,  maternSurname = "" }) => {

  return `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#e9e9e9; margin:0; padding:20px 0;">
    <tr>
      <td align="center">

        <!-- Contenedor principal -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="width:600px; max-width:600px; background-color:#ffffff;">
          
          <!-- Header / Banner principal -->
          <tr>
            <td align="center">
              <img 
                src="https://smarttechnologyexpo.mx/header_email_ste.jpg" 
                alt="Smart Technology Expo 2026" 
                width="600" 
                style="display:block; width:100%; max-width:600px; border:0;"
              />
            </td>
          </tr>

          <!-- Título -->
          <tr>
            <td align="center" style="padding:24px 30px 8px 30px;">
              <div style="font-size:20px; font-weight:bold; color:#000000; line-height:1.3;">
                ¡BIENVENIDO(A)!<br /> ${name} ${paternSurname} ${maternSurname} <br />
                TU REGISTRO SE HA REALIZADO CON ÉXITO
              </div>
            </td>
          </tr>

          <!-- Texto de introducción -->
          <tr>
            <td align="center" style="padding:0 30px 16px 30px;">
              <div style="font-size:15px; line-height:1.6; color:#333333; text-align:center;">
                Gracias por formar parte de <strong>Smart Technology Expo 2026</strong>, el punto de encuentro que impulsa la adopción de innovación aplicada, fortalece las cadenas de valor industriales y genera oportunidades reales de negocio, networking estratégico y colaboración tecnológica para las empresas que buscan crecer dentro del nuevo entorno industrial del país.
              </div>
            </td>
          </tr>

          <!-- Información del evento -->
          <tr>
            <td align="center" style="padding:6px 30px 12px 30px;">
              <div style="font-size:15px; font-weight:bold; color:#222222; margin-bottom:10px;">
                INFORMACIÓN DEL EVENTO
              </div>

              <table border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:#ef2b2d; border-radius:12px; padding:14px 22px;">
                    <div style="font-size:20px; font-weight:bold; color:#ffffff; line-height:1.3;">
                      18 al 20 de noviembre de 2026
                    </div>
                    <div style="font-size:16px; color:#ffffff; line-height:1.4;">
                      11:00 hrs. a 18:00 hrs.
                    </div>
                    <div style="font-size:15px; color:#ffffff; line-height:1.4;">
                      Expo Guadalajara, Jalisco, México
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Añade al calendario -->
          <tr>
            <td align="center" style="padding:14px 20px 8px 20px;">
              <div style="font-size:15px; font-weight:bold; color:#222222;">
                AÑADE EL EVENTO A TU CALENDARIO
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:8px 20px 20px 20px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:6px;">
                    <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Smart%20Technology%20Expo%202026&dates=20261118T170000Z%2F20261121T000000Z&details=El%20punto%20de%20encuentro%20que%20impulsa%20la%20adopci%C3%B3n%20de%20innovaci%C3%B3n%20aplicada%2C%20fortalece%20las%20cadenas%20de%20valor%20industriales%20y%20genera%20oportunidades%20reales%20de%20negocio%2C%20networking%20estrat%C3%A9gico%20y%20colaboraci%C3%B3n%20tecnol%C3%B3gica%20para%20las%20empresas%20que%20buscan%20crecer%20dentro%20del%20nuevo%20entorno%20industrial%20del%20pa%C3%ADs.&location=Expo%20Guadalajara%2C%20Guadalajara%2C%20Jalisco&ctz=America%2FMexico_City" target="_blank">
                      <img src="https://smarttechnologyexpo.mx/btn_google_calendar.png" alt="Google Calendar" width="110" style="display:block; border:0;" />
                    </a>
                  </td>
                  <td style="padding:6px;">
                    <a href="https://outlook.live.com/calendar/0/action/compose?rru=addevent&subject=Smart%20Technology%20Expo%202026&startdt=2026-11-18T11%3A00%3A00-06%3A00&enddt=2026-11-20T18%3A00%3A00-06%3A00&body=El%20punto%20de%20encuentro%20que%20impulsa%20la%20adopci%C3%B3n%20de%20innovaci%C3%B3n%20aplicada%2C%20fortalece%20las%20cadenas%20de%20valor%20industriales%20y%20genera%20oportunidades%20reales%20de%20negocio%2C%20networking%20estrat%C3%A9gico%20y%20colaboraci%C3%B3n%20tecnol%C3%B3gica%20para%20las%20empresas%20que%20buscan%20crecer%20dentro%20del%20nuevo%20entorno%20industrial%20del%20pa%C3%ADs.&location=Expo%20Guadalajara%2C%20Guadalajara%2C%20Jalisco&allday=false" target="_blank">
                      <img src="https://smarttechnologyexpo.mx/btn_outlook.png" alt="Outlook" width="110" style="display:block; border:0;" />
                    </a>
                  </td>
                  <td style="padding:6px;">
                    <a href="https://calendar.yahoo.com/?v=60&title=Smart%20Technology%20Expo%202026&st=20261118T170000Z&et=20261121T000000Z&desc=El%20punto%20de%20encuentro%20que%20impulsa%20la%20adopci%C3%B3n%20de%20innovaci%C3%B3n%20aplicada%2C%20fortalece%20las%20cadenas%20de%20valor%20industriales%20y%20genera%20oportunidades%20reales%20de%20negocio%2C%20networking%20estrat%C3%A9gico%20y%20colaboraci%C3%B3n%20tecnol%C3%B3gica%20para%20las%20empresas%20que%20buscan%20crecer%20dentro%20del%20nuevo%20entorno%20industrial%20del%20pa%C3%ADs.&in_loc=Expo%20Guadalajara%2C%20Guadalajara%2C%20Jalisco" target="_blank">
                      <img src="https://smarttechnologyexpo.mx/btn_yahoo.png" alt="Yahoo!" width="110" style="display:block; border:0;" />
                    </a>
                  </td>
                  <td style="padding:6px;">
                    <a href="https://smarttechnologyexpo.mx/calendar-ste-2026.ics" target="_blank">
                      <img src="https://smarttechnologyexpo.mx/btn_icalendar.png" alt="iCalendar" width="110" style="display:block; border:0;" />
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ubica la sede -->
          <tr>
            <td align="center" style="padding:0 30px 6px 30px;">
              <div style="font-size:15px; font-weight:bold; color:#222222;">
                UBICA LA SEDE
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 30px 14px 30px;">
              <div style="font-size:14px; line-height:1.5; color:#333333; text-align:center;">
                Consulta la ubicación de Expo Guadalajara y planea la mejor ruta para llegar.
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 30px 22px 30px;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:#ef2b2d; border-radius:30px;">
                    <a href="https://maps.app.goo.gl/njZwNA7KiwSptKTN7" target="_blank" style="display:inline-block; padding:14px 26px; font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none;">
                      VER UBICACIÓN EN GOOGLE MAPS
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Planea tu visita -->
          <tr>
            <td align="center" style="padding:0 30px 8px 30px;">
              <div style="font-size:15px; font-weight:bold; color:#222222;">
                PLANEA TU VISITA
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 30px 18px 30px;">
              <div style="font-size:14px; line-height:1.5; color:#333333; text-align:center;">
                Consulta toda la información necesaria para aprovechar al máximo tu experiencia en <strong>Smart Technology Expo 2026</strong>.
              </div>
            </td>
          </tr>

          <!-- Sección de imágenes anexas (2da imagen) -->
          <tr>
            <td align="center" style="padding:0; gap:5px; display:flex; flex-direction:column; align-items:center;">

              <a href="https://smarttechnologyexpo.mx/" target="_blank" style="text-decoration:none;">
                <img src="https://smarttechnologyexpo.mx/item_conferencias_es.jpg" alt="Programa de Conferencias" width="600" style="display:block; width:100%; max-width:600px; border:0;" />
              </a>

              <a href="https://smarttechnologyexpo.mx/" target="_blank" style="text-decoration:none;">
                <img src="https://smarttechnologyexpo.mx/item_mujeres_es.jpg" alt="W 2026" width="600" style="display:block; width:100%; max-width:600px; border:0;" />
              </a>

              <a href="https://smarttechnologyexpo.mx/" target="_blank" style="text-decoration:none;">
                <img src="https://smarttechnologyexpo.mx/item_drones_es.jpg" alt="Drones" width="600" style="display:block; width:100%; max-width:600px; border:0;" />
              </a>

              <a href="https://smarttechnologyexpo.mx/" target="_blank" style="text-decoration:none;">
                <img src="https://smarttechnologyexpo.mx/item_plano_es.jpg" alt="Plano" width="600" style="display:block; width:100%; max-width:600px; border:0;" />
              </a>

              <a href="https://smarttechnologyexpo.mx/" target="_blank" style="text-decoration:none;">
                <img src="https://smarttechnologyexpo.mx/item_hoteles_es.jpg" alt="Hoteles" width="600" style="display:block; width:100%; max-width:600px; border:0;" />
              </a>

              <a href="https://smarttechnologyexpo.mx/" target="_blank" style="text-decoration:none;">
                <img src="https://smarttechnologyexpo.mx/item_eventos_es.jpg" alt="Otros Eventos" width="600" style="display:block; width:100%; max-width:600px; border:0;" />
              </a>

              <a href="https://smarttechnologyexpo.mx/" target="_blank" style="text-decoration:none;">
                <img src="https://smarttechnologyexpo.mx/item_premio_es.jpg" alt="Premio Itzamná 2026" width="600" style="display:block; width:100%; max-width:600px; border:0;" />
              </a>

            </td>
          </tr>

          <!-- Comparte la experiencia -->
          <tr>
            <td align="center" style="padding:24px 30px 8px 30px;">
              <div style="font-size:15px; font-weight:bold; color:#222222;">
                COMPARTE LA EXPERIENCIA
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 30px 12px 30px;">
              <div style="font-size:14px; line-height:1.5; color:#333333; text-align:center;">
                ¿Conoces a alguien que también debería ser parte de Smart Technology Expo 2026?
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 30px 24px 30px;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:#ef2b2d; border-radius:30px;">
                    <a href="https://smarttechnologyexpo.mx/" target="_blank" style="display:inline-block; padding:14px 24px; font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none;">
                      INVITA A UN COLEGA, SOCIO O CLIENTE
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Instrucciones -->
          <tr>
            <td align="center" style="padding:0 30px 10px 30px;">
              <div style="font-size:15px; font-weight:bold; color:#222222;">
                INSTRUCCIONES PARA TU VISITA:
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 30px 40px;">
              <div style="font-size:14px; line-height:1.7; color:#333333;">
                <ul style="margin:0; padding-left:18px;">
                  <li><strong>IMPORTANTE:</strong> Es indispensable llevar tu pre-registro impreso o en formato digital para agilizar tu acceso al evento.</li>
                  <li>Recuerda llevar tu credencial oficial de empresa o negocio para verificar tus datos.</li>
                  <li>Tu acceso es único e intransferible y debe estar visible durante toda tu visita.</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f3f3f3; padding:20px 30px;">
              <div style="font-size:12px; line-height:1.6; color:#666666; text-align:center;">
                Smart Technology Expo 2026<br />
                IGECo, Blvrd Francisco Villa 102 - piso 14, Oriental, 37510 León, Guanajuato, México<br />
                Tel. +52 55 7028 3335 | <a href="mailto:social.media@igeco.mx" style="color:#666666; text-decoration:underline;">social.media@igeco.mx</a><br />
              </div>
            </td>
          </tr>

        </table>
        <!-- Fin contenedor principal -->

      </td>
    </tr>
  </table>`;
};

export { email_template_ecomondo };
