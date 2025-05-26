const OrderDetails = require("../models/sales");
const eventEmitter = require("../utils/eventEmitter");
const admin = require("firebase-admin");
const serviceAccount = require("../config/fcm.json");
const salesorder = require("../models/sales"); // Assuming salesorder is the correct model
const stocks = require("../models/Stock_M");
const sales = require("../models/sales");
const mongoose = require("mongoose");
const Mobilelogin = require("../models/mobile");
const { ObjectId } = require("mongodb"); // Import ObjectId from mongodb package

exports.getstocksdata = async (req, res) => {
  try {
    const ProductId = req.query.id;
    // Assuming 'stocks' is your MongoDB model
    const newgetstocks = await stocks.aggregate([
      {
        $match: {
          _id: ObjectId(ProductId), // Use ObjectId to convert ProductId to MongoDB ObjectId
        },
      },
      {
        $group: {
          _id: "$batch_number",
          details: { $push: "$$ROOT" }, // Store all details for each batch_number
        },
      },
    ]);

    if (!newgetstocks || newgetstocks.length === 0) {
      return res.status(404).json({ message: "Stocks not found" }); // Return 404 if no data found
    }

    res.status(200).json({
      message: "Stocks retrieved successfully",
      data: newgetstocks,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// exports.editStocks = async (req, res) => {
//   try {
//     const batchNumbers = req.params.batch_number.split(',');

//     // Find all stocks with the given batch_numbers
//     const findDataArray = await stocks.find({ batch_number: { $in: batchNumbers } });

//     if (!findDataArray || findDataArray.length === 0) {
//       return res.status(400).json({
//         message: 'No matching data found',
//       });
//     }

//     const requestedWeight = req.body.weight;

//     for (const findData of findDataArray) {
//       const existingWeight = findData.weight;

//       if (requestedWeight > existingWeight) {
//         return res.status(400).json({
//           message: 'Requested weight exceeds existing stock weight',
//         });
//       }

//       const remainingWeight = existingWeight - requestedWeight;

//       // Update the 'weight' field with the remaining weight and keep all other properties
//       const updatedData = await stocks.findOneAndUpdate(
//         { _id: findData._id },
//         { $set: { weight: remainingWeight } },
//         { new: true }
//       );
//       console.log("new updated data", updatedData)

//       // Create a new batch_number
//       const newBatchNumber = `batch-${Date.now()}`;

//       // Create a new stocks entry with the same properties, the provided weight, and the new batch_number
//       const newStocksRecord = new stocks({
//         ...findData.toObject(),
//         _id: undefined,
//         weight: requestedWeight,
//         batch_number: newBatchNumber,
//       });

//       // Save the new stocks record
//       await newStocksRecord.save();

//       console.log("new stocks is ", newStocksRecord)
//         // After the loop, send the response once
//     res.status(200).json({
//       message: 'Stocks updated successfully',
//       newbatchNumber:newStocksRecord
//     });
//     }

//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

exports.editStocks = async (req, res) => {
  try {
    const batchNumbers = req.params.batch_number.split(",");

    // Find all stocks with the given batch_numbers
    const findDataArray = await stocks.find({
      batch_number: { $in: batchNumbers },
    });

    console.log("findDataArray", findDataArray);

    if (!findDataArray || findDataArray.length === 0) {
      return res.status(400).json({
        message: "No matching data found",
      });
    }

    const requestedWeight = req.body.weight; // Total weight requested

    for (const findData of findDataArray) {
      const existingWeight = findData.weight;

      // Validate requested weight
      if (requestedWeight > existingWeight) {
        return res.status(400).json({
          message: `Requested weight (${requestedWeight} kg) exceeds available stock weight (${existingWeight} kg) for batch ${findData.batch_number}`,
        });
      }

      // Calculate the remaining weight for the original stock
      const remainingWeight = existingWeight - requestedWeight;

      // Update the original stock's weight
      const updatedData = await stocks.findOneAndUpdate(
        { _id: findData._id },
        { $set: { weight: remainingWeight } },
        { new: true }
      );

      // Send a success response after processing
      return res.status(200).json({
        message: "Stock weight updated successfully",
        updatedStock: updatedData,
      });
    }
  } catch (error) {
    console.error("Error updating stocks:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.checkBatchWeight = async (req, res) => {
  try {
    const batch_numbers = req.params.batch_number.split(","); // Array of batch numbers
    const requestedWeight = req.body.weight;

    // Find stock entries that contain the given batch numbers
    const stockEntries = await stocks.find({
      "batch_details.batchNumber": { $in: batch_numbers },
    });

    const mapdata = stockEntries[0]?.batch_details.map((batch) => {
      return {
        batchNumbers: batch.batchNumber, // Example: Adjust based on your actual structure
        weights: batch.weight,
      };
    });

    if (!stockEntries.length) {
      return res
        .status(404)
        .json({ message: "No matching batch numbers found." });
    }

    for (const stock of stockEntries) {
      for (const batch of stock.batch_details) {
        if (batch_numbers.includes(batch.batchNumber)) {
          if (batch.weight < requestedWeight) {
            return res.status(400).json({
              message: `Requested weight (${requestedWeight} kg) exceeds available stock weight (${batch.weight} kg) for batch ${batch.batchNumber}`,
            });
          }

          // Reduce weight for the batch
          await stocks.updateOne(
            { "batch_details.batchNumber": batch.batchNumber },
            { $inc: { "batch_details.$.weight": -requestedWeight } }
          );
        }
      }
    }

    return res.status(200).json({
      status: true,
      message: "Weight updated successfully.",
      PreviousWeight: mapdata[0]?.weights || 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

exports.getBatchWeight = async (req, res) => {
  try {
    const batch_numbers = req.params.batch_number.split(","); // Convert batch_number into an array

    // Find stock entries containing the batch numbers
    const stockEntries = await stocks.find({
      "batch_details.batchNumber": { $in: batch_numbers },
    });

    console.log(stockEntries);

    if (!stockEntries.length) {
      return res
        .status(404)
        .json({ message: "No matching batch numbers found." });
    }

    // Extract batch weights
    let batchWeights = [];
    stockEntries.forEach((stock) => {
      stock.batch_details.forEach((batch) => {
        if (batch_numbers.includes(batch.batchNumber)) {
          batchWeights.push({
            batchNumber: batch.batchNumber,
            availableWeight: batch.weight,
          });
        }
      });
    });

    return res.status(200).json({
      status: true,
      message: "Batch weight details fetched successfully.",
      data: batchWeights,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getstocksdataById = async (req, res) => {
  try {
    // Assuming 'stocks' is your MongoDB model
    const requestedBatchNumber = req.params.id; // Use req.params.id to get the value from the route parameter

    const newgetstocks = await stocks.aggregate([
      {
        $match: {
          batch_number: requestedBatchNumber,
        },
      },
    ]);

    console.log(newgetstocks);

    if (!newgetstocks || newgetstocks.length === 0) {
      res.status(400).json({
        message: "Stocks not found",
      });
    } else {
      res.status(200).json({
        message: "Stocks retrieved successfully",
        data: newgetstocks,
      });
    }
  } catch (error) {
    res.status(500).json({
      Error: error.message,
    });
  }
};

// Check if Firebase Admin SDK is already initialized
if (!admin.apps.length) {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function sendPushNotification(deviceToken, message) {
  const payload = {
    notification: {
      title: "Order Accepted",
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
        console.error("FCM notification failed:", firstResult.error);
      } else {
        console.log("FCM notification sent successfully:", response);
      }
    }
  } catch (error) {
    console.error("Error sending FCM notification:", error);
  }
}

// Listen for 'OrderAccepted' event
// Listen for 'OrderAccepted' event
eventEmitter.on("OrderAccepted", async ({ orderId, sales_id }) => {
  try {
    const salesPerson = await salesorder.findOne({ sales_id });

    if (!salesPerson) {
      console.error("Sales person not found for sales_id:", sales_id);
      return;
    }

    const { sales_name } = salesPerson;
    const staticDeviceToken = "your_static_device_token"; // Replace with your static device token

    console.log(`New Order has Accpected by Production-head`);

    // Additional logic related to notifying the production head manager can be added here

    // Send FCM notification to the static device token
    const message = `New Order has Accpected by Production-head ${sales_name}`;
    await sendPushNotification(staticDeviceToken, message);
  } catch (error) {
    console.error("Error handling OrderAccepted event:", error);
  }
});

// Shows the Order Deatils with Order status //

exports.showOrderDetails = async (req, res) => {
  try {
    const newOrderDetails = await OrderDetails.find({ orderstatus: "Accepted" })
      .select({ pdf_order: false })
      .populate({
        path: "productionincharge",
        select: "_id UserName",
      })
      .populate({
        path: "db_id",
        select: "id UserName",
      });

    // Filter orders with 'Accepted' status and production incharge matches Finddata
    let acceptedOrders = newOrderDetails.filter(
      (order) => order.productionincharge.length
    );

    if (!acceptedOrders.length)
      return res.status(404).json({
        message: "No orders found for the provided production incharge",
      });

    acceptedOrders = await Promise.all(
      acceptedOrders.map(async (order) => {
        let products = await Promise.all(
          order.products.map(async (product) => {
            if (!product.productionincharge.length) return null;

            const stock = await stocks.findOne({
              company: product.company,
              grade: product.grade,
              topcolor: product.topcolor,
              coating: product.coating,
              temper: product.temper,
              guardfilm: product.guardfilm,
            });

            return {
              ...product.toJSON(),
              Batch_Number:
                product.Batch_Number.length > 0
                  ? product.Batch_Number
                  : stock?.batch_number || [],
            };
          })
        );

        products = products.filter(Boolean);

        return { ...order.toJSON(), products };
      })
    );

    acceptedOrders = acceptedOrders.filter((order) => order.products.length);

    return res.status(200).json({ orderDetails: acceptedOrders });
  } catch (error) {
    console.error("Error in showOrderDetails:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// exports.getStocks=async(req,res)=>{
//   try{

//     const GetAllStocks= await stocks.find({}).exec()
//     if(GetAllStocks){
//       res.status(200).json({
//         stocks:GetAllStocks
//       })
//     }
//   }
//   catch(error){
//     res.status(500).json({
//       Error:error
//     })

//   }
// }

//  Get Stocks //

exports.getStocks = async (req, res) => {
  try {
    const Products = await OrderDetails.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.select_product",
          production_incharge: { $first: "$products.productionincharge" },
          orderDeatils: { $first: "$orderId" },
        },
      },
      {
        $project: {
          _id: 0,
          select_product: "$_id",
          production_incharge: 1,
          orderDeatils: 1,
        },
      },
    ]).exec();

    if (Products.length === 0) {
      return res.status(404).json({
        message: "No products found in OrderDetails",
      });
    }

    // // Extract an array of values from the objects in Products
    const productValues = Products.map((product) => product.select_product);

    // const productValues=Products.map((mao))

    const matchingStocks = await stocks.find({
      product: {
        $in: productValues,
      },
    });

    if (matchingStocks.length > 0) {
      // Map over matchingStocks to include production_incharge for each product
      const stocksWithProductionIncharge = matchingStocks.map((stock) => {
        const matchingProduct = Products.find(
          (product) => product.select_product === stock.product
        );
        return {
          ...stock.toObject(),
          production_incharge: matchingProduct
            ? matchingProduct.production_incharge
            : null,
          orderDeatils: matchingProduct ? matchingProduct.orderDeatils : null,
        };
      });

      res.status(200).json({
        stocks: stocksWithProductionIncharge,
      });
    } else {
      res.status(404).json({
        message: "No matching Stocks found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// exports.pickup = async (req, res) => {
//   try {
//     const OrderId = req.query.orderId;
//     const Order_mark = req.query.Order_mark;

//     if (!['Complete', 'waiting'].includes(Order_mark)) {
//       return res.status(400).json({
//         message: 'Invalid Order_mark value',
//       });
//     }

//     // Find the order using the correct data type for OrderId
//     const findorder = await salesorder.findOne({ orderId: OrderId });

//     if (!findorder) {
//       return res.status(404).json({
//         message: 'Order not found',
//       });
//     }

//     // Update the Order_mark
//     findorder.Order_mark = Order_mark;

//     // Save the updated order
//     const updatedOrder = await findorder.save();

//     console.log('After Update:', updatedOrder);

//     await notifyDispatchManager(OrderId,'Complete')

//     return res.status(200).json({ updatedData: updatedOrder, OrderId: OrderId });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
// Production-incharge.js

// Assign Orde to Dispatch Manager //

exports.AssignOrder = async (req, res) => {
  try {
    const findsalesdata = await sales.findById(req.params.id);
    if (findsalesdata) {
      const DispatchManagerobjectId = mongoose.Types.ObjectId(req.body.db_id);
      const updateDispatchManager = await sales.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            db_id: DispatchManagerobjectId,
          },
        },
        { new: true }
      );
      res.status(200).json({
        updatedData: updateDispatchManager,
      });
    } else {
      res.status(404).json("Sales order not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Data is not updated");
  }
};

// Pick Up the Orders
exports.pickup = async (req, res) => {
  try {
    const OrderId = req.query.orderId;
    const Order_mark = req.query.Order_mark;

    if (!["Complete", "waiting"].includes(Order_mark)) {
      return res.status(400).json({
        message: "Invalid Order_mark value",
      });
    }

    // Find the order using the correct data type for OrderId
    const findorder = await salesorder.findOne({ orderId: OrderId });

    if (!findorder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Update the Order_mark
    findorder.Order_mark = Order_mark;

    // Save the updated order
    const updatedOrder = await findorder.save();

    // Notify the dispatch manager with the orderId
    if (Order_mark === "Complete") {
      await notifyDispatchManager(OrderId, "Complete");
    } else if (Order_mark === "waiting") {
      await notifyDispatchManager(OrderId, "waiting");
    }

    return res
      .status(200)
      .json({ updatedData: updatedOrder, OrderId: OrderId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Notify to the Dispatch_Manager when Order is Completed and says: Hey order has been received
async function notifyDispatchManager(orderId, eventType) {
  try {
    const orderCheck = await salesorder.findOne({ orderId });
    console.log("orderCheck data is", orderCheck);

    if (!orderCheck) {
      console.error("Order is not found for orderId", orderId);
      return;
    }

    const getData = await Mobilelogin.find({
      Role: { $in: ["Dispatchmanager"] },
    });

    const dispatchManager = getData.map((manager) => manager._id);

    orderCheck.products = orderCheck.products.map((product) => ({
      ...product,
      dispatchManager,
    }));

    orderCheck.dispatchManager = dispatchManager;

    await orderCheck.save();

    // Assuming you want to notify each dispatch person individually
    for (const dispatchPerson of getData) {
      if (eventType === "Complete") {
        eventEmitter.emit("Complete", {
          DispatchPerson: dispatchPerson._id,
          orderId,
        });
      } else if (eventType === "waiting") {
        eventEmitter.emit("waiting", {
          DispatchPerson: dispatchPerson._id,
          orderId,
        });
        console.log("Data Emit is", dataEmit);
      } else {
        console.error("Invalid eventType:", eventType);
      }
    }
  } catch (error) {
    console.error("Error in notifyDispatchManager:", error);
  }
}
