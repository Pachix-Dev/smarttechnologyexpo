// TemplateEmailWorkshop.js — Correo de confirmación de registro a TALLER.
// UNA sola plantilla bilingüe: recibe `lang` ('es' | 'en') y elige los textos
// de un diccionario interno. El diseño (HTML) se escribe una sola vez.
//
// Uso:
//   import { email_template_workshop } from './TemplateEmailWorkshop.js'
//   const html = await email_template_workshop({
//     lang: data.currentLanguage,   // 'es' | 'en'  (default 'es')
//     name, paternSurname, maternSurname,
//     workshopName, dateText, timeText, durationText, location, description,
//   })
//
// El pase de acceso (PDF con QR) se adjunta al correo desde el backend (Resend).

// Diccionario de textos por idioma ------------------------------------------
const STRINGS = {
  es: {
    hi: "¡ HOLA",
    confirmed: "TU REGISTRO AL TALLER ESTÁ CONFIRMADO",
    intro:
      "Gracias por reservar tu lugar en uno de los talleres prácticos de <strong>Smart Technology Expo 2026</strong>. A continuación encontrarás los detalles de tu taller. Te recomendamos llegar con anticipación, ya que los lugares son limitados.",
    yourWorkshop: "Tu taller",
    date: "Fecha",
    time: "Horario",
    duration: "Duración",
    location: "Lugar / Sala",
    aboutTitle: "SOBRE EL TALLER",
    accessTitle: "TU ACCESO AL EVENTO",
    accessBody:
      "Adjunto a este correo encontrarás tu <strong>pase de acceso con código QR</strong>. Preséntalo (impreso o en tu celular) el día del evento para ingresar y acudir a tu taller. Tu acceso es único e intransferible y debe estar visible durante toda tu visita.",
    eventDates: "18 al 20 de noviembre de 2026",
    venue: "Expo Guadalajara, Jalisco, México",
    simulTitle: "MIENTRAS ESTÉS AQUÍ, NO TE PIERDAS",
    simulBody:
      "Aprovecha las actividades que se realizan en paralelo a tu taller: conferencias magistrales y paneles en <strong>Smart Insights</strong>, más talleres en <strong>Smart Skills</strong> y el programa completo de conferencias.",
    btnConferences: "CONFERENCIAS",
    rememberTitle: "RECUERDA:",
    remember: [
      "Llega al menos <strong>15 minutos antes</strong> del inicio del taller.",
      "Lleva tu <strong>pase de acceso</strong> (adjunto) impreso o en tu celular.",
      "Los cupos son limitados; si no podrás asistir, te agradecemos avisarnos.",
    ],
    insightsUrl: "https://smarttechnologyexpo.mx/insights/",
    skillsUrl: "https://smarttechnologyexpo.mx/skills/",
    conferencesUrl: "https://smarttechnologyexpo.mx/conferencias/",
  },
  en: {
    hi: "HI",
    confirmed: "YOUR WORKSHOP REGISTRATION IS CONFIRMED",
    intro:
      "Thank you for booking your spot in one of the hands-on workshops at <strong>Smart Technology Expo 2026</strong>. Below are the details of your workshop. We recommend arriving early, as seats are limited.",
    yourWorkshop: "Your workshop",
    date: "Date",
    time: "Time",
    duration: "Duration",
    location: "Location / Room",
    aboutTitle: "ABOUT THE WORKSHOP",
    accessTitle: "YOUR EVENT ACCESS",
    accessBody:
      "Attached to this email you'll find your <strong>access pass with a QR code</strong>. Show it (printed or on your phone) on the day of the event to enter and attend your workshop. Your pass is unique, non-transferable and must be visible throughout your visit.",
    eventDates: "November 18–20, 2026",
    venue: "Expo Guadalajara, Jalisco, Mexico",
    simulTitle: "WHILE YOU'RE HERE, DON'T MISS",
    simulBody:
      "Make the most of the activities running alongside your workshop: keynotes and panels at <strong>Smart Insights</strong>, more workshops at <strong>Smart Skills</strong> and the full conference program.",
    btnConferences: "CONFERENCES",
    rememberTitle: "REMEMBER:",
    remember: [
      "Arrive at least <strong>15 minutes before</strong> the workshop starts.",
      "Bring your <strong>access pass</strong> (attached), printed or on your phone.",
      "Seats are limited; if you can't attend, please let us know.",
    ],
    insightsUrl: "https://smarttechnologyexpo.mx/en/insights/",
    skillsUrl: "https://smarttechnologyexpo.mx/en/skills/",
    conferencesUrl: "https://smarttechnologyexpo.mx/en/conferencias/",
  },
};

const email_template_workshop = async ({
  lang = "es",
  name = "",
  paternSurname = "",
  maternSurname = "",
  workshopName = "",
  dateText = "",
  timeText = "",
  durationText = "",
  location = "",
  description = "",
}) => {
  const t = STRINGS[lang] || STRINGS.es;

  return `
  <table width="100%" border="0" cellspacing="0" cellpadding="0"
    style="background-color:#e9e9e9; margin:0; padding:0px 0px;">
    <tr>
      <td align="center">

        <!-- Contenedor principal -->
        <table width="600" border="0" cellspacing="0" cellpadding="0"
          style="width:600px; max-width:600px; background-color:#ffffff;">

          <!-- Header -->
          <tr>
            <td align="center">
              <img src="https://smarttechnologyexpo.mx/header_email_ste.jpg" alt="Smart Technology Expo 2026"
                width="600" style="display:block; width:100%; max-width:600px; border:0;" />
            </td>
          </tr>

          <!-- Título -->
          <tr>
            <td align="center" style="padding:24px 30px 8px 30px;">
              <div style="font-size:20px; font-weight:bold; color:#000000; line-height:1.3;">
                ${t.hi}, ${name} ${paternSurname} ${maternSurname}!<br />
                ${t.confirmed}
              </div>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td align="center" style="padding:8px 30px 16px 30px;">
              <div style="font-size:15px; line-height:1.6; color:#333333; text-align:center;">
                ${t.intro}
              </div>
            </td>
          </tr>

          <!-- Tarjeta del taller -->
          <tr>
            <td align="center" style="padding:6px 30px 8px 30px;">
              <table border="0" cellspacing="0" cellpadding="0" width="100%"
                style="background-color:#ef2b2d; border-radius:12px;">
                <tr>
                  <td style="padding:20px 26px;">
                    <div style="font-size:12px; letter-spacing:2px; font-weight:bold; color:#ffe3e3; text-transform:uppercase; margin-bottom:6px;">
                      ${t.yourWorkshop}
                    </div>
                    <div style="font-size:21px; font-weight:bold; color:#ffffff; line-height:1.3;">
                      ${workshopName}
                    </div>

                    <table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-top:16px;">
                      <tr>
                        <td width="50%" valign="top" style="padding:6px 8px 6px 0;">
                          <div style="font-size:11px; color:#ffd4d4; text-transform:uppercase; letter-spacing:1px;">${t.date}</div>
                          <div style="font-size:15px; font-weight:bold; color:#ffffff;">${dateText}</div>
                        </td>
                        <td width="50%" valign="top" style="padding:6px 0 6px 8px;">
                          <div style="font-size:11px; color:#ffd4d4; text-transform:uppercase; letter-spacing:1px;">${t.time}</div>
                          <div style="font-size:15px; font-weight:bold; color:#ffffff;">${timeText}</div>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" valign="top" style="padding:6px 8px 6px 0;">
                          <div style="font-size:11px; color:#ffd4d4; text-transform:uppercase; letter-spacing:1px;">${t.duration}</div>
                          <div style="font-size:15px; font-weight:bold; color:#ffffff;">${durationText}</div>
                        </td>
                        <td width="50%" valign="top" style="padding:6px 0 6px 8px;">
                          <div style="font-size:11px; color:#ffd4d4; text-transform:uppercase; letter-spacing:1px;">${t.location}</div>
                          <div style="font-size:15px; font-weight:bold; color:#ffffff;">${location}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Descripción (opcional) -->
          ${
            description
              ? `<tr>
            <td align="center" style="padding:14px 30px 4px 30px;">
              <div style="font-size:15px; font-weight:bold; color:#222222; text-align:left;">
                ${t.aboutTitle}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:4px 40px 18px 40px;">
              <div style="font-size:14px; line-height:1.7; color:#333333; text-align:left;">
                ${description}
              </div>
            </td>
          </tr>`
              : ``
          }

          <!-- Pase de acceso -->
          <tr>
            <td align="center" style="padding:6px 30px 8px 30px;">
              <div style="font-size:15px; font-weight:bold; color:#222222;">
                ${t.accessTitle}
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 30px 20px 30px;">
              <div style="font-size:14px; line-height:1.6; color:#333333; text-align:center;">
                ${t.accessBody}
              </div>
            </td>
          </tr>

          <!-- Fecha / sede -->
          <tr>
            <td align="center" style="padding:6px 30px 12px 30px;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:#111111; border-radius:12px; padding:14px 22px;">
                    <div style="font-size:18px; font-weight:bold; color:#ffffff; line-height:1.3;">
                      ${t.eventDates}
                    </div>
                    <div style="font-size:15px; color:#dddddd; line-height:1.4;">
                      ${t.venue}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Actividades simultáneas -->
          <tr>
            <td align="center" style="padding:16px 30px 6px 30px;">
              <div style="font-size:15px; font-weight:bold; color:#222222;">
                ${t.simulTitle}
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 30px 14px 30px;">
              <div style="font-size:14px; line-height:1.6; color:#333333; text-align:center;">
                ${t.simulBody}
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 30px 22px 30px;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td style="padding:4px 6px;">
                    <a href="${t.insightsUrl}" target="_blank"
                      style="display:inline-block; padding:12px 18px; font-size:14px; font-weight:bold; color:#ffffff; background-color:#ef2b2d; border-radius:26px; text-decoration:none;">
                      SMART INSIGHTS
                    </a>
                  </td>
                  <td style="padding:4px 6px;">
                    <a href="${t.skillsUrl}" target="_blank"
                      style="display:inline-block; padding:12px 18px; font-size:14px; font-weight:bold; color:#ffffff; background-color:#111111; border-radius:26px; text-decoration:none;">
                      SMART SKILLS
                    </a>
                  </td>
                  <td style="padding:4px 6px;">
                    <a href="${t.conferencesUrl}" target="_blank"
                      style="display:inline-block; padding:12px 18px; font-size:14px; font-weight:bold; color:#ffffff; background-color:#111111; border-radius:26px; text-decoration:none;">
                      ${t.btnConferences}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Recuerda -->
          <tr>
            <td align="center" style="padding:0 30px 10px 30px;">
              <div style="font-size:15px; font-weight:bold; color:#222222;">
                ${t.rememberTitle}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 30px 40px;">
              <div style="font-size:14px; line-height:1.7; color:#333333;">
                <ul style="margin:0; padding-left:18px;">
                  ${t.remember.map((li) => `<li>${li}</li>`).join("")}
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
                Tel. +52 55 7028 3335 | <a href="mailto:social.media@igeco.mx"
                  style="color:#666666; text-decoration:underline;">social.media@igeco.mx</a><br />
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

export { email_template_workshop };