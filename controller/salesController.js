const eventEmitter = require('../utils/eventEmitter');
const admin = require('firebase-admin');
const serviceAccount = require('../config/fcm.json');
const salesorder = require("../models/sales");
const mongoose = require('mongoose');
const moment = require('moment');
// const {redisClient,isRedisConnected} = require('../config/redis')
var stock = require('../models/Stock_M');
const AddStock = require("../models/Stock_M");
const { all } = require("../routes/sales");
const redisClient = require('../config/redis');
const fs = require('fs').promises;
const path = require('path');
const fileSystem = require('fs');
const AWS=require('aws-sdk')
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.SECRET_ACCESS_KEY,
    region: 'ap-south-1',
   
  });


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendPushNotification(deviceToken, message) {
    const payload = {
      notification: {
        title: 'Order Rejected',
        body: message,
      },
    };
  
    try {
      // Send FCM notification
      const response = await admin.messaging().sendToDevice(deviceToken, payload);
      // Log success or error
      if (response.results && response.results.length > 0) {
        const firstResult = response.results[0];
        if (firstResult.error) {
          console.error('FCM notification failed:', firstResult.error);
        } else {
          console.log('FCM notification sent successfully:', response);
        }
      }
    } catch (error) {
      console.error('Error sending FCM notification:', error);
    }
  }
  

// Listen for 'OrderRejected' event
eventEmitter.on('OrderRejected', async ({ salesPerson }) => {
  try {
    const { sales_name, sales_id } = salesPerson;
    const deviceToken = 'AAAAgt3qpdw:APA91bEENlGDPJDUGNCCkRBTH56yKE1rOc2n7A4UQQnwTENwUoq0keQ8uuxYa_7TS8I7eP9NsgDeXMZcFkA6nWcumcmntaq30cc_aSQAQ_jMmhouh5PXkKSyRABCT-f5PUvCZD9aSIB3';

    console.log(`Notification: Order for salesperson -->> ${sales_id} and  --> ${sales_name} is canceled. Notify Sales Manager.`);

    // Additional logic related to notifying the sales manager can be added here


    // Send FCM notification
    const message = `Order for salesperson ${sales_id} and ${sales_name} is canceled. Notify Sales Manager.`;
    await sendPushNotification(deviceToken, message);
  } catch (error) {
    console.error('Error handling OrderRejected event:', error);
  }
});



 /// Create the Order  ///
// exports.create = async (req, res) => {
//     try {
//         const data = (max) => {
//             const newdata = Math.floor(Math.random() * max);
//             console.log(newdata);
//             return newdata;
//         };

//         // Replace max with a specific value when calling the function
//         const result = data(1000000000000000); // Replace 100 with your desired max value

//         // Create a new sales order instance
//         const orderId = result;  // Store the generated order ID in a variable
//         console.log("orderId is " , orderId)
//         const pdfDirectory = path.join(__dirname, 'order');  // Specify the directory where you want to save the PDF files
//         const pdfPath = path.join(pdfDirectory, `${orderId}.pdf`);  // Specify the path for the PDF file
//         console.log(pdfPath)

//         // Create the 'order' directory if it doesn't exist
//         await fs.mkdir(pdfDirectory, { recursive: true });

//         const user = new salesorder({
//             clientName: req.body.clientName,
//             firmName: req.body.firmName,
//             address: req.body.address,
//             city: req.body.city,
//             phone_no: req.body.phone_no,
//             sales_id: req.body.sales_id,
//             Email:req.body.Email,
//             sales_name: req.body.sales_name,
//             orderId: orderId,  // Use the stored order ID
//             currentDate: new Date().toISOString(),
//             deliveryDate: req.body.deliveryDate,
//             note: req.body.note,
//             orderstatus: req.body.orderstatus,
//             Order_mark: req.body.Order_mark,
//             products: req.body.products,
//             ph_id: req.body.ph_id,
//             ph_name: req.body.ph_name,
//             process_bar: req.body.process_bar,
//             smName: req.body.smName,
//             vehicleNum: req.body.vehicleNum,
//             dpDate: req.body.dpDate,
//             dpRecieved: req.body.dpRecieved,
//             dpPhone: req.body.dpPhone,
//             dpTotalWeight: req.body.dpTotalWeight,
//             productionincharge: req.body.productionincharge,
//             pdf_order: {
//                 type: 'application/pdf',
//                 data: null,  // Initialize with null, will be replaced later
//             },
//             pdf_url:null

//         });

//              // Check stock availability for each product in the order
//         for (const product of req.body.products) {
//             const product_name = product.select_product;
//             const company = product.company;
//             const grade = product.grade;
//             const topcolor = product.topcolor;
//             const coating = product.coating;
//             const temper = product.temper;
//             const guardfilm = product.guardfilm;
//             const weight = product.weight;
//             const thickness =  product.thickness;
//             const width = product.width;
//             const length = product.length;
//             const pcs = product.pcs;
//             const rate=product.rate;

//             const stock_data = await stock.findOne({
//                 product: product_name,
//                 company: company,
//                 grade: grade,
//                 topcolor: topcolor,
//                 coating: coating,
//                 temper: temper,
//                 guardfilm: guardfilm
//             });




//             if (stock_data && stock_data.weight >= weight) {

//                 // Sufficient stock is available, update stock quantity
//                 stock_data.weight -= weight;
//                 await stock_data.save();
//             } else {
//                 return res.status(404).json({ "status": 404, "msg": 'Order cannot be placed due to insufficient stock' });
//             }
//         }
        

//         const browser = await puppeteer.launch({
//             headless: 'new', 
//             args: ['--no-sandbox'],// Set to true if you want to run iya n headless mode
//         });

//         const page = await browser.newPage();

//     const orderDetailsHTML = `
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Order Details</title>
//     <script src="https://cdn.tailwindcss.com"></script>
//     <script>
//       tailwind.config = {
//         theme: {
//           extend: {
//             colors: {
//               clifford: "#DA373D",
//             },
//           },
//         },
//       };
//     </script>
//     <style>
//       .form {
//         width: 800px;
//         margin: 40px auto;
//         padding: 20px;
//         border: 1px solid #ccc;
//         border-radius: 10px;
//         box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//       }
//       .header {
//         justify-content: space-evenly;
//         margin-bottom: 20px;
//         display: flex;
//         flex-direction: row;
//         flex-wrap: wrap;
//         gap: 20px;
//       }
//       .header label {
//         /* margin-right: 10px; */
//       }
//       .header input {
//         width: 150px;
//         height: 30px;
//         padding: 10px;
//         border: 1px solid #ccc;
//         border-radius: 5px;
//       }
//       .table {
//         margin-bottom: 20px;
//         width: 100%;
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//       }
//       th,
//       td {
//         border: 1px solid #ccc;
//         padding: 10px;
//         text-align: left;
//       }
//       th {
//         background-color: #F0F0F0;
//       }
//       .footer {
//         display: flex;
//         flex-direction: column;
//         justify-content: end;
//         align-items: end;
//         margin-top: 20px;
//       }
//       .Text {
//         border: none; /* Removes the border */
//         border-bottom: 1px solid black; /* Adds an underline */
//         width: 150px;
//         height: 30px;
//         padding: 10px;
//         outline: none; /* Removes the focus outline */
//       }
//       .parent-footer {
//         display: flex;
//         justify-content: space-between;
//       }
//       .footer label {
//         margin-right: 10px;
//       }
//       .footer input {
//         width: 150px;
//         height: 30px;
//         padding: 10px;
//         border: 1px solid #ccc;
//         border-radius: 5px;
//       }
//       .para1{
//         width: 40%;
//         margin-bottom: 20px;
//         font-weight: 600;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="form">
//       <div class="header flex flex-row justify-between">
//         <div>DC No.: ${req.body.dpPhone}</div>
//         <div class="flex flex-row items-center">
//           <div>Date: ${req.body.deliveryDate}</div>
//         </div>
//       </div>
//       <div class="mb-3">
//         <div>
//           M/S: ${req.body.ms}
//           <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
//         </div>
//         <div>
//           Broker: ${req.body.broker}
//           <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
//         </div>
//         <div>
//           Vehicle No.: ${req.body.vehicleNum }
//           <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
//         </div>
//         <div>
//           Transport: ${req.body.transport}
//           <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
//         </div>
//       </div>
//       <div class="table">
//         <table>
//           <thead>
//             <tr>
//               <th>Item</th>
//               <th>Thickness</th>
//               <th>Width</th>
//               <th>Length</th>
//               <th>Weight</th>
//               <th>Pcs</th>
//               <th>Rate</th>
//               <th>Product</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${req.body.products.map((product, index) => `
//             <tr>
//               <td>${index + 1}</td>
//               <td>${product.thickness}</td>
//               <td>${product.width}</td>
//               <td>${product.length}</td>
//               <td>${product.weight}</td>
//               <td>${product.pcs}</td>
//               <td>${product.rate}</td>
//               <td>${product.select_product}</td>
//             </tr>
//             `).join('')}
//           </tbody>
//         </table>
//       </div>
//       <div class="parent-footer">
//         <div class="para1 mb-4 ">
//           <p>
//             हमारे यहाँ से माल रुकवा एवं प्रीति प्रेषण किया गया है। ट्रक में
//             पर्ची लगने के उपरांत कर्ता की खपत होने की जवाबदारी हमारी नहीं होगी।
//           </p>
//         </div>
//         <div class="footer">
//           <div class="font-bold">
//             Received by: ${req.body.Received_by}
//             <div class="w-50 mb-4 ml-20"></div>
//           </div>
//           <div>
//             Name: ${req.body.clientName}
//             <div class="border-b-2 border-black-900 w-50 mb-4 ml-20"></div>
//           </div>
//           <div>
//             Mob. ${req.body.phone_no}
//             <div class="border-b-2 border-black-900 w-50 mb-4 ml-20"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </body>
// </html>
// `;


        
//         await page.setContent(orderDetailsHTML);

//         await page.pdf({ path: pdfPath, format: 'A4' });

//         await browser.close();
        
//         // Create a read stream for the PDF file
//         const pdfReadStream = fileSystem.createReadStream(pdfPath);

//         const s3 = new AWS.S3({
//             accessKeyId: process.env.ACCESS_KEY_ID ,
//             secretAccessKey: process.env. SECRET_ACCESS_KEY,
//           });
          
//         const bucketName = 'vss-project';

//         const uploadParams = {
//             Bucket: bucketName,
//             Key: `${orderId}.pdf`,
//             Body:pdfReadStream,  // Use fs.createReadStream here
//             ContentType: 'application/pdf',
//         };

//        await s3.upload(uploadParams).promise();
//         const params = {
//             Bucket: bucketName,
//             Key: `${orderId}.pdf`
//         };

//     // Get signed URL for the uploaded PDF
//             const pdfURL = await s3.getSignedUrlPromise('getObject', params);

//             console.log("pdfURL:" + pdfURL)

//         // Set pdf_order data as the S3 URL
//         user.pdf_url = pdfURL;


//         // Ensure pdf_order is an object with type and data properties
//         if (!user.pdf_order || typeof user.pdf_order !== 'object') {
//             user.pdf_order = {
//                 type: 'application/pdf',
//                 data: null,
//             };
//         } else {
//             // If pdf_order is already an object, ensure it has the required properties
//             user.pdf_order.type = 'application/pdf';
//             user.pdf_order.data = null;
//         }

//         // Set pdf_order data as the path to the saved PDF file
//         user.pdf_order.data = pdfPath;
        

//         // Save the new sales order
//         const newOrder = await user.save({ select: '-pdf_order' });
        
//       // Remove pdf_order from the newOrder object
// if (newOrder.pdf_order) {
//     newOrder.pdf_order = undefined;
// }

// // Send the response with the newOrder object
// return res.status(201).json({
//     status: 201,
//     msg: 'Order successfully created',
//     newOrder,
// });

//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ "status": 400, "message": "Something Went Wrong" , error:err.message});
//     }
// };



exports.create = async (req, res) => {
  try {
      const data = (max) => {
          const newdata = Math.floor(Math.random() * max);
          console.log(newdata);
          return newdata;
      };

      // Replace max with a specific value when calling the function
      const result = data(1000000000000000); // Replace 100 with your desired max value

      // Create a new sales order instance
      const orderId = result;  // Store the generated order ID in a variable
      console.log("orderId is " , orderId)
      const pdfDirectory = path.join(__dirname, 'order');  // Specify the directory where you want to save the PDF files
      const pdfPath = path.join(pdfDirectory, `${orderId}.pdf`);  // Specify the path for the PDF file
      console.log(pdfPath)

      // Create the 'order' directory if it doesn't exist
      await fs.mkdir(pdfDirectory, { recursive: true });

      const user = new salesorder({
          user_id: req.body.user_id,
          clientName: req.body.clientName,
          firmName: req.body.firmName,
          address: req.body.address,
          city: req.body.city,
          phone_no: req.body.phone_no,
          sales_id: req.body.sales_id,
          Email:req.body.Email,
          sales_name: req.body.sales_name,
          orderId: orderId,  // Use the stored order ID
          currentDate: new Date().toISOString(),
          deliveryDate: req.body.deliveryDate,
          note: req.body.note,
          orderstatus: req.body.orderstatus,
          Order_mark: req.body.Order_mark,
          products: req.body.products,
          ph_id: req.body.ph_id,
          ph_name: req.body.ph_name,
          process_bar: req.body.process_bar,
          smName: req.body.smName,
          vehicleNum: req.body.vehicleNum,
          dpDate: req.body.dpDate,
          dpRecieved: req.body.dpRecieved,
          dpPhone: req.body.dpPhone,
          dpTotalWeight: req.body.dpTotalWeight,
          productionincharge: req.body.productionincharge,
          pdf_order: {
              type: 'application/pdf',
              data: null,  // Initialize with null, will be replaced later
          },
          pdf_url:null

      });

           // Check stock availability for each product in the order
      for (const product of req.body.products) {
          const product_name = product.select_product;
          const company = product.company;
          const grade = product.grade;
          const topcolor = product.topcolor;
          const coating = product.coating;
          const temper = product.temper;
          const guardfilm = product.guardfilm;
          const weight = product.weight;
          const thickness =  product.thickness;
          const width = product.width;
          const length = product.length;
          const pcs = product.pcs;
          const rate=product.rate;

          let stock_data = await stock.findOne({
              product: product_name,
              company: company,
              grade: grade,
              topcolor: topcolor,
              coating: coating,
              temper: temper,
              guardfilm: guardfilm
          });




          if (stock_data && stock_data.weight >= weight) {

              // Sufficient stock is available, update stock quantity
              // stock_data.weight -= weight;
              await stock_data.save();             
          } 
          

          

          

          else if (product.select_product == "GP Sheet") {
            // Check stock availability for GP Sheet
            stock_data = await stock.findOne({
                product: "GP Sheet", // Check for GP Sheet availability
                company,
                grade,
                topcolor,
                coating,
                temper,
                guardfilm,
            });

            if (stock_data && stock_data.weight >= weight) {
                // GP Sheet is available
                // stock_data.weight -= weight;
                await stock_data.save();
                console.log(`Stock for GP Sheet found and updated.`);
            } else {
                // If GP Sheet is not available, check for GP Coil
                console.log(`Stock for GP Sheet is insufficient. Checking for GP Coil...`);
        
                stock_data = await stock.findOne({
                    product: "GP Coil", // Check for GP Coil availability
                    company,
                    grade,
                    topcolor,
                    coating,
                    temper,
                    guardfilm,
                });

     
        
                if (stock_data && stock_data.weight >= weight) {
                    // GP Coil is available, treat it as GP Sheet
                    // stock_data.weight -= weight;
                    await stock_data.save();
        
                    console.log(
                        `Ordered GP Coil as GP Sheet due to insufficient stock for GP Sheet.`
                    );
                  }

                  else{
                    return res.status(404).json({ "status": 404, "msg": 'order can not be placed due to insufficient stock' });
                  }

                }
              }


              else if (product.select_product == "Profile Sheet") {
                // Check stock availability for GP Sheet
                stock_data = await stock.findOne({
                    product: "Profile Sheet", // Check for GP Sheet availability
                    company,
                    grade,
                    topcolor,
                    coating,
                    temper,
                    guardfilm,
                });
    
                if (stock_data && stock_data.weight >= weight) {


                    // GP Sheet is available
                    // stock_data.weight -= weight;
                    await stock_data.save();
                    console.log(`Stock for GP Sheet found and updated.`);
                } else {
                    // If GP Sheet is not available, check for GP Coil
                    console.log(`Stock for GP Sheet is insufficient. Checking for GP Coil...`);
            
                    stock_data = await stock.findOne({
                        product: "Color Coil", // Check for GP Coil availability
                        company,
                        grade,
                        topcolor,
                        coating,
                        temper,
                        guardfilm,
                    });

                    console.log("stock weight" , stock_data)

        

  
            
                    if (stock_data && stock_data.weight >= weight) {
                        // GP Coil is available, treat it as GP Sheet
                        // stock_data.weight -= weight;
                        await stock_data.save();
            
                        console.log(
                            `Ordered GP Coil as GP Sheet due to insufficient stock for GP Sheet.`
                        );
                      }

                      else{
                        return res.status(404).json({ "status": 404, "msg": 'order can not be placed due to insufficient stock' });
                      }
    
                    }
                  }


                  else if (product.select_product == "GC sheet") {
                    // Check stock availability for GP Sheet
                    stock_data = await stock.findOne({
                        product: "GC sheet", // Check for GP Sheet availability
                        company,
                        grade,
                        topcolor,
                        coating,
                        temper,
                        guardfilm,
                    });
        
                    if (stock_data && stock_data.weight >= weight) {
    
    
                        // GP Sheet is available
                        // stock_data.weight -= weight;
                        await stock_data.save();
                        console.log(`Stock for GP Sheet found and updated.`);
                    } else {
                        // If GP Sheet is not available, check for GP Coil
                        console.log(`Stock for GP Sheet is insufficient. Checking for GP Coil...`);
                
                        stock_data = await stock.findOne({
                            product: "GC Coil", // Check for GP Coil availability
                            company,
                            grade,
                            topcolor,
                            coating,
                            temper,
                            guardfilm,
                        });
      
                
                        if (stock_data && stock_data.weight >= weight) {
                            // GP Coil is available, treat it as GP Sheet
                            // stock_data.weight -= weight;
                            await stock_data.save();
                
                            console.log(
                                `Ordered GP Coil as GP Sheet due to insufficient stock for GP Sheet.`
                            );
                          }

                          else{
                            return res.status(404).json({ "status": 404, "msg": 'order can not be placed due to insufficient stock' });
                          }
        
                        }
                      }

                      if(stock_data.weight < weight){
                        return res.status(404).json({ "status": 404, "msg": 'order can not be placed due to insufficient stock' });
                      }


                      if(!stock_data){
                        return res.status(404).json({ "status": 404, "msg": 'Stock not available' });
                      }
          
      }

      

      const browser = await puppeteer.launch({
          headless: 'new', 
          args: ['--no-sandbox'],// Set to true if you want to run iya n headless mode
      });

      const page = await browser.newPage();

  const orderDetailsHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Details</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            clifford: "#DA373D",
          },
        },
      },
    };
  </script>
  <style>
    .form {
      width: 800px;
      margin: 40px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      justify-content: space-evenly;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 20px;
    }
    .header label {
      /* margin-right: 10px; */
    }
    .header input {
      width: 150px;
      height: 30px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .table {
      margin-bottom: 20px;
      width: 100%;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      border: 1px solid #ccc;
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #F0F0F0;
    }
    .footer {
      display: flex;
      flex-direction: column;
      justify-content: end;
      align-items: end;
      margin-top: 20px;
    }
    .Text {
      border: none; /* Removes the border */
      border-bottom: 1px solid black; /* Adds an underline */
      width: 150px;
      height: 30px;
      padding: 10px;
      outline: none; /* Removes the focus outline */
    }
    .parent-footer {
      display: flex;
      justify-content: space-between;
    }
    .footer label {
      margin-right: 10px;
    }
    .footer input {
      width: 150px;
      height: 30px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .para1{
      width: 40%;
      margin-bottom: 20px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="form">
    <div class="header flex flex-row justify-between">
      <div>DC No.: ${req.body.dpPhone}</div>
      <div class="flex flex-row items-center">
        <div>Date: ${req.body.deliveryDate}</div>
      </div>
    </div>
    <div class="mb-3">
      <div>
        M/S: ${req.body.ms}
        <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
      </div>
      <div>
        Broker: ${req.body.broker}
        <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
      </div>
      <div>
        Vehicle No.: ${req.body.vehicleNum }
        <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
      </div>
      <div>
        Transport: ${req.body.transport}
        <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Thickness</th>
            <th>Width</th>
            <th>Length</th>
            <th>Weight</th>
            <th>Pcs</th>
            <th>Rate</th>
            <th>Product</th>
          </tr>
        </thead>
        <tbody>
          ${req.body.products.map((product, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${product.thickness}</td>
            <td>${product.width}</td>
            <td>${product.length}</td>
            <td>${product.weight}</td>
            <td>${product.pcs}</td>
            <td>${product.rate}</td>
            <td>${product.select_product}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="parent-footer">
      <div class="para1 mb-4 ">
        <p>
          हमारे यहाँ से माल रुकवा एवं प्रीति प्रेषण किया गया है। ट्रक में
          पर्ची लगने के उपरांत कर्ता की खपत होने की जवाबदारी हमारी नहीं होगी।
        </p>
      </div>
      <div class="footer">
        <div class="font-bold">
          Received by: ${req.body.Received_by}
          <div class="w-50 mb-4 ml-20"></div>
        </div>
        <div>
          Name: ${req.body.clientName}
          <div class="border-b-2 border-black-900 w-50 mb-4 ml-20"></div>
        </div>
        <div>
          Mob. ${req.body.phone_no}
          <div class="border-b-2 border-black-900 w-50 mb-4 ml-20"></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;


      
      await page.setContent(orderDetailsHTML);

      await page.pdf({ path: pdfPath, format: 'A4' });

      await browser.close();
      
      // Create a read stream for the PDF file
      const pdfReadStream = fileSystem.createReadStream(pdfPath);

      const s3 = new AWS.S3({
          accessKeyId: process.env.ACCESS_KEY_ID ,
          secretAccessKey: process.env. SECRET_ACCESS_KEY,
        });
        
      const bucketName = 'vss-project';

      const uploadParams = {
          Bucket: bucketName,
          Key: `${orderId}.pdf`,
          Body:pdfReadStream,  // Use fs.createReadStream here
          ContentType: 'application/pdf',
      };

     await s3.upload(uploadParams).promise();
      const params = {
          Bucket: bucketName,
          Key: `${orderId}.pdf`
      };

  // Get signed URL for the uploaded PDF
          const pdfURL = await s3.getSignedUrlPromise('getObject', params);

          console.log("pdfURL:" + pdfURL)

      // Set pdf_order data as the S3 URL
      user.pdf_url = pdfURL;


      // Ensure pdf_order is an object with type and data properties
      if (!user.pdf_order || typeof user.pdf_order !== 'object') {
          user.pdf_order = {
              type: 'application/pdf',
              data: null,
          };
      } else {
          // If pdf_order is already an object, ensure it has the required properties
          user.pdf_order.type = 'application/pdf';
          user.pdf_order.data = null;
      }

      // Check if any product is GP Sheet, GC Sheet, or Profile Sheet
const shouldMarkComplete = req.body.products.some(product =>
  ["GP Sheet", "GC Sheet", "Profile Sheet"].includes(product.select_product)
);

// Update Order_mark accordingly
if (shouldMarkComplete) {
  user.Order_mark = "Complete";
}

      // Set pdf_order data as the path to the saved PDF file
      user.pdf_order.data = pdfPath;
      

      // Save the new sales order
      const newOrder = await user.save({ select: '-pdf_order' });
      
    // Remove pdf_order from the newOrder object
if (newOrder.pdf_order) {
  newOrder.pdf_order = undefined;
}

// Send the response with the newOrder object
return res.status(201).json({
  status: 201,
  msg: 'Order successfully created',
  newOrder,
});

  } catch (err) {
      console.log(err);
      res.status(400).json({ "status": 400, "message": "Something Went Wrong" , error:err.message});
  }
};







exports.availableStock = async (req, res) => {
  try {
    // Destructure the parameters from the query string
    const {
      product,
      company,
      grade,
      topcolor,
      coating,
      temper,
      guardfilm,
      thickness,
      width,
      weight,
    } = req.query;

    // Construct a query object based on the provided parameters
    const query = {};

    if (product) query.product = product;
    if (company) query.company = company;
    if (grade) query.grade = grade;
    if (topcolor) query.topcolor = topcolor;
    if (coating) query.coating = parseInt(coating, 10); // Ensure 'coating' is a number
    if (temper) query.temper = temper;
    if (guardfilm) query.guardfilm = guardfilm;
    if (thickness) query.thickness = thickness;
    if (width) query.width = width;

    // Query the database using the constructed query object
    let filteredData = await stock.findOne(query);
    console.log("Filtered Data:", filteredData);

    // Check alternative products if filteredData is null
    if (!filteredData && product == "GP Sheet") {
      console.log("Checking for GP Coil");
      filteredData = await stock.findOne({
        product: "GP Coil",
        company: company,
        grade: grade,
        topcolor: topcolor,
        coating: parseInt(coating, 10),
        temper: temper,
        guardfilm: guardfilm,
        thickness: thickness,
        width: width
      });
    }

    if (!filteredData && product == "Profile Sheet") {
      console.log("Checking for Color Coil");
      filteredData = await stock.findOne({
        product: "Color Coil",
        company: company,
        grade: grade,
        topcolor: topcolor,
        coating: parseInt(coating, 10),
        temper: temper,
        guardfilm: guardfilm,
        thickness: thickness,
        width: width,
      });
    }

    if (!filteredData && product === "GC Sheet") {
      console.log("Checking for GC Coil");
      filteredData = await stock.findOne({
        product: "GC Coil",
        company: company,
        grade: grade,
        topcolor: topcolor,
        coating: parseInt(coating, 10),
        temper: temper,
        guardfilm: guardfilm,
        thickness: thickness,
        width: width,
      });
    }

    // If still no data found, return out of stock
    if (!filteredData) {
      return res.status(400).json({
        isAvailable: 'False',
        status: 400,
        message: "Out Of Stock",
      });
    }

    // Check if weight is provided and exceeds the available stock weight
    if (weight && parseFloat(weight) > filteredData.weight) {
      return res.status(400).json({
        isAvailable: 'False',
        status: 400,
        message: "We have stock, but not a sufficient weight",
      });
    }


    // If all fields exist and match, return the available stock data
    return res.status(200).json({
      isAvailable: 'True',
      status: 200,
      message: "Stock Available",
      filteredData,
    });

  } catch (error) {
    console.error("Error in availableStock:", error);
    return res.status(500).json({
      status: 500,
      message: "Something Went Wrong",
    });
  }
};




exports.checkStocks = async (req, res) => {
  try {
    // Destructure the parameters from the request body
    const {
      product,
      company,
      grade,
      topcolor,
      coating, // Passing 'coating' directly
      temper,
      guardfilm,
      thickness,
      width
    } = req.body;

    // Construct a query object based on the provided parameters
    const query = {};

    // Add properties to the query object only if they are provided
    if (product) query.product = product;
    if (company) query.company = company;
    if (grade) query.grade = grade;
    if (topcolor) query.topcolor = topcolor;
    if (coating) query.coating = coating;
    if (temper) query.temper = temper;
    if (guardfilm) query.guardfilm = guardfilm;
    if (thickness) query.thickness = thickness;
    if (width) query.width = width;

    // Query the database using the constructed query object
    let filteredData = await stock.findOne(query);

    // Check alternative products if filteredData is null and product is "GP Sheet"
    if (!filteredData && product === "GP Sheet") {
      filteredData = await stock.findOne({
        product: "GP Coil",
        company: company,
        grade: grade,
        topcolor: topcolor,
        coating: coating,
        temper: temper,
        guardfilm: guardfilm,
        thickness: thickness,
        width: width,
      });
    }

    // Check alternative products if filteredData is null and product is "Profile Sheet"
    if (!filteredData && product === "Profile Sheet") {
      console.log("Checking for Profile Sheet");
      filteredData = await stock.findOne({
        product: "Color Coil",
        company: company,
        grade: grade,
        topcolor: topcolor,
        coating: coating,
        temper: temper,
        guardfilm: guardfilm,
        thickness: thickness,
        width: width,
      });
    }

    if(!filteredData && product === "GC Sheet"){
      console.log("Checking for GC sheet");
      filteredData = await stock.findOne({
        product: "GC Coil",
        company: company,
        grade: grade,
        topcolor: topcolor,
        coating: coating,
        temper: temper,
        guardfilm: guardfilm,
        thickness: thickness,
        width: width,
      });
    }


    // If no data is found, return "Out Of Stock"
    if (!filteredData) {
      return res.status(400).json({
        isAvailable: 'False',
        status: 400,
        message: "Out Of Stock",
      });
    }


    // Check if the requested weight exceeds the available weight
    if (filteredData.weight < req.body.weight) {
      return res.status(400).json({
        isAvailable: 'False',
        status: 400,
        message: "We have stock, but not a sufficient weight",
      });
    }

    // Check that every provided field matches in the filtered data
    const hasAllFields = [
      !company || filteredData.company === company,
      !grade || filteredData.grade === grade,
      !topcolor || filteredData.topcolor === topcolor,
      !temper || filteredData.temper === temper,
      !guardfilm || filteredData.guardfilm === guardfilm,
      !thickness || filteredData.thickness === thickness,
      !width || filteredData.width === width
    ].every(Boolean); // Ensure all conditions are true

    // If any required field is not matching, return "Out Of Stock"
    if (!hasAllFields) {
      return res.status(400).json({
        isAvailable: 'False',
        status: 400,
        message: "Out Of Stock",
      });
    }

    // If all fields exist and match, return the available stock data
    return res.status(200).json({
      isAvailable: 'True',
      status: 200,
      message: "Stock Available",
      filteredData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Something Went Wrong",
    });
  }
};








exports.get = async(req, res) => {
    // Rest of the code will go here
    const orderList = await salesorder.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                from: 'clients',
                localField: 'oId',
                foreignField: 'firmName',
                as: 'orderdetails'
            }
        }
    ]).sort({_id:-1});
    res.json({ "status": 200, "message": 'data has been fetched', res: orderList });
}



// get
exports.get = async(req, res) => {
        // Rest of the code will go here
        const orderList = await salesorder.findById(req.params.id);
        if(orderList)
        {
            res.json({ "status": 200, "msg": 'data has been fetched', res: orderList });
        }else
        {
            res.json({ status:"400",message: "No Record found" });
        }
        
    }

    exports.edit = async (req, res) => {
        try {
            const findsalesOrder = await salesorder.findById(req.params.id);
            if (findsalesOrder) {
                // Update the sales order in the database
                const updatesalesOrder = await salesorder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
                // Generate a new PDF with updated information using Puppeteer
                const browser = await puppeteer.launch({
                    headless: 'new',
                    args: ['--no-sandbox'],
                });
                const page = await browser.newPage();
    
                // Generate HTML content for the PDF
                let orderDetailsHTML = `
                    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Details</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              clifford: "#DA373D",
            },
          },
        },
      };
    </script>
    <style>
      .form {
        width: 800px;
        margin: 40px auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        justify-content: space-evenly;
        margin-bottom: 20px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 20px;
      }
      .header label {
        /* margin-right: 10px; */
      }
      .header input {
        width: 150px;
        height: 30px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .table {
        margin-bottom: 20px;
        width: 100%;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: left;
      }
      th {
        background-color: #F0F0F0;
      }
      .footer {
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: end;
        margin-top: 20px;
      }
      .Text {
        border: none; /* Removes the border */
        border-bottom: 1px solid black; /* Adds an underline */
        width: 150px;
        height: 30px;
        padding: 10px;
        outline: none; /* Removes the focus outline */
      }
      .parent-footer {
        display: flex;
        justify-content: space-between;
      }
      .footer label {
        margin-right: 10px;
      }
      .footer input {
        width: 150px;
        height: 30px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .para1{
        width: 40%;
        margin-bottom: 20px;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="form">
      <div class="header flex flex-row justify-between">
        <div>DC No.: ${req.body.dpPhone}</div>
        <div class="flex flex-row items-center">
          <div>Date: ${req.body.deliveryDate}</div>
        </div>
      </div>
      <div class="mb-3">
        <div>
          M/S: ${req.body.ms}
          <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
        </div>
        <div>
          Broker: ${req.body.broker}
          <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
        </div>
        <div>
          Vehicle No.: ${req.body.vehicleNum }
          <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
        </div>
        <div>
          Transport: ${req.body.transport}
          <div class="border-b-2 border-black-900 w-80 mb-4 ml-20"></div>
        </div>
      </div>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Thickness</th>
              <th>Width</th>
              <th>Length</th>
              <th>Weight</th>
              <th>Pcs</th>
              <th>Rate</th>
              <th>Product</th>
            </tr>
          </thead>
          <tbody>
            ${req.body.products.map((product, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${product.thickness}</td>
              <td>${product.width}</td>
              <td>${product.length}</td>
              <td>${product.weight}</td>
              <td>${product.pcs}</td>
              <td>${product.rate}</td>
              <td>${product.select_product}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="parent-footer">
        <div class="para1 mb-4 ">
          <p>
            हमारे यहाँ से माल रुकवा एवं प्रीति प्रेषण किया गया है। ट्रक में
            पर्ची लगने के उपरांत कर्ता की खपत होने की जवाबदारी हमारी नहीं होगी।
          </p>
        </div>
        <div class="footer">
          <div class="font-bold">
            Received by: ${req.body.Received_by}
            <div class="w-50 mb-4 ml-20"></div>
          </div>
          <div>
            Name: ${req.body.clientName}
            <div class="border-b-2 border-black-900 w-50 mb-4 ml-20"></div>
          </div>
          <div>
            Mob. ${req.body.phone_no}
            <div class="border-b-2 border-black-900 w-50 mb-4 ml-20"></div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
                `;
    
                // Check if updatesalesOrder contains an array of products
           
                await page.setContent(orderDetailsHTML);
                const pdfBuffer = await page.pdf({ format: 'A4' });
                await browser.close();
    
                // Upload the updated PDF to AWS S3
                const s3 = new AWS.S3({
                    accessKeyId: process.env.ACCESS_KEY_ID ,
            secretAccessKey: process.env. SECRET_ACCESS_KEY,
                  });
                const bucketName = 'vss-project';
                const uploadParams = {
                    Bucket: bucketName,
                    Key: `${updatesalesOrder.orderId}.pdf`,
                    Body: pdfBuffer,
                    ContentType: 'application/pdf',
                };
                await s3.upload(uploadParams).promise();
    
                // Get the signed URL for the updated PDF
                const params = {
                    Bucket: bucketName,
                    Key: `${updatesalesOrder.orderId}.pdf`
                };
                const updatedPDFURL = await s3.getSignedUrlPromise('getObject', params);
                console.log("updatedPDFURL is", updatedPDFURL);
    
                // Update the PDF URL in the sales order object
                updatesalesOrder.pdf_url = updatedPDFURL;
    
                // Save the updated sales order
                await updatesalesOrder.save();
    
                console.log("Updated sales order:", updatesalesOrder);
    
                res.status(200).json({
                    updatedData: updatesalesOrder,
                    UpdatedURL: updatedPDFURL
                });
            } else {
                res.status(404).json("Sales order not found");
            }
        } catch (error) {
            console.error(error);
            res.status(500).json("Data is not updated");
        }
    };
    
    
    
    // // put one
    // exports.edit = async (req, res) => {
    //     try {
    //         // Update record from collection
    //         var updatedUser;
    //         var status = "0";
    
    //         switch (req.body.updateType) {
    //             case 'batchUpdate':
    //                 updatedUser = await salesorder.findOneAndUpdate({
    //                     _id: new mongoose.Types.ObjectId(req.params.id),
    //                     "products.productId": req.body.pid
    //                 }, {
    //                     $set: {
    //                         "products.$.batch_list": req.body.products.batch_list,
    //                         "orderstatus": "2"
    //                     }
    //                 }, { multi: true });
    //                 status = "2";
    //                 break;
    
    //             case 'productionInUpdate':
    //                 updatedUser = await salesorder.findOneAndUpdate({
    //                     _id: new mongoose.Types.ObjectId(req.params.id),
    //                     "products.productId": req.body.pid
    //                 }, {
    //                     $set: {
    //                         "products.$.pIn_id": req.body.products.pIn_id,
    //                         "products.$.productionincharge": req.body.products.productionincharge,
    //                         "products.$.assignDate": req.body.products.assignDate,
    //                         "products.$.completionDate": req.body.products.completionDate,
    //                         "products.$.phNote": req.body.products.phNote,
    //                         "orderstatus": "1"
    //                     }
    //                 }, { multi: true });
    //                 status = "1";
    //                 break;
    
    //             case 'SalesManager':
    //                 updatedUser = await salesorder.findOneAndUpdate(
    //                     { _id: new mongoose.Types.ObjectId(req.params.id) },
    //                     {
    //                         $set: {
    //                             clientName: req.body.clientName,
    //                             firmName: req.body.firmName,
    //                             address: req.body.address,
    //                             city: req.body.city,
    //                             phone_no: req.body.phone_no,
    //                             sales_id: req.body.sales_id,
    //                             sales_name: req.body.sales_name,
    //                             orderId: req.body.orderId,
    //                             currentDate: new Date().toISOString(),
    //                             deliveryDate: req.body.deliveryDate,
    //                             note: req.body.note,
    //                             products: req.body.products,
    //                             ph_id: req.body.ph_id,
    //                             ph_name: req.body.ph_name,
    //                             process_bar: req.body.process_bar,
    //                             smName: req.body.smName,
    //                             vehicleNum: req.body.vehicleNum,
    //                             dpDate: req.body.dpDate,
    //                             dpRecieved: req.body.dpRecieved,
    //                             dpPhone: req.body.dpPhone,
    //                             dpTotalWeight: req.body.dpTotalWeight,
    //                             "orderstatus": "0"
    //                         }
    //                     }, { multi: true }
    //                 );
    //                 status = "0";
    //                 break;
    
    //             default:
    //                 updatedUser = await salesorder.findOneAndUpdate(req.params.id, req.body, { new: true });
    //                 status = "3";
    //                 console.log(updatedUser)
    //         }
    
    //         var updStatus = await salesorder.findById(req.params.id).exec();
    //         updStatus.set({ 'orderstatus': status });
    //         await updStatus.save();
    
    //         updatedUser = await salesorder.findById(req.params.id);
    //         res.status(201).json({ "status": 200, "msg": 'record successfully updated', res: updatedUser });
    
    //     } catch (err) {
    //         res.status(400).json({ message: err.message });
    //     }
    // };


// delete
exports.delete = async(req, res) => {
        try {
            
         const user_data= await salesorder.findById(req.params.id);
          if(user_data){
            await salesorder.findById(req.params.id).deleteOne();
            res.json({ status:"200",message: "Record has been deleted " });
          }else
        {
         
         res.json({ status:"201",message: "No Record found" });
          }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

 
    // exports.allRecords = async (req, res) => {
    //     try {
    //         const resPerPage = 10; // results per page
    //         const page = req.params.page || 1; // Page 
    //         const orderList = await salesorder.find().select({ pdf_order: false })
    //               // Remove pdf_order from the newOrder object
    //             .sort({ '_id': -1 })
    //             .populate({
    //                 path: 'productionincharge',
    //                 select: '_id UserName' // Specify the fields you want to include from the 'productionincharge' collection
    //             }).populate({
    //                 path:'db_id',
    //                 select:'_id UserName'
    //             }).populate({
    //                 path:'products.productId',
    //                 select:'batch_number'
    //             })
    //             .skip((resPerPage * page) - resPerPage)
    //             .limit(resPerPage);

    //       let ProductObject = orderList.forEach(item => {
    //         console.log(item.products, "Products for Order ID:", item._id);
          

    //        });

        
        


    //             //  for(let Products of orderList.)
    
    //         res.json({ "status": 200, "msg": 'data has been fetched', res: orderList });
    //     } catch (err) {
    //         res.status(500).json({ message: err.message });
    //     }
    // };
    
    exports.allRecords = async (req, res) => {
        try {
            const resPerPage = 10; // Results per page
            const page = req.params.page || 1; // Page number
    
            let orderList = await salesorder.find()
                .select({ pdf_order: false }) // Exclude the pdf_order field
                .sort({ '_id': -1 }) // Sort by latest order first
                .populate({
                    path: 'productionincharge',
                    select: '_id UserName' // Populate productionincharge fields
                })
                .populate({
                    path: 'db_id',
                    select: '_id UserName' // Populate db_id fields
                })
                .skip((resPerPage * page) - resPerPage)
                .limit(resPerPage);
    
            // Iterate over each order and its products to fetch batch numbers
            for (let order of orderList) {
                let batchNumbers = []; // Initialize an array to hold batch numbers for the order
    
                for (let product of order.products) {
                    // Find the matching product in AddStock
                    const stockInfo = await AddStock.findOne({
                        product: product.select_product,
                        company: product.company
                    });
    
                    // If stock information is found, attach the batch_number to the product
                    if (stockInfo) {
                        product.Batch_Number = stockInfo.batch_number; // Assign the batch_number from stockInfo
                        batchNumbers.push(stockInfo.batch_number[0]); // Store the first batch_number
                    } else {
                        product.Batch_Number = 'No batch found'; // Default if no matching stock is found
                    }
                }
    
                // Update the salesorder with the new batch numbers
                if (batchNumbers.length > 0) {
                    order.Batch_Number = batchNumbers; // Assign batch numbers to the order
                    await order.save(); // Save the updated order
                }
            }
    
            // Convert to plain objects to include the updated products
            const responseList = orderList.map(order => order.toObject());
    
            // Send the updated order list with batch details
            res.json({ status: 200, msg: 'Data has been fetched', res: responseList });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
    
    
    
    
    
    
    

