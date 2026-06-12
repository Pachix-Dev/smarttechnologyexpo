import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Helper function to generate QR code as a data URL
async function generateQRDataURL(text) {
    try {
        return await QRCode.toDataURL(text);
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error; // Rethrow to handle it in the calling context
    }
}

function formatAmountMXN(amount) {
    const formattedAmount = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(amount)

    return formattedAmount
}

function getSpanishDateString(date) {
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
  
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return `${day} de ${months[monthIndex]} de ${year}`;
}

// Function to generate PDF invoice
async function generatePDFInvoice(paypal_id_transaction, body, mainUser) {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const outputPath = path.resolve(__dirname, '../invoices');
    const pdfSave = path.join(outputPath, `invoice-${paypal_id_transaction}.pdf`);

    const doc = new PDFDocument();
    const pdfStream = fs.createWriteStream(pdfSave);
    

    
    const qrText = paypal_id_transaction;    
    const logoVev = path.resolve(__dirname, 'logoVEV.png');  

    const imageQr = await generateQRDataURL(qrText);
  
    
    doc.pipe(pdfStream);             
    doc.image(logoVev, 50, 45, { width: 100 });    
    doc
        .fillColor("#444444")
        .fontSize(20)
        .fontSize(10)
        .text("ITALIAN GERMAN EXHIBITION COMPANY ME.", 200, 50, { align: "right" })
        .text("Blvrd Francisco Villa 102-piso 14, Oriental, 37510 ", 200, 65, { align: "right" })
        .text("León de los Aldama, Gto.", 200, 80, { align: "right" })
        .moveDown();
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Recibo de Compra", 50, 160);
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, 185)
        .lineTo(550, 185)
        .stroke();

    doc
        .fontSize(10)
        .text("N° transacción:", 50, 200)
        .font("Helvetica-Bold")
        .text(paypal_id_transaction, 150, 200)
        .font("Helvetica")
        .text("Fecha:", 50, 200 + 15)
        .text(getSpanishDateString(new Date()), 150, 200 + 15)
        .text("Total:", 50, 200 + 30)
        .text(formatAmountMXN(body.total),150,200 + 30)
        .font("Helvetica-Bold")
        .text(body.name, 300, 200)
        .font("Helvetica")
        .text(body.email, 300, 200 + 15)
        .text(body.phone, 300, 200 + 30 )
        .moveDown();
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, 252)
        .lineTo(550, 252)
        .stroke();
        
    doc
        .fontSize(10)
        .text('Descripcion', 50, 280)
        .text('Costo unitario', 280, 280, { width: 90, align: "right" })
        .text('cantidad', 370, 280, { width: 90, align: "right" })
        .text('Total', 0, 280, { align: "right" });
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, 300)
        .lineTo(550, 300)
        .stroke();

    body.items.map((item, index) => {
        doc
        .fontSize(10)
        .text(item.name, 50, 280 + (index + 1)*30)
        .text(formatAmountMXN(item.price), 320, 280 + (index + 1)*30)
        .text(item.quantity, 430, 280 + (index + 1)*30)
        .text(formatAmountMXN(item.price * item.quantity), 0, 280 + (index + 1)*30, { align: "right" });
        doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, 280 + (index + 1)*30 + 20)
        .lineTo(550, 280 + (index + 1)*30 + 20)
        .stroke();
    });
    
    doc.moveDown(2);    
    doc
        .fontSize(10)
        .text('Subtotal:       '+ formatAmountMXN(body.total), { width: 540, align: "right" });
    doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text('TOTAL:          ' + formatAmountMXN(body.total), { width: 540, align: "right" });    
    doc.image(imageQr, 50, 650, { width: 100 });

    const qrMainUser = await generateQRDataURL(mainUser.uuid);       
     
  doc.end();
  return pdfSave;
}

export { generatePDFInvoice };
