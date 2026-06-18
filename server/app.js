import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import pkg from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import {RegisterModel} from './db.js';
import {email_template_ecomondo} from './TemplateEmailEcomondo.js';
import {email_template_ecomondo_eng} from './TemplateEmailEcomondoEng.js';

import {email_template_ecomondo_student } from './TemplateEmailEcomondo_student.js';
import {email_template_ecomondo_eng_student} from './TemplateEmailEcomondoEng_student.js';

import { generatePDF_freePass_ecomondo, generateQRDataURL, generatePDFInvoice, generatePDF_freePass_ecomondo_student } from './generatePdf.js';
import PDFDocument from 'pdfkit';
import { Resend } from "resend";
import { MercadoPagoConfig, Payment } from 'mercadopago';

const { json } = pkg
const app = express()
app.use(json())
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = process.env.ACCEPTED_ORIGINS.split(',')

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}))


const PORT = process.env.PORT || 3010
const mercadopago =  new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: {
        timeout: 5000,
    }
});
const payment = new Payment(mercadopago);
const resend = new Resend(process.env.RESEND_APIKEY)

app.get('/check-user-visit', async (req, res) => {
    const { email } = req.query;
    const user = await RegisterModel.get_user_visit_last_fair(email);
    if (user) {
        return res.status(200).send(user);
    } else {
        return res.status(404).send({ message: 'No se encontró el usuario' });
    }
});

app.post('/create-order-ecomondo', async (req, res) => {
    try {
        const { body } = req;
        

        let total = 0;
        // Check if the items are unique
        const ids = [];        
        body.items.forEach((item) => {
            if (ids.includes(item.id)) {                
                return res.status(500).send({
                    status: false,
                    message: 'Tu compra no pudo ser procesada, la información no es válida...'
                });
            } else {
                ids.push(item.id); // Add unique id to the list
            }
        });

        const get_products = await RegisterModel.get_products();

        if (!get_products.status) {
            return res.status(500).send({
                status: false,
                message: 'No se encontraron productos...'
            });
        }

        const products = get_products.result;
        
        body.items.forEach(item => {
            const product = products.find(product => product.id == item.id);
            total += product.price;

            if(!product){
                return res.status(500).send({
                    status: false,
                    message: 'Error producto no encontrado...'
                });
            }            
        });
        
        if (total !== body.total) {
            return res.status(400).send({
                status: false,
                message: 'Tu compra no pudo ser procesada, la información no es válida...'
            });
        }

                
        const limit = await RegisterModel.get_ecomondo_trip();
        
        if (limit.length >= 80) {
            return res.status(400).send({
                status: false,
                message: 'Lo sentimos, hemos llegado al límite de cupo para este evento...'
            });
        }

        const paymentData = {
            token: body?.paymentData.token,
            transaction_amount: total,
            description: 'Field Trip Ecomondo Mexico 2025',
            payment_method_id: body?.paymentData.payment_method_id,
            payer: { 
                    first_name: body?.name,
                    last_name: body?.paternSurname,
                    email: body?.paymentData.payer.email },
            statement_descriptor: "FIELDTRIPECOMONDOMEXICO2025",
            notification_url: "https://ecomondomexico.com.mx/server/webhook-mp",
            external_reference: body.uuid,
            installments: 1,
        };
        
        const resp = await payment.create({ body: paymentData });
        
        if (resp.status === "approved") {                        
            await RegisterModel.save_order(body.idUser, body.items.map(item => item.id), body.total, resp.id );
                        
            const pdfAtch = await generatePDFInvoice(resp.id, body);
            const mailResponse = await sendEmailEcomondo(body, pdfAtch, resp.id);

            return res.send({
                ...mailResponse,
                invoice: `${resp.id}.pdf`
            });
           
        } else {
            return res.status(400).send({
                status: false,
                message: 'El pago no fue aprobado...'
            });
        }

    } catch (error) {
        console.error('Error en /create-order-ecomondo:', error.message);
        return res.status(500).send({
            status: false,
            message: 'Ocurrió un error al procesar la solicitud.',
            error: error.message
        });
    }
});

app.post('/webhook-mp', async (req, res) => {
    const body = req.body;
    console.log('webhook-mp', body);
    try{
        const response = await fetch('https://api.mercadopago.com/v1/payments/'+body.data.id, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+process.env.MP_ACCESS_TOKEN
            }
        });

        console.log(response);
        if(response.ok){
            const payment = await response.json();
            console.log('webhook-mp', payment);
            return res.status(200).send({status: true});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({status: false});
    }
});

app.post('/expositor-landing-email', async (req, res) => {
    try{
        const { body } = req;

        // Validar que el expositor no exista previamente
        const expositorExists = await RegisterModel.check_expositor_exists(body.email);
        if (expositorExists) {
            return res.status(400).send({
                status: false,
                message: 'Ya has registrado una solicitud con este correo electrónico...'
            });
        }

        await RegisterModel.create_expositor_lead_ecomondo({...body}); 
        
        await resend.emails.send({
            from: 'LEAD EXPOSITOR ECOMONDO 2026 <noreply@ecomondomexico.com.mx>',
            to: 'samuel.ramirez@igeco.mx',
            cc: 'jesus.zermeno@igeco.mx',
            subject: 'Nuevo Lead Expositor ECOMONDO MEXICO 2026',
            html: `<h1>Un nuevo expositor ha solicitado información</h1>
            <p>Sector: ${body.sector}</p>
            <p>Nombre: ${body.name}</p>
            <p>Correo: ${body.email}</p>
            <p>Empresa: ${body.company}</p>
            <p>Telefono: ${body.phone}</p>
            <p>Mensaje: ${body.message}</p>
            `, 
        })
        
        return res.send({
            status: true,
            message: 'Gracias por registrarte, te hemos enviado un correo de confirmación a tu bandeja de entrada...'
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            status: false,
            message: 'No pudimos enviarte el correo de confirmación de tu registro, por favor descarga tu registro en este pagina y presentalo hasta el dia del evento...'
        });             
    }          
})

app.post('/susbribe-email-ecomondo', async (req, res) => {
    const { body } = req;
    
    try {
        // Validar que el usuario no exista previamente
        const subscriberExists = await RegisterModel.check_subscriber_exists(body.email);
        if (subscriberExists) {
            return res.status(400).send({
                status: false,
                message: 'Ya estás suscrito con este correo electrónico...'
            });
        }
        
        const userResponse = await RegisterModel.create_suscriber_ecomondo({...body}); 

        if(!userResponse.status){
            return  res.status(500).send({
                ...userResponse
            });
        }                    
        return res.send({
            ...userResponse,            
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            status: false,
            message: 'Ocurrió un error al procesar tu solicitud de suscripción...'
        });
    }
})

// Registro gratuito para visitantes a Smart Technology Expo 2026
app.post('/free-register-ste', async (req, res) => {
    const { body } = req;
    
    try {
        // Validar que el usuario no exista previamente
        const userExists = await RegisterModel.check_user_exists_2026(body.email);
        if (userExists) {
            return res.status(400).send({
                status: false,
                message: 'Ya estás registrado con este correo electrónico...'
            });
        }
        
        const data = { 
            uuid: uuidv4(),            
            ...body,
            typeRegister: 'VISITANTE'
        };          
        const userResponse = await RegisterModel.create_user_ste({ ...data }); 

        if(!userResponse.status){
            return  res.status(500).send({
                ...userResponse
            });
        }
                
        const pdfAtch = await generatePDF_freePass_ecomondo(body, data.uuid);
        const mailResponse = await sendEmailEcomondo(data, pdfAtch, data.uuid);   

        return res.send({
            ...mailResponse,
            invoice: `${data.uuid}.pdf`
        });                
               
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: false,
            message: 'hubo un error al procesar tu registro, por favor intenta mas tarde...'
        });
    }
});

app.post('/free-register-student-ecomondo', async (req, res) => {
    const { body } = req;
    
    try {
        // Validar que el usuario no exista previamente
        const userExists = await RegisterModel.check_student_user_exists_2026(body.email);
        if (userExists) {
            return res.status(400).send({
                status: false,
                message: 'Ya estás registrado con este correo electrónico...'
            });
        }
        
        const data = { 
            uuid: uuidv4(),            
            ...body
        };          
        const userResponse = await RegisterModel.create_user_ecomondo_student({ ...data }); 

        if(!userResponse.status){
            return  res.status(500).send({
                ...userResponse
            });
        }
                
        const pdfAtch = await generatePDF_freePass_ecomondo_student(body, data.uuid);
        const mailResponse = await sendEmailEcomondo_student(data, pdfAtch, data.uuid);   

        return res.send({
            ...mailResponse,
            invoice: `${data.uuid}.pdf`
        });                
               
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: false,
            message: 'hubo un error al procesar tu registro, por favor intenta mas tarde...'
        });
    }
});

app.post('/free-register-ecomondo-sitio', async (req, res) => {
    const { body } = req;
    
    try {
        // Validar que el usuario no exista previamente
        const userExists = await RegisterModel.check_user_exists_2026(body.email);
        if (userExists) {
            return res.status(400).send({
                status: false,
                message: 'Ya estás registrado con este correo electrónico...'
            });
        }
        
        const data = { 
            uuid: uuidv4(),            
            ...body
        };          
        const userResponse = await RegisterModel.create_user_ecomondo({ ...data }); 

        if(!userResponse.status){
            return  res.status(500).send({
                ...userResponse
            });
        }                        

        return res.send({
            status: true,
            uuid: data.uuid,
            message: 'Tu registro fue exitoso...'
        });                
               
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: false,
            message: 'hubo un error al procesar tu registro, por favor intenta mas tarde...'
        });
    }
});

app.post('/update-print-user', async (req, res) => {
    const { body } = req;
    const userResponse = await RegisterModel.update_print_user(body.uuid);

    if (userResponse) {
        return res.send({ success: true });
    } else {
        return res.send({ success: false });
    }
});

app.get('/search-user', async (req, res) => {
    const { uuid } = req.query;
    const user = await RegisterModel.search_user(uuid);
    if (user) {
        return res.status(200).send(user);
    } else {
        return res.status(404).send({ message: 'No se encontró el usuario' });
    }
});

app.get('/get-user-by-email', async (req, res) => {
    const { email } = req.query;
    const user = await RegisterModel.get_user_by_email(email);
    if (user) {
        return res.status(200).send(user);
    } else {
        return res.status(404).send({ message: 'No se encontró el usuario' });
    }
});

// Endpoint para reimprimir gafete
app.get('/get-badge-to-print', async (req, res) => {
    const { email } = req.query;
    const user = await RegisterModel.get_raw_user_by_email(email);
    if (user) {
        return res.status(200).send(user);
    } else {
        return res.status(404).send({ message: 'No se encontró el usuario' });
    }
});

app.use(express.static('public'));

app.get('/generate-pdf', async (req, res) => {
  
  const doc = new PDFDocument();
  // Set the response type to PDF
  res.setHeader('Content-Type', 'application/pdf');

  // Pipe the PDF into the response
  doc.pipe(res);

  // Draw a dashed cross in the middle of the document
  const midX = doc.page.width / 2;
  const midY = doc.page.height / 2;

  doc.save();
  doc.lineWidth(2);
  doc.dash(5, { space: 5 });

  // Vertical dashed line
  doc.moveTo(midX, 0)
     .lineTo(midX, doc.page.height)
     .stroke();
  // Horizontal dashed line
  doc.moveTo(0, midY)
     .lineTo(doc.page.width, midY)
     .stroke();
  doc.restore();


  doc.image('img/header_ITM.png', 0, 0, { width: 305 })
  // aqui iria el QR con info del usuario
  const imageQr = await generateQRDataURL('uuid-1234567890');
  doc.image(imageQr, 90, 120, { width: 120 });
  
  doc
  .font('Helvetica-Bold')
  .fontSize(18)
  .text('Juan', 30, 240)
  .text('Perez')
  .fontSize(12)
  .font('Helvetica')
  .text('CEO/Founder')
  .moveDown(0.5)
  .text('IGECO');

  doc.image('img/footer_FUTURISTIC.jpg', 0, 328, { width: 305 });
  doc
    .font('Helvetica-Bold')
    .fontSize(17)
    .text('INSTRUCCIONES', 310, 10, {
        width: 300,
        align: 'center'
    })
    .text('PARA TU VISITA', 310, 30, {
        width: 300,
        align: 'center'
    })    
    .moveDown(0.2);

    doc.fontSize(14)
        .font('Helvetica')
        .text(' ESTEGAFETE DA ACCESO A:', {
        width: 300,
        align: 'center'
    }).moveDown(1);
    
    doc.font('Helvetica-Bold')
    .fontSize(12)
    .text('Futuristic Minds', 330)
    .fontSize(10)
    .font('Helvetica-BoldOblique')
    .list(['SEDE EXPLORA'])
    .font('Helvetica')
    .fontSize(8)
    .text('Programa educativo (conferencias, talleres y recorridos interactivos) especialmente para jóvenes, realizado en el Centro de Ciencias Explora, ubicado en Blvd. Francisco Villa 202, colonia La Martinica, León, Gto. México.', {
        width: 250,
        align: 'justify'
    })
    .moveDown(0.5);
    
    doc.font('Helvetica-BoldOblique')
    .fontSize(10)    
    .list(['SEDE VELARIA'])
    .font('Helvetica')
    .fontSize(8)
    .text('Área de las competencias de electromovilidad, robótica y habilidades profesionales, que se llevará a cabo en la Velaria de la Feria de León, ubicada en Blvd. Paseo de los Niños 111, Zona Recreativa y Cultural, León, Gto. México.', {
        width: 250,
        align: 'justify'
    })
    .moveDown(0.5);

    doc.font('Helvetica-Bold')
    .fontSize(12)
    .text('Industrial Transformation Mexico.')
    .fontSize(8)
    .font('Helvetica')
    .text('Los estudiantes podrán visitar el piso de exposición el viernes 11 de octubre a partir de las 3:00 p.m en Poliforum León.',  {
        width: 250,
        align: 'justify'
    })
    .moveDown(3);

    doc.lineWidth(1);    
    doc.moveTo(320, 250)
        .lineTo( 600, 250 )
        .stroke();

    doc.fontSize(8)
    .font('Helvetica')
    .text('El gafete es ', {
        width: 250,
        align: 'justify',
        continued: true
    })
    .font('Helvetica-Bold')
    .text('personal e intransferible ', {continued: true})
    .font('Helvetica')
    .text(' y deberás presentarlo de forma impresa o digital para permitir el ingreso.')
    .moveDown(2);

    doc
    .font('Helvetica-Bold')    
    .moveDown(1)
    .text('ITALIAN GERMAN EXHIBITION COMPANY MEXICO', {
        width: 250,    
        align: 'center'
    });

  doc.image('img/footer2_FUTURISTIC.jpg', 307, 328, { width: 306 });
  
  doc.save();
  // Rotate and draw some text
  doc.rotate(180, {origin: [150, 305]})
  .fillColor('#009FE3')  
  .fontSize(20)  
  .text('HORARIOS', 50, -110, {
    width: 200,
    align: 'center'
  
  })
  .moveDown(1)
  .fillColor('black')  
  .fontSize(14)
  .font('Helvetica-BoldOblique')
  .text('SEDE EXPLORA', {
    width: 200,
    align: 'center'  
  })
  .moveDown(1)
  .text('9 OCT ', {continued: true})
  .font('Helvetica')
  .text('10:00 - 17:00 hrs. ')
  .moveDown(1)
  .font('Helvetica-Bold')
  .text('10 OCT ', {continued: true})
  .font('Helvetica')
  .text('10:00 - 17:00 hrs. ')
  .moveDown(1)
  .font('Helvetica-Bold')
  .text('11 OCT ', {continued: true})
  .font('Helvetica')
  .text('10:00 - 15:00 hrs.')
  .fontSize(14)
  .moveDown(1)
  .font('Helvetica-BoldOblique')
  .text('SEDE VELARIA', {
    width: 200,
    align: 'center'  
  })
  .moveDown(1)
  .font('Helvetica-Bold')
  .text('9 y 10 OCT ', {continued: true})
  .font('Helvetica')
  .text('9:00 - 17:00 hrs.')
  .moveDown(1)
  .font('Helvetica-Bold')
  .text('11 OCT ', {continued: true})
  .font('Helvetica')
  .text('9:00 - 16:00 hrs.')

  doc.fontSize(14)
  .font('Helvetica-Bold')
  .text('PLEGADO DE GAFETE', -360, -140, {
    width: 400,
    align: 'center'
  });

  doc.rotate(180, {origin: [-170, 50]})
  .image('img/indicaciones_ITM.jpg', -330, -100, { width: 305 });

  // Restore the previous state to avoid rotating everything else
  doc.restore();
  
  doc.end();
});

app.get('/template-email', async (req, res) => {
    const data = {
        name: 'Juan',
        paternSurname: 'Perez',
        maternSurname: 'Suarez',
        email: 'Pachi.claros@gmaail.com',
        phone: '4775690282',
        hour: '10:00 am',
        items: [
            {name: 'Combo Empresarial', quantity: 2},
            {name: 'item 2', quantity: 2},
        ]
    }
    const emailContent = await email_template_ecomondo({ ...data });
    res.send(emailContent);
});

/* Permite enviar correos electrónicos de confirmación de registro */ 
async function sendEmailEcomondo(data, pdfAtch = null, paypal_id_transaction = null){    
    try{

        const emailContent = data.currentLanguage === 'es' ?  await email_template_ecomondo({ ...data }) : await email_template_ecomondo_eng({ ...data });

        await resend.emails.send({
            from: 'SMART TECHNOLOGY EXPO 2026 <noreply@smarttechnologyexpo.mx>',
            to: data.email,
            subject: 'CONFIRMACIÓN DE PRERREGISTRO - SMART TECHNOLOGY EXPO 2026',
            html: emailContent,
            attachments: [
                {
                    filename: `${paypal_id_transaction}.pdf`,
                    path: `https://smarttechnologyexpo.mx/invoices/${paypal_id_transaction}.pdf`,
                    content_type: 'application/pdf'         
                },
              ],           
        })
        
        return {
            status: true,
            message: 'Gracias por registrarte, te hemos enviado un correo de confirmación a tu bandeja de entrada...'
        };

    } catch (err) {
        console.log(err);
        return {
            status: false,
            message: 'No pudimos enviarte el correo de confirmación de tu prerregistro, por favor descarga tu prerregistro en esta página y preséntalo hasta el día del evento...'
        };              
    }    
}

async function sendEmailEcomondo_student(data, pdfAtch = null, paypal_id_transaction = null){    
    try{

        const emailContent = data.currentLanguage === 'es' ?  await email_template_ecomondo_student({ ...data }) : await email_template_ecomondo_eng_student({ ...data });

        await resend.emails.send({
            from: 'SMART TECHNOLOGY EXPO 2026 <noreply@smarttechnologyexpo.mx>',
            to: data.email,
            subject: 'CONFIRMACIÓN DE PRERREGISTRO - SMART TECHNOLOGY EXPO 2026',
            html: emailContent,
            attachments: [
                {
                    filename: `${paypal_id_transaction}.pdf`,
                    path: `https://smarttechnologyexpo.mx/invoices/${paypal_id_transaction}.pdf`,
                    content_type: 'application/pdf'
                },
              ],           
        })
        
        return {
            status: true,
            message: 'Gracias por registrarte, te hemos enviado un correo de confirmación a tu bandeja de entrada...'
        };

    } catch (err) {
        console.log(err);
        return {
            status: false,
            message: 'No pudimos enviarte el correo de confirmación de tu prerregistro, por favor descarga tu prerregistro en esta página y preséntalo hasta el día del evento...'
        };              
    }    
}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})