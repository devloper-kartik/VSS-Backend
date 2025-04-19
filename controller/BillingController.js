const sales = require("../models/sales");
const salesorder = require("../models/sales");
var ISODate = require("isodate");
const moment = require("moment");

exports.Billing = async (req, res) => {
  try {
    // const page = parseInt(req.query.page) || 1;
    // let limit = parseInt(req.query.limit) || null;
    // const skip = (page - 1) * limit;

    const fetchdata = await salesorder
      .find({})
      .populate({
        path: "db_id",
        select: "_id UserName",
      })
      .select({ pdf_order: false });

    if (!fetchdata || fetchdata.length === 0) {
      ``;
      return res.status(404).json({
        message: "Data not found",
      });
    }

    let Filterfetchdata = fetchdata.filter(
      (item) => item.dpRecieved === "Recived"
    );
    // if (limit === null) {
    //   limit = Filterfetchdata.length
    // }

    // Filterfetchdata = Filterfetchdata.slice(0, limit)

    // console.log(Filterfetchdata)

    res.status(200).json({
      FinalBill: Filterfetchdata,
      nhits: Filterfetchdata.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Billing Data By Id //

exports.BillingById = async (req, res) => {
  try {
    // get id from parmas
    const paramsId = req.params.id;
    const Billby = await salesorder
      .findById(paramsId)
      .select({ pdf_order: false });

    if (!Billby) {
      res.status(400).json({
        message: "Data is not found",
      });
    }
    res.status(200).json({
      message: Billby,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//create
exports.create = async (req, res) => {
  // Rest of the code will go here
  const user = new salesorder({
    //oId:req.body.oId,
    //clientId:req.body.clientId, // AUTO GENRATED ID FROM CLIENT DATA
    //---------client data---------------
    clientName: req.body.clientName,
    firmName: req.body.firmName,
    address: req.body.address,
    city: req.body.city,
    phone_no: req.body.phone_no,
    //--------------order create----------
    orderId: req.body.orderId,
    currentDate: req.body.currentDate,
    deliveryDate: req.body.deliveryDate,
    note: req.body.note,
    orderstatus: req.body.orderstatus, // 1-red -> not start, 2-orange -> in process, 3-green -> complete
    products: req.body.products,
    //--------production head data--------
    process_bar: req.body.process_bar,
    productionincharge: req.body.productionincharge,
    assignDate: req.body.assignDate,
    completionDate: req.body.completionDate,
    phNote: req.body.phNote,
    //----------dispatch manager----------
    smName: req.body.smName,
    vehicleNum: req.body.vehicleNum,
    dpDate: req.body.dpDate,
    dpRecieved: req.body.dpRecieved,
    dpPhone: req.body.dpPhone,
    dpTotalWeight: req.body.dpTotalWeight,
  });
  try {
    const newOrder = await user.save();
    res
      .status(201)
      .json({ status: 200, msg: "order sucessfully created", newOrder });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//--------get----- aggregation-------------
exports.get = async (req, res) => {
  // Rest of the code will go here
  const orderList = await salesorder.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
    {
      $lookup: {
        from: "clients",
        localField: "oId",
        foreignField: "firmName",
        as: "orderdetails",
      },
    },
  ]);
  res.json({ status: 200, message: "data has been fetched", res: orderList });
};
// get
exports.getbyid = async (req, res) => {
  // Rest of the code will go here
  const orderList = await salesorder.findById(req.params.id);
  res.json({ status: 200, msg: "data has been fetched", res: orderList });
};

/// for get by productId
// exports.gt = async (req, res) => {
//     try { proid=req.params.id
//         const userList = await salesorder.find({ 'products' : { "$elemMatch" : { 'productId':proid } }})
//         res.json({ "status": 200, "msg": 'data has been fetched', res: userList });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

exports.gt = async (req, res) => {
  try {
    const proid = req.params.id;
    const userList = await salesorder.find({ "products.productId": proid });
    res.json({ status: 200, msg: "data has been fetched", res: userList });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// update final by weight of product at dispatch using productid
exports.updatebyid = async (req, res) => {
  try {
    proid = req.params.id;
    newweight = req.body.weight;
    // const userList = await salesorder.findById({_id:products._id })
    const userList = await salesorder.updateMany(
      { products: { $elemMatch: { productId: proid } } },
      { $set: { "products.$.weight": newweight } }
    );
    // const userList = await salesorder.findById({'weighttt': {$in:products}});
    res.json({ status: 200, msg: "data has been fetched", res: userList });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// put one
exports.edit = async (req, res) => {
  try {
    const updatedUser = await salesorder.findById(req.params.id).exec();
    updatedUser.set(req.body);
    const updateSalesorder = await updatedUser.save();
    //res.json(updatedUser);
    res
      .status(201)
      .json({
        status: 200,
        msg: "record sucessfully updated",
        res: updatedUser,
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// delete
exports.delete = async (req, res) => {
  try {
    await salesorder.findById(req.params.id).deleteOne();
    res.json({ message: "User has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//pagination

exports.allRecords = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const amaid = parseInt(req.query.asid);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total_doc = await salesorder.countDocuments().exec();
  const result = {};
  if (endIndex < (await salesorder.countDocuments().exec())) {
    result.next = {
      page: page + 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  try {
    result.results = await salesorder
      .find()
      .sort({ deliveryDate: -1 })
      .limit(limit)
      .skip(startIndex);
    res.paginatedResult = result;
    res
      .status(201)
      .json({ status: 200, msg: "records get", output: res.paginatedResult });
    next();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

//GET Data By Sales Id and Order Status
exports.getRecords = async (req, res, next) => {
  const sale_id = req.query.sales_id;
  const orderstatus = req.query.orderstatus;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const amaid = parseInt(req.query.asid);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total_doc = await salesorder.countDocuments().exec();
  const result = {};
  if (endIndex < (await salesorder.countDocuments().exec())) {
    result.next = {
      page: page + 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  try {
    result.results = await salesorder
      .find({ $or: [{ sales_id: sale_id }, { orderstatus: orderstatus }] })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);
    res.paginatedResult = result;
    res
      .status(201)
      .json({ status: 200, msg: "records get", output: res.paginatedResult });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

//GET  ALL Records BY Production Incharge Id
exports.AllRecordbyPrid = async (req, res) => {
  const proid = req.body.pIn_id;
  console.log(proid);
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total_doc = await salesorder.countDocuments().exec();
  const result = {};
  if (endIndex < (await salesorder.countDocuments().exec())) {
    result.next = {
      page: page + 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }

  try {
    result.results = await salesorder
      .find({ products: { $elemMatch: { pIn_id: proid } } })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);

    res.paginatedResult = result;
    res
      .status(201)
      .json({ status: 200, msg: "records get", output: res.paginatedResult });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

/**************************************/
/**************************************/
//all records with date filter
exports.get = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total_doc = await salesorder.countDocuments().exec();
  const result = {};
  if (endIndex < (await salesorder.countDocuments().exec())) {
    result.next = {
      page: page + 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }

  try {
    const current_date = new Date(req.query.currentDate).toISOString();

    const last_date = new Date(req.query.currentDate);
    const endDate = new Date(last_date.setHours(23, 0, 0)).toISOString();

    var data = await salesorder
      .aggregate([
        {
          $match: {
            currentDate: {
              $gte: current_date,
              $lte: endDate,
            },
          },
        },
      ])
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);

    res.paginatedResult = data;
    //res.status(201).json({ "status": 200, "msg": 'records get', "output":res.paginatedResult });

    if (data == 0) {
      res
        .status(401)
        .json({ status: 401, msg: "No Such Record Fount", output: data });
    } else {
      res.status(201).json({ status: 200, msg: "records get", output: data });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

//Records by Sales_id  and Date filter
exports.getSalesIdAndDate = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total_doc = await salesorder.countDocuments().exec();
  const result = {};
  if (endIndex < (await salesorder.countDocuments().exec())) {
    result.next = {
      page: page + 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  try {
    const sale_id = req.query.sales_id;
    const orderstatus = req.query.orderstatus;

    const current_date = new Date(req.query.currentDate).toISOString();

    const last_date = new Date(req.query.currentDate);
    const endDate = new Date(last_date.setHours(23, 0, 0)).toISOString();

    const output = await salesorder
      .find({
        $and: [
          { sales_id: sale_id },
          {
            currentDate: {
              $gte: current_date,
              $lte: endDate,
            },
          },
        ],
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);
    if (output == 0) {
      res
        .status(401)
        .json({ status: 401, msg: "No Such Record Fount", output: output });
    } else {
      res.status(201).json({ status: 200, msg: "records get", output: output });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

//Records by orderstatus and Date filter
exports.getOrderstatusAndDate = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total_doc = await salesorder.countDocuments().exec();
  const result = {};
  if (endIndex < (await salesorder.countDocuments().exec())) {
    result.next = {
      page: page + 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  try {
    const orderstatus = req.query.orderstatus;
    const current_date = new Date(req.query.currentDate).toISOString();

    const last_date = new Date(req.query.currentDate);
    const endDate = new Date(last_date.setHours(23, 0, 0)).toISOString();

    const output = await salesorder
      .find({
        $and: [
          { orderstatus: orderstatus },
          {
            currentDate: {
              $gte: current_date,
              $lte: endDate,
            },
          },
        ],
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);

    if (output == 0) {
      res
        .status(401)
        .json({ status: 401, msg: "No Such Record Fount", output: output });
    } else {
      res.status(201).json({ status: 200, msg: "records get", output: output });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

//Records by Production Incharge and Date filter
exports.AllRecordbyid = async (req, res) => {
  const proid = req.body.pIn_id;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total_doc = await salesorder.countDocuments().exec();
  const result = {};
  if (endIndex < (await salesorder.countDocuments().exec())) {
    result.next = {
      page: page + 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  const current_date = new Date(req.body.currentDate).toISOString();
  const last_date = new Date(req.body.currentDate);
  const endDate = new Date(last_date.setHours(23, 0, 0)).toISOString();
  try {
    const productiondata = await salesorder
      .find({
        $and: [
          { products: { $elemMatch: { pIn_id: proid } } },
          {
            currentDate: {
              $gte: current_date,
              $lte: endDate,
            },
          },
        ],
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);

    if (productiondata == 0) {
      res
        .status(401)
        .json({
          status: 401,
          msg: "No Such Record Fount",
          output: productiondata,
        });
    } else {
      res
        .status(201)
        .json({ status: 200, msg: "records get", output: productiondata });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.recentweekorder = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total_doc = await salesorder.countDocuments().exec();
  const result = {};
  if (endIndex < (await salesorder.countDocuments().exec())) {
    result.next = {
      page: page + 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  const current_date = new Date();
  var today = moment(current_date).format("YYYY-MM-DD");
  console.log(today);
  var current_date1 = new Date();
  var firstDay = new Date(current_date1);
  var nextWeek = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);
  var week = moment(nextWeek).format("YYYY-MM-DD");
  console.log(week);

  try {
    const productiondata = await salesorder
      .find({
        deliveryDate: {
          $gte: today,
          $lte: week,
        },
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);
    console.log(productiondata);
    if (productiondata == 0) {
      res
        .status(401)
        .json({
          status: 401,
          msg: "No Such Record Found",
          output: productiondata,
        });
    } else {
      res
        .status(201)
        .json({ status: 200, msg: "records get", output: productiondata });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.orderwithDeliveryDate = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total_doc = await salesorder.countDocuments().exec();
  const result = {};
  if (endIndex < (await salesorder.countDocuments().exec())) {
    result.next = {
      page: page + 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }

  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
      total_doc: Math.round(total_doc / limit),
    };
  }
  const current_date = new Date();
  var today = moment(current_date).format("YYYY-MM-DD");
  console.log(today);
  var current_date1 = new Date();
  var firstDay = new Date(current_date1);
  var nextWeek = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);
  var week = moment(nextWeek).format("YYYY-MM-DD");
  console.log(week);

  try {
    const productiondata = await salesorder
      .find({
        deliveryDate: {
          $gte: "2021-10-10",
          $lte: week,
        },
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);
    console.log(productiondata);
    if (productiondata == 0) {
      res
        .status(401)
        .json({
          status: 401,
          msg: "No Such Record Found",
          output: productiondata,
        });
    } else {
      res
        .status(201)
        .json({ status: 200, msg: "records get", output: productiondata });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
