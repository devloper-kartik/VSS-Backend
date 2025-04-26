const productionSchema = require("../models/productionhead");
const purchase = require("../models/purchaseStockSchema");
const mongoose = require("mongoose");
const eventEmitter = require("../utils/eventEmitter");
const SalesManager = require("../models/sales");
const Moblie = require("../models/mobile");

// Assuming redisClient is already created and connected elsewhere in your code
// Example: const redisClient = redis.createClient();

// const getAsync = promisify(redisClient.get).bind(redisClient);
// const setExAsync = promisify(redisClient.setex).bind(redisClient);

// exports.checkOrderDetails = async (req, res) => {
//   try {
//     const key = 'allOrders'; // Adjust the key as needed

//     if (!redisClient) {
//       console.error('Redis client is not connected');
//       return res.status(500).json({
//         message: 'Redis Client is not connected',
//       });
//     }

//     const cachedData = await getAsync(key);

//     if (cachedData) {
//       console.log('Order details from cache', JSON.parse(cachedData));
//       return res.json({ data: JSON.parse(cachedData) });
//     }

//     const finddetails = await SalesManager.find({})
//       .populate({
//         path: 'productionincharge',
//         select: '_id UserName ',
//       })
//       .sort({ currentDate: -1 });

//     if (finddetails.length > 0) {
//       // Store data in Redis with an expiration time (e.g., 1 hour)
//       await setExAsync(key, 30, JSON.stringify(finddetails));
//       return res.json({ data: finddetails });
//     } else {
//       console.log('No orders found in the database');
//       return res.status(404).json({ error: 'No Orders found' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// To Accept order and Reject the orders //

exports.checkorder = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const decision = req.query.decision;
    const UpdateId = req.params.id;

    // Find the order by orderId
    const orderDetails = await SalesManager.findById(UpdateId);

    // Check if the orderDetails is not null
    if (!orderDetails) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (decision === "accept") {
      orderDetails.orderstatus = "Accepted";

      // Save the updated order status
      const result = await orderDetails.save();

      console.log("After Update:", result);

      // Notify the sales manager about acceptance
      await notifysalesManager(orderId, "OrderAccepted");

      return res.status(200).json({ orderId: orderId, updatedData: result });
    } else if (decision === "reject") {
      const salesPersonId = orderDetails.orderId;
      orderDetails.orderstatus = "Rejected";

      // Save the updated order status
      const result = await orderDetails.save();

      console.log("After Update:", result);

      // Notify the sales manager about rejection
      await notifysalesManager(salesPersonId, "OrderRejected");

      return res.status(200).json({ orderId: orderId, updatedData: result });
    } else {
      return res.status(400).json({ error: "Invalid decision" });
    }
  } catch (error) {
    console.error("Error in checkorder:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

async function notifysalesManager(orderId, eventType) {
  try {
    // Use findOne to find the order details by orderId
    const orderDetails = await SalesManager.findOne({ orderId: orderId });

    if (!orderDetails) {
      console.error("Order not found for orderId:", orderId);
      return;
    }

    // Use the sales_id from orderDetails to fetch the sales person
    const salesPersonId = orderDetails.sales_id;
    const salesPerson = await SalesManager.findOne({ sales_id: salesPersonId });

    console.log("salesPerson data is", salesPerson);

    if (salesPerson) {
      // Emit the specific events based on the decision
      if (eventType === "OrderAccepted") {
        const dataEmit = eventEmitter.emit("OrderAccepted", { salesPerson });
        console.log("data Emit is", dataEmit);
      } else if (eventType === "OrderRejected") {
        const dataEmit = eventEmitter.emit("OrderRejected", { salesPerson });
        console.log("data Emit is", dataEmit);
      } else {
        console.error("Invalid event type:", eventType);
      }
    } else {
      console.error("Sales person not found for salesPersonId:", salesPersonId);
    }
  } catch (error) {
    console.error("Error notifying Sales Manager:", error);
  }
}

exports.checkOrderDetails = async (req, res) => {
  try {
    const finddetails = await SalesManager.find({})
      .populate({
        path: "productionincharge",
        select: "_id UserName", // Specify the fields you want to include from the 'productionincharge' collection
      })
      .sort({ currentDate: -1 });
    res.status(200).json({
      message: "Order Details is shows",
      orderdetails: finddetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "OrderDetails is not found",
      Error: error,
    });
  }
};

exports.create = async (req, res) => {
  // Rest of the code will go here
  const user = new productionSchema({
    productionincharge: req.body.productionincharge,
    deliveryDate: req.body.deliveryDate,
    completionDate: req.body.completionDate,
    _cId: mongoose.Types.ObjectId(req.body._cId),
    oId: mongoose.Types.ObjectId(req.body.oId), // order id from sales create order
  });
  try {
    const newUser = await user.save();
    res
      .status(201)
      .json({ status: 200, message: "data sucessfully inserted", newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.orderdetails = async (req, res) => {
  try {
    const finddata = await purchase.find();
    if (finddata) {
      res.status(200).json({
        data: finddata,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

// get
// exports.get = async (req, res) => {
//     try {
//         const userList = await productionSchema.aggregate([
//             { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
//             {
//                 $lookup: {
//                     from: 'clients',
//                     localField: '_cId',
//                     foreignField: '_id',
//                     as: 'clientdetails'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'saleorders',
//                     localField: 'oId',
//                     foreignField: 'orderId',
//                     as: 'orderdetails'
//                 }
//             }
//         ]);

//         console.log("userList  data is", userList)

//         res.json({ status: 200, message: 'Data has been fetched', data: userList });
//     } catch (error) {
//         res.status(500).json({ status: 500, message: 'An error occurred', error: error.message });
//     }
// }

exports.get = async (req, res) => {
  try {
    const user = await productionSchema
      .findOne({ _id: req.params.id })
      .populate("_cId")
      .populate("oId");

    if (!user) {
      res.status(404).json({ status: 404, message: "Data not found" });
      return;
    }

    console.log("User data is", user);

    res.json({ status: 200, message: "Data has been fetched", data: user });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "An error occurred",
      error: error.message,
    });
  }
};

// Update salesOrder //

exports.EditOrder = async (req, res) => {
  try {
    const findsalesOrder = await SalesManager.findById(req.params.id);
    if (!findsalesOrder) return res.status(404).json("Sales order not found");

    const { ProductionIncharge, productId } = req.body;

    const manager = await Moblie.findById(ProductionIncharge);

    const allowedRoles = ["Dispatchmanager", "ProductionIncharge"];
    if (!allowedRoles.includes(manager?.Role))
      return res.status(404).json("Invalid Role");

    if (manager.Role === "ProductionIncharge")
      findsalesOrder.productionincharge = [manager._id];
    else findsalesOrder.dispatchManager = [manager._id];

    findsalesOrder.products = findsalesOrder.products.map((product) => {
      if (product._id.toString() !== productId) return product;

      if (manager.Role === "ProductionIncharge")
        product.productionincharge = [manager._id];
      else product.dispatchManager = [manager._id];

      return product;
    });

    // console.log(findsalesOrder);

    const updatesalesOrder = await findsalesOrder.save();

    res.status(200).json({ updatedData: updatesalesOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json("Data is not updated");
  }
};

// put one
exports.edit = async (req, res) => {
  try {
    const updatedUser = await productionSchema.findById(req.params.id).exec();
    updatedUser.set(req.body);
    const updateProductionIn = await updatedUser.save();
    res
      .status(201)
      .json({ status: 200, msg: "record sucessfully updated", updatedUser });
    // res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// delete
exports.delete = async (req, res) => {
  try {
    await productionSchema.findById(req.params.id).deleteOne();
    res.json({ message: "User has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//pagination
// exports.allRecords = async (req, res) => {
//     // Rest of the code will go here
//     try {
//         const resPerPage = 10; // results per page
//         const page = req.params.page || 1; // Page
//         const userList = await productionSchema.find().skip((resPerPage * page) - resPerPage).limit(resPerPage);

//         res.json({ userList })
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// }

exports.allRecords = async (req, res) => {
  try {
    const orderdetails = await productionSchema.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "clients",
          foreignField: "_cId",
          as: "ClientsDetails",
        },
      },
      {
        $lookup: {
          from: "saleorders",
          localField: "saleorders",
          foreignField: "oId",
          as: "OrderDetails",
        },
      },
    ]);

    res.status(200).json({
      data: orderdetails,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
