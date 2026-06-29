const email_template_ecomondo_eng = async ({ name, paternSurname, maternSurname = "" }) => {
  return `
       
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#e9e9e9; margin:0; padding:0px 0px;">
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
                WELCOME!<br /> ${name} ${paternSurname} ${maternSurname} <br />
                YOUR REGISTRATION IS CONFIRMED <br /><br />
              </div>
            </td>
          </tr>

          <!-- Texto de introducción -->
          <tr>
            <td align="center" style="padding:0 30px 16px 30px;">
              <div style="font-size:15px; line-height:1.6; color:#333333; text-align:center;">
                Over the course of three days, you’ll discover applied innovation, learn about solutions that are already transforming plants, supply chains, and business models, and connect with the people driving the next generation of manufacturing, automation, artificial intelligence, smart logistics, and digital transformation.
              </div>
            </td>
          </tr>
          
          <tr>
            <td align="center" style="padding:0 30px 16px 30px;">
              <div style="font-size:14px; line-height:1.6; color:#333333; text-align:center; font-weight:bold; text-transform: uppercase; font-style: italic;">
                The next big opportunity for your business starts now.
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 30px 16px 30px;">
              <div style="font-size:14px; line-height:1.6; color:#333333; text-align:center;">
                See you in Guadalajara <br><strong style="text-transform: uppercase;">Smart Technology Expo 2026</strong><br>YOUR BUSINESS IS OUR BUSINESS 
              </div>
            </td>
          </tr>

          <!-- Información del evento -->
          <tr>
            <td align="center" style="padding:6px 30px 12px 30px;">
              <div style="font-size:15px; font-weight:bold; color:#222222; margin-bottom:10px;">
                EVENT INFORMATION
              </div>

              <table border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:#ef2b2d; border-radius:12px; padding:14px 22px;">
                    <div style="font-size:20px; font-weight:bold; color:#ffffff; line-height:1.3;">
                      NOVEMBER 18 - 20, 2026
                    </div>
                    <div style="font-size:16px; color:#ffffff; line-height:1.4;">
                      11:00 hrs. - 18:00 hrs.
                    </div>
                    <div style="font-size:15px; color:#ffffff; line-height:1.4;">
                      Expo Guadalajara, Jalisco, Mexico
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
                ADD TO YOUR CALENDAR
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
                FIND THE VENUE
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 30px 14px 30px;">
              <div style="font-size:14px; line-height:1.5; color:#333333; text-align:center;">
                Check the location of Expo Guadalajara and plan the best route to get there.
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 30px 22px 30px;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:#ef2b2d; border-radius:30px;">
                    <a href="https://maps.app.goo.gl/njZwNA7KiwSptKTN7" target="_blank" style="display:inline-block; padding:14px 26px; font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none;">
                      VIEW LOCATION ON GOOGLE MAPS
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
                PLAN YOUR VISIT
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 30px 18px 30px;">
              <div style="font-size:14px; line-height:1.5; color:#333333; text-align:center;">
                Check all the necessary information to make the most of your experience at  <br><strong>Smart Technology Expo 2026</strong>.
              </div>
            </td>
          </tr>

          <!-- Sección de eventos simultáneos -->
          <tr>
            <td align="center" style="padding:0 30px 20px 30px;">
              <table role="presentation" width="540" border="0" cellspacing="0" cellpadding="0"
                style="width:540px; max-width:540px; border-collapse:collapse;">
                <!-- Fila 1 -->
                <tr>
                  <td width="266" align="center" valign="top"
                    style="width:266px; padding:0; font-size:0; line-height:0;">
                    <a href="https://smarttechnologyexpo.mx/en/conferencias/" target="_blank"
                      style="display:block; text-decoration:none;">
                      <img src="https://smarttechnologyexpo.mx/conferencias_en.jpg" alt="Conference Program" width="266" border="0"
                        style="display:block; width:266px; max-width:266px; height:auto; border:0; outline:none; text-decoration:none;" />
                    </a>
                  </td>

                  <!-- Espacio entre columnas -->
                  <td width="8" style="width:8px; padding:0; font-size:0; line-height:0;">
                    &nbsp;
                  </td>

                  <td width="266" align="center" valign="top"
                    style="width:266px; padding:0; font-size:0; line-height:0;">
                    <a href="https://smarttechnologyexpo.mx/en/premio-itzamna-2026/" target="_blank"
                      style="display:block; text-decoration:none;">
                      <img src="https://smarttechnologyexpo.mx/premio_itzamna_en.jpg" alt="Exhibition Plan" width="266" border="0"
                        style="display:block; width:266px; max-width:266px; height:auto; border:0; outline:none; text-decoration:none;" />
                    </a>
                  </td>
                </tr>

                <!-- Espacio entre filas -->
                <tr>
                  <td colspan="3" height="8" style="height:8px; padding:0; font-size:0; line-height:0;">
                    &nbsp;
                  </td>
                </tr>

                <!-- Fila 2 -->
                <tr>
                  <td width="266" align="center" valign="top"
                    style="width:266px; padding:0; font-size:0; line-height:0;">
                    <a href="https://smarttechnologyexpo.mx/en/tarifas-hoteles-2026/" target="_blank"
                      style="display:block; text-decoration:none;">
                      <img src="https://smarttechnologyexpo.mx/hoteles_en.jpg" alt="Hotels" width="266" border="0"
                        style="display:block; width:266px; max-width:266px; height:auto; border:0; outline:none; text-decoration:none;" />
                    </a>
                  </td>

                  <!-- Espacio entre columnas -->
                  <td width="8" style="width:8px; padding:0; font-size:0; line-height:0;">
                    &nbsp;
                  </td>

                  <td width="266" align="center" valign="top"
                    style="width:266px; padding:0; font-size:0; line-height:0;">
                    <a href="https://igeco.mx/en/" target="_blank"
                      style="display:block; text-decoration:none;">
                      <img src="https://smarttechnologyexpo.mx/otros_eventos_en.jpg" alt="Other Events" width="266" border="0"
                        style="display:block; width:266px; max-width:266px; height:auto; border:0; outline:none; text-decoration:none;" />
                    </a>
                  </td>
                </tr>
                
                <!-- Espacio entre filas -->
                <tr>
                  <td colspan="3" height="8" style="height:8px; padding:0; font-size:0; line-height:0;">
                    &nbsp;
                  </td>
                </tr>

                <!-- Fila 3 -->
                <tr>
                  <td width="266" align="center" valign="top"
                    style="width:266px; padding:0; font-size:0; line-height:0;">
                    <a href="https://smarttechnologyexpo.mx/en/" target="_blank"
                      style="display:block; text-decoration:none;">
                      <img src="https://smarttechnologyexpo.mx/cursos_talleres_en.jpg" alt="Courses and Workshops" width="266" border="0"
                        style="display:block; width:266px; max-width:266px; height:auto; border:0; outline:none; text-decoration:none;" />
                    </a>
                  </td>

                  <!-- Espacio entre columnas -->
                  <td width="8" style="width:8px; padding:0; font-size:0; line-height:0;">
                    &nbsp;
                  </td>

                  <td width="266" align="center" valign="top"
                    style="width:266px; padding:0; font-size:0; line-height:0;">
                    <a href="https://smarttechnologyexpo.mx/en/" target="_blank"
                      style="display:block; text-decoration:none;">
                      <img src="https://smarttechnologyexpo.mx/mujeres_en.jpg" alt="Women in Technology" width="266" border="0"
                        style="display:block; width:266px; max-width:266px; height:auto; border:0; outline:none; text-decoration:none;" />
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Comparte la experiencia -->
          <tr>
            <td align="center" style="padding:24px 30px 8px 30px;">
              <div style="font-size:15px; font-weight:bold; color:#222222;">
                SHARE THE EXPERIENCE
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 30px 12px 30px;">
              <div style="font-size:14px; line-height:1.5; color:#333333; text-align:center;">
                Do you know someone who should also be part of <strong>Smart Technology Expo 2026</strong>?
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 30px 24px 30px;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:#ef2b2d; border-radius:30px;">
                    <a href="https://smarttechnologyexpo.mx/en/" target="_blank" style="display:inline-block; padding:14px 24px; font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none;">
                      INVITE A COLLEAGUE, PARTNER, OR CLIENT
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
                IMPORTANT INFORMATION FOR YOUR VISIT :
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 30px 40px;">
              <div style="font-size:14px; line-height:1.7; color:#333333;">
                <ul style="margin:0; padding-left:18px;">
                  <li><strong>IMPORTANT :</strong> It is essential to bring your pre-registration printed or in digital format to expedite your access to the event.</li>
                  <li>Remember to bring your official company or business ID to verify your information.</li>
                  <li>Your access is unique and non-transferable and must be visible throughout your visit.</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f3f3f3; padding:20px 30px;">
              <div style="font-size:12px; line-height:1.6; color:#666666; text-align:center;">
                Smart Technology Expo 2026<br />
                IGECo, Blvrd Francisco Villa 102 - 14th floor, Oriental, 37510 León, Guanajuato, Mexico<br />
                Tel. +52 55 7028 3335 | <a href="mailto:social.media@igeco.mx" style="color:#666666; text-decoration:underline;">social.media@igeco.mx</a><br />
              </div>
            </td>
          </tr>

        </table>
        <!-- Fin contenedor principal -->

      </td>
    </tr>
</table>

      `;
};

export { email_template_ecomondo_eng };
