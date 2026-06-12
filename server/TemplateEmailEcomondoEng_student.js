
const email_template_ecomondo_eng_student = async ({ name, paternSurname, maternSurname=''}) => {          
    return (
        `<table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: 680px;">
         <tbody>
             <tr>
               <td colspan="2" align="center">
                 <img src="https://ecomondomexico.com.mx/header_ecomondo_gafete_2026.png" alt="logo" width="550">         
               </td>
             </tr>        
             <tr>
               <td colspan="2" >
                 <h2 style="text-align: center;margin:0;font-weight:bold;text-transform: uppercase;margin-top: 20px;">
                   WELCOME STUDENT, ${name} ${paternSurname} ${maternSurname}. <BR /> YOUR REGISTRATION HAS BEEN SUCCESSFULLY COMPLETED.
                 </h2>
                 <h2 style='text-align: center;'>
                   THANK YOU FOR BEING PART OF <span style="color:#03A03A;font-weight:bold;">ECOMONDO MEXICO 2026, </span>THE ENVIRONMENTAL TECHNOLOGY AND CIRCULAR ECONOMY FAIR.
                 </h2>
                 <div style="text-align: justify;font-size:22px;">
                   Ecomondo Mexico facilitates and accelerates business and networking opportunities between leading exponents of environmental technology solutions and key industry decision makers globally to promote the transition to a more sustainable future.                   
                 </div>
                 <div style="text-align:center;padding:20px;margin-top:25px;">
                   <div style="background: #03A03A;padding:20px;border-radius:20px;">
                     <a style="text-decoration:none; color: white;font-weight:bold;" href="https://ecomondomexico.com.mx/scientific-committee/" target='_blank'>                 
                      SEE THE PROGRAM
                    </a>
                   </div>
                   <p style="margin-top:40px;margin-bottom: 40px;">
                     We look forward to seeing you at the fourth edition of <strong>ECOMONDO MEXICO April 16 from 3:00 pm - 5:00 pm, Expo Guadalajara, Jalisco.</strong>
                   </p>
                   <div style="background: #03A03A;color:white;border-radius: 20px;padding:20px;">               
                    <p><strong>SCHEDULES:</strong></p>                    
                    <p>Thursday 16 from 3:00 pm - 5:00 pm hrs</p>
                   </div>
                 </div>               
                 
                 <p style="font-size:15px;line-height:21px;margin:16px 0px;font-weight:bold">
                    INSTRUCTIONS FOR YOUR VISIT:
                 </p>
                 <ul>
                   <li>
                     <strong>IMPORTANT:</strong> It is essential to bring your pre-registration in printed or digital format to speed up your access to the event.
                   </li>
                   <li>
                     Remember to bring your official company or business credentials to verify your data.
                   </li>
                   <li>
                     Tu acceso es único e intransferible y debe estar visible durante toda tu visita.
                   </li>                                
                 </ul>                                                          
               </td>      
             </tr>               
             <tr>
               <td style="padding:20px;" align="center">
                 <div style="background: #03A03A;border-radius: 20px;padding:20px;margin:auto;">
                   <a style="text-decoration:none;color:white;" href="https://igeco.mx/" target="_blank">
                     FIND OUT ABOUT ALL OUR EVENTS
                   </a>
                 </div>          
               </td>
               <td style="padding:20px;" align="center">
                 <div style="background: #03A03A;border-radius: 20px;padding:20px;margin:auto;">
                   <a style="text-decoration:none;color:white;" href="https://ecomondomexico.com.mx/plano-ecomondo-mexico-2026/" target="_blank">
                     FLOORPLAN ECOMONDO 2026
                   </a>
                 </div>         
               </td>
             </tr> 
             <tr>
               <td style="padding:20px;" align="center">
                <div style="background: #03A03A;width:fit-content;border-radius: 20px;padding:20px;margin:auto;">
                 <a style="text-decoration:none;color:white;" href="https://ecomondomexico.com.mx/hotels/" target="_blank">
                   BOOK YOUR ACCOMMODATION HERE <br />WITH PREFERENTIAL RATE
                 </a>
                </div>           
               </td>
               <td style="padding:20px;" align="center">
                 <div style="background: #03A03A;width:fit-content;border-radius: 20px;padding:20px;margin:auto;">
                   <a style="text-decoration:none;color:white;" href="https://ecomondomexico.com.mx/registro-estudiante/" target="_blank">
                     INVITE A COLLEAGUE
                   </a>
                 </div>        
               </td>
             </tr>       
             <tr>
               <td colspan="2">
               <hr style="width:100%;border-top:1px solid rgb(214,216,219);border-right:none rgb(214,216,219);border-bottom:none rgb(214,216,219);border-left:none rgb(214,216,219);margin:30px 0px">
                 <p style="font-size:12px;line-height:15px;margin:4px 0px;color:rgb(145,153,161);text-align:center">
                   <strong>IGECO</strong>, Blvrd Francisco Villa 102-piso 14, Oriental, 37510 León, Guanajuato México.
                 </p>
               </td>   
             </tr>     
           </tbody>
         </table>`
         )
    }
  
  export {email_template_ecomondo_eng_student}
  