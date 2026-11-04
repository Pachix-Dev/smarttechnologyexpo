
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { finished } from "node:stream/promises";
import PDFDocument from "pdfkit";
import sharp from "sharp";

import { directory2026 } from "./constans_directory_2026.js";

//* RUTAS *
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "../..");
const outputDir = path.join(projectRoot, "public", "downloads");

fs.mkdirSync(outputDir, { recursive: true });

//* COLORES *
const colors = {
  dark: "#db0c15",
  yellow: "#FFB900",
  white: "#FFFFFF",
  text: "#273142",
  gray: "#64748B",
  background: "#F8F5EC",
  border: "#E1D5B5",
};

//* CATEGORÍAS *
const categories = [
  {
    type: "exhibitor",
    es: "EXPOSITORES",
    en: "EXHIBITORS",
  },
  {
    type: "coexhibitor",
    es: "COEXPOSITORES",
    en: "CO-EXHIBITORS",
  },
  {
    type: "medio",
    es: "MEDIOS DE COMUNICACIÓN",
    en: "MEDIA PARTNERS",
  },
];

//* LIMPIAR VALORES *
function clean(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

//* OBTENER LOGOTIPOS *
async function getLogo(logoPath) {
  if (!logoPath) return null;

  const localPath = path.join(
    projectRoot,
    "public",
    logoPath.replace(/^\/+/, "")
  );

  if (!fs.existsSync(localPath)) {
    console.warn("Logo no encontrado:", localPath);
    return null;
  }

  try {
    return await sharp(localPath)
      .rotate()
      .png()
      .toBuffer();
  } catch (error) {
    console.warn("Error al procesar logo:", logoPath);
    return null;
  }
}

//* GENERAR PDF *
async function generatePDF(language) {
  const isEnglish = language === "en";

  const fileName = isEnglish
    ? "directory_2026_en.pdf"
    : "directorio_2026_es.pdf";

  const outputPath = path.join(outputDir, fileName);

  const doc = new PDFDocument({
    size: "A4",
    margins: {
      top: 45,
      bottom: 45,
      left: 45,
      right: 45,
    },
    bufferPages: true,
    info: {
      Title: isEnglish
        ? "Smart Technology Expo 2026 - Directory"
        : "Smart Technology Expo 2026 - Directorio",
      Author: "Smart Technology Expo",
    },
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - 90;
  const bottomLimit = doc.page.height - 50;

  //* PORTADA DEL DIRECTORIO *

  const coverHeight = doc.page.height;

  
const cover = {

  //* LOGO SMART TECHNOLOGY EXPO *
  logoX: 45,           // MOVER DERECHA / IZQUIERDA
  logoY: 465,          // BAJAMOS EL LOGO
  logoWidth: 235,      // MODIFICAR ANCHO
  logoHeight: 105,     // MODIFICAR ALTO

  //* LÍNEA HORIZONTAL DEBAJO DEL LOGO *
  lineX: 45,           // MOVER DERECHA / IZQUIERDA
  lineY: 595,          // BAJAMOS LA LÍNEA
  lineWidth: 100,      // MODIFICAR LONGITUD
  lineThickness: 2,    // MODIFICAR GROSOR

  //* TÍTULO DIRECTORIO *
  titleX: 45,          // MOVER DERECHA / IZQUIERDA
  titleY: 615,         // BAJAMOS EL TÍTULO
  titleSize: 39,       // MODIFICAR TAMAÑO

  //* AÑO 2026 *
  yearX: 45,           // MOVER DERECHA / IZQUIERDA
  yearY: 665,          // BAJAMOS EL AÑO
  yearSize: 32,        // MODIFICAR TAMAÑO

  //* LÍNEA VERTICAL DE LAS CATEGORÍAS *
  categoryLineX: 45,       // MOVER DERECHA / IZQUIERDA
  categoryLineY: 718,      // BAJAMOS LA LÍNEA
  categoryLineHeight: 69,  // MODIFICAR LONGITUD
  categoryLineWidth: 2,    // MODIFICAR GROSOR

  //* TEXTO DE LAS CATEGORÍAS *
  categoriesX: 55,         // MOVER DERECHA / IZQUIERDA
  categoriesY: 720,        // BAJAMOS LAS CATEGORÍAS
  categoriesSize: 17,      // MODIFICAR TAMAÑO
  categoriesSpacing: 25,   // SEPARACIÓN ENTRE CATEGORÍAS

  //* TEXTO INFERIOR SMART TECHNOLOGY EXPO *
  footerX: 330,            // MOVER DERECHA / IZQUIERDA
  footerY: 774,            // SE QUEDA EN SU POSICIÓN
  footerSize: 12,          // MODIFICAR TAMAÑO

};

  //* FONDO DE LA PORTADA *

  const backgroundPath = path.join(
    projectRoot,
    "public",
    "img",
    "fondo.webp"
  );

  if (!fs.existsSync(backgroundPath)) {
    throw new Error(
      `No se encontró el fondo de la portada: ${backgroundPath}`
    );
  }

  // Convertir WEBP a PNG para utilizarlo con PDFKit
  const backgroundMetadata = await sharp(backgroundPath)
    .metadata();

  const backgroundImage = await sharp(backgroundPath)
    .png()
    .toBuffer();

  const backgroundScale = Math.max(
    pageWidth / backgroundMetadata.width,
    coverHeight / backgroundMetadata.height
  );

  const backgroundWidth =
    backgroundMetadata.width * backgroundScale;

  const backgroundHeight =
    backgroundMetadata.height * backgroundScale;

  const backgroundX = pageWidth - backgroundWidth;

  doc.image(backgroundImage, backgroundX, 0, {
    width: backgroundWidth,
    height: backgroundHeight,
  });

  //* LOGO SMART TECHNOLOGY EXPO *

  const logoExpoPath = path.join(
    projectRoot,
    "public",
    "img",
    "smarttecexpo_logo.svg"
  );

  if (fs.existsSync(logoExpoPath)) {
    try {
      const logoExpo = await sharp(logoExpoPath)
        .png()
        .toBuffer();

      doc.image(
        logoExpo,
        cover.logoX,
        cover.logoY,
        {
          fit: [
            cover.logoWidth,
            cover.logoHeight,
          ],
          align: "left",
          valign: "top",
        }
      );
    } catch (error) {
      console.warn(
        "No se pudo insertar el logo de Smart Technology Expo"
      );
    }
  } else {
    console.warn("Logo de portada no encontrado:", logoExpoPath);
  }

  //* LÍNEA HORIZONTAL DEBAJO DEL LOGO *

  doc.moveTo(
    cover.lineX,
    cover.lineY
  )
    .lineTo(
      cover.lineX + cover.lineWidth,
      cover.lineY
    )
    .strokeColor(colors.white)
    .lineWidth(cover.lineThickness)
    .stroke();

  //* TÍTULO DIRECTORIO / DIRECTORY *

  doc.fillColor(colors.white)
    .font("Helvetica-Bold")
    .fontSize(cover.titleSize)
    .text(
      isEnglish ? "DIRECTORY" : "DIRECTORIO",
      cover.titleX,
      cover.titleY,
      {
        width: pageWidth - cover.titleX - 30,
      }
    );

  //* AÑO 2026 *

  doc.fillColor(colors.white)
    .font("Helvetica-Bold")
    .fontSize(cover.yearSize)
    .text(
      "2026",
      cover.yearX,
      cover.yearY
    );

  //* LÍNEA VERTICAL DE LAS CATEGORÍAS *

  doc.moveTo(
    cover.categoryLineX,
    cover.categoryLineY
  )
    .lineTo(
      cover.categoryLineX,
      cover.categoryLineY + cover.categoryLineHeight
    )
    .strokeColor(colors.white)
    .lineWidth(cover.categoryLineWidth)
    .stroke();

  //* CATEGORÍAS *

  const coverCategories = isEnglish
    ? [
        "Exhibitors",
        "Co-exhibitors",
        "Media Partners",
      ]
    : [
        "Expositores",
        "Coexpositores",
        "Medios de comunicación",
      ];

  coverCategories.forEach((category, index) => {
    doc.fillColor(colors.white)
      .font("Helvetica")
      .fontSize(cover.categoriesSize)
      .text(
        category,
        cover.categoriesX,
        cover.categoriesY +
          index * cover.categoriesSpacing,
        {
          width: pageWidth - cover.categoriesX - 30,
        }
      );
  });

  //* PIE DE PORTADA *

  doc.fillColor(colors.white)
    .font("Helvetica")
    .fontSize(cover.footerSize)
    .text(
      "SMART TECHNOLOGY EXPO",
      cover.footerX,
      cover.footerY,
      {
        width: pageWidth - cover.footerX - 35,
        align: "right",
      }
    );

  //* FIN DE LA PORTADA *


  //* ENCABEZADO DE CATEGORÍA *
  function addCategory(title, count) {
    doc.addPage();

    doc.fillColor(colors.dark)
      .font("Helvetica-Bold")
      .fontSize(24)
      .text(title, 45, 65);

    doc.fillColor(colors.gray)
      .font("Helvetica")
      .fontSize(11)
      .text(
        `${count} ${isEnglish ? "records" : "registros"}`,
        45,
        doc.y + 8
      );

    const lineY = doc.y + 18;

    doc.moveTo(45, lineY)
      .lineTo(pageWidth - 45, lineY)
      .lineWidth(3)
      .strokeColor("#ED001B")
      .stroke();

    doc.y = lineY + 25;
  }

  //* ESCRIBIR CAMPOS *
  function addField(label, value) {
    const text = clean(value);
    if (!text) return;

    if (doc.y > bottomLimit - 40) {
      doc.addPage();
    }

    doc.fillColor(colors.gray)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(label.toUpperCase(), 45, doc.y, {
        width: contentWidth,
      });

    doc.fillColor(colors.text)
      .font("Helvetica")
      .fontSize(10)
      .text(text, 45, doc.y + 4, {
        width: contentWidth,
        lineGap: 2,
      });

    doc.moveDown(0.6);
  }

  //* AGREGAR EMPRESA *
  async function addCompany(company) {

    //* Reservar espacio para el encabezado *
    if (doc.y > bottomLimit - 160) {
      doc.addPage();
    }

    const name =
      clean(company.tradename) ||
      clean(company.legal_company_name) ||
      (isEnglish ? "Company" : "Empresa");

    const logo = await getLogo(company.logo);

    const startY = doc.y;

    //* LOGOTIPO DEL LADO DERECHO *
    if (logo) {
      try {
        doc.image(logo, pageWidth - 130, startY, {
          fit: [85, 65],
          align: "center",
          valign: "center",
        });
      } catch (error) {
        console.warn("No se pudo insertar el logo:", name);
      }
    }

    //* TIPO DE PARTICIPACIÓN *
    const typeLabels = {
      exhibitor: isEnglish ? "EXHIBITOR" : "EXPOSITOR",
      coexhibitor: isEnglish ? "CO-EXHIBITOR" : "COEXPOSITOR",
      medio: isEnglish ? "MEDIA PARTNER" : "MEDIO",
    };

    const typeLabel = typeLabels[company.type] || "";

    //* NOMBRE DE LA EMPRESA / TIPO *
    const textX = 45;
    const nameWidth = contentWidth - 100;

    const fullName = typeLabel
      ? `${name} / ${typeLabel}`
      : name;

    
    //* NOMBRE DE LA EMPRESA EN NEGRITAS *
    doc.fillColor("#000000")
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(name, textX, startY, {
        width: nameWidth,
        continued: Boolean(typeLabel),
      });

    //* DIAGONAL Y TIPO DE PARTICIPACIÓN MÁS DELGADOS *
    if (typeLabel) {
      doc.font("Helvetica") // MODIFICAR AQUÍ EL GROSOR
        .fontSize(16)        // MODIFICAR AQUÍ EL TAMAÑO
        .text(` / ${typeLabel}`, {
          width: nameWidth,
        });
    }


    //* ESPACIO DEBAJO DEL NOMBRE *
    doc.y += 10;

    //* RAZÓN SOCIAL *
    if (
      company.legal_company_name &&
      company.legal_company_name !== company.tradename
    ) {
      addField(
        isEnglish ? "Legal company name" : "Razón social",
        company.legal_company_name
      );
    }

    //* STAND *
    addField("Stand", company.stand_number);

    //* SITIO WEB *
    addField(
      isEnglish ? "Website" : "Página web",
      company.webpage
    );

    //* DIRECCIÓN *
    const address = [
      company.address,
      company.zip_code,
      company.city,
      company.state,
      company.country,
    ].filter(Boolean).join(", ");

    addField(
      isEnglish ? "Address" : "Dirección",
      address
    );

    //* REDES SOCIALES *
    addField("LinkedIn", company.linkedin);
    addField("Facebook", company.facebook);
    addField("Instagram", company.instagram);

    //* DESCRIPCIÓN SEGÚN IDIOMA *
    const description = isEnglish
      ? company.description_en
      : company.description_es;

    addField(
      isEnglish ? "Description" : "Descripción",
      description
    );

    //* NO MOSTRAR:
    // contact_name
    // contact_email
    // contact_phone
    // directory_consent
    // has_coexhibitors
    // coexhibitors

    //* SEPARADOR *
    if (doc.y > bottomLimit - 35) {
      doc.addPage();
    } else {
      doc.moveTo(45, doc.y + 10)
        .lineTo(pageWidth - 45, doc.y + 10)
        .lineWidth(1)
        .strokeColor(colors.border)
        .stroke();

      doc.y += 28;
    }
  }

  //* RECORRER CATEGORÍAS *
  for (const category of categories) {

    const companies = directory2026
      .filter((company) => company.type === category.type)
      .sort((a, b) => {
        const nameA = String(
          a.tradename || a.legal_company_name || ""
        );

        const nameB = String(
          b.tradename || b.legal_company_name || ""
        );

        return nameA.localeCompare(nameB, "es", {
          sensitivity: "base",
          numeric: true,
        });
      });

    addCategory(
      isEnglish ? category.en : category.es,
      companies.length
    );

    for (const company of companies) {
      await addCompany(company);
    }
  }

  //* FINALIZAR *
  doc.end();
  await finished(stream);

  console.log(`PDF generado: ${outputPath}`);
}

//* GENERAR AMBOS ARCHIVOS *
async function main() {
  await generatePDF("es");
  await generatePDF("en");

  console.log("Directorios generados correctamente.");
}

main().catch((error) => {
  console.error("Error al generar los directorios:", error);
  process.exitCode = 1;
});
