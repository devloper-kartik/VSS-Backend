var Production_incharge = require("../models/Stock_M");
const moment = require("moment");
const createMoment = moment();

// create the Stocks //
// exports.create = async (req, res) => {
//   const qwe = req.body;

//   try {
//     const existingStock = await Production_incharge.findOne({
//       $and: [
//         {
//           product: qwe.product,
//           company: qwe.company,
//           grade: qwe.grade,
//           topcolor: qwe.topcolor,
//           coating: qwe.coating,
//           temper: qwe.temper,
//           guardfilm: qwe.guardfilm,
//           thickness: qwe.thickness,
//           width: qwe.width,
//           length: qwe.length,
//           pcs: qwe.pcs,
//         },
//       ],
//     });

//     if (!existingStock) {
//       // Stock doesn't exist, create a new entry for the first batch
//       const newBatchNumber = generateBatchNumber();

//       const newStock = new Production_incharge({
//         ...qwe,
//         weight: qwe.weight,
//         batch_number: [newBatchNumber], // Include the new batch number
//         Date:createMoment.format("YYYY-MM-DD HH:mm:ss")
//       });
//       const savedStock = await newStock.save();

//       res.status(201).json({
//         status: 200,
//         msg: "Successfully created",
//         newStock: {
//           stockData: savedStock,
//           batches: [{ batchNumber: newBatchNumber, originalWeight: qwe.weight, stockData: savedStock }],
//         },
//       });
//     } else {
//       // Stock already exists
//       console.log("Stock Already Existed");
//       const newBatchNumber = generateBatchNumber();

//       existingStock.batch_number.push(newBatchNumber); // Add the new batch number to existing batch numbers

//       // Create a new instance for the new batch
//       const newStockBatch = new Production_incharge({
//         ...qwe,
//         weight: qwe.weight,
//         batch_number: [newBatchNumber], // Include the new batch number
//       });

//       const savedStockBatch = await newStockBatch.save();

//       // Update the weight of the existing stock
//       existingStock.weight += qwe.weight;

//       res.status(201).json({
//         status: 200,
//         msg: "Stock updated with new batch_number",
//         existingStock: {
//           stockData: existingStock,
//           batches: existingStock.batch_number.map((batch) => ({
//             batchNumber: batch.batchNumber,
//             originalWeight: batch.weight,
//             stockData: { ...existingStock.toObject(), weight: batch.weight },
//           })),
//         },
//         newStock: {
//           stockData: savedStockBatch,
//           batches: [{ batchNumber: newBatchNumber, originalWeight: qwe.weight, stockData: savedStockBatch }],
//         },
//       });
//     }
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// function generateBatchNumber() {
//   const uniqueIdentifier = Date.now();
//   return `batch-${uniqueIdentifier}`;
// }

// Function to generate a unique batch number
function generateBatchNumber() {
  const uniqueIdentifier = Date.now();
  return `batch-${uniqueIdentifier}`;
}

exports.create = async (req, res) => {
  const qwe = req.body;

  try {
    // Check if the stock already exists
    const existingStock = await Production_incharge.findOne({
      product: qwe.product,
      company: qwe.company,
      grade: qwe.grade,
      topcolor: qwe.topcolor,
      coating: qwe.coating,
      temper: qwe.temper,
      guardfilm: qwe.guardfilm,
      thickness: qwe.thickness,
      width: qwe.width,
    });

    if (!existingStock) {
      // Stock doesn't exist, create a new entry
      const newBatchNumber = generateBatchNumber();
      const newBatch = {
        batchNumber: newBatchNumber,
        weight: qwe.weight,
      };

      const newStock = new Production_incharge({
        ...qwe,
        weight: qwe.weight, // Total weight
        batch_number: [newBatchNumber],
        batch_details: [newBatch], // Track batch details
        Date: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      const savedStock = await newStock.save();

      res.status(201).json({
        status: 200,
        msg: "Successfully created",
        newStock: savedStock,
      });
    } else {
      // Stock already exists, update the existing record
      const newBatchNumber = generateBatchNumber();
      const newBatch = {
        batchNumber: newBatchNumber,
        weight: qwe.weight,
      };

      existingStock.batch_number.push(newBatchNumber); // Optional: Maintain batch numbers separately
      existingStock.batch_details.push(newBatch); // Add the new batch details
      existingStock.weight += qwe.weight; // Update total weight
      existingStock.length += qwe.length; // Update total length

      await existingStock.save();

      res.status(200).json({
        status: 200,
        msg: "Stock updated with new batch_number",
        updatedStock: {
          stockData: existingStock,
          // batches: existingStock.batch_details, // Include batch-specific weights
        },
      });
    }
  } catch (err) {
    // Handle errors
    res.status(400).json({ message: err.message });
  }
};

// router.get("/allStocks", async (req, res) => {
//   try {
//     const allStocks = await Production_incharge.find({
//       batch_number: { $exists: true, $ne: [] },
//     });

//     res.status(200).json({
//       status: 200,
//       msg: "Successfully retrieved all stocks",
//       allStocks: allStocks,
//     });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// function generateBatchNumber() {
//   const uniqueIdentifier = Date.now();
//   return `batch-${uniqueIdentifier}`;
// }

//---------------------------------------------------------//

exports.batch_list = async (req, res) => {
  try {
    let thikness_sel = req.body.thickness_selected;
    let width_sel = req.body.width_selected;
    let color_sel = req.body.color_selected;

    const List = await Production_incharge.find({
      $and: [
        { width: { $eq: width_sel } },
        { thickness: { $eq: thikness_sel } },
        { topcolor: { $eq: color_sel } },
      ],
    });

    res.json({ status: 200, msg: "data has been fetched", "list-data": List });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.batch_get_all = async (req, res) => {
  try {
    let all = mongo.ObjectId(req.params.batch_number);
    const List = await Production_incharge.find(
      { all },
      { _id: 1, weight: 1, used: 1, remaning: 1 }
    );

    res.json({ status: 200, msg: "data has been fetched", "list-data": List });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.batch_getbyweight = async (req, res) => {
  try {
    let thikness_sel = req.body.thickness_selected;
    let width_sel = req.body.width_selected;
    let color_sel = req.body.color_selected;
    let company_sel = req.body.company_selected;

    const List = await Production_incharge.find({
      $and: [
        { width: { $eq: width_sel } },
        { thickness: { $eq: thikness_sel } },
        { topcolor: { $eq: color_sel } },
      ],
    }).sort({ weight: 1 });

    res.json({ status: 200, msg: "data has been fetched", "list-data": List });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.batch_sort_by_weight_all_batch = async (req, res) => {
  try {
    const List = await Production_incharge.find({}).sort({ weight: 1 });

    res.json({ status: 200, msg: "data has been fetched", "list-data": List });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.edit = async (req, res) => {
  try {
    const Id = req.params.id; // Be consistent with the parameter
    console.log("Id is", Id);
    const user_data = await Production_incharge.findOne({ _id: Id });

    if (!user_data) {
      return res.status(404).json({ message: "Stock id is not found" });
    }

    // If record is found, proceed with updating
    user_data.set(req.body);
    const updatedUser = await user_data.save();

    return res.status(200).json({
      status: 200,
      msg: "Record successfully updated",
      res: updatedUser,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// DElete by ID
exports.delete = async (req, res) => {
  try {
    const user_data = await Production_incharge.findById(req.params.id);
    if (user_data) {
      await Production_incharge.findById(req.params.id).deleteOne();
      res.json({ status: "200", message: "User has been deleted " });
    } else {
      res.json({ status: "400", message: "No Record found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//pagination----->get------------>all----->with--------->pagination

//-------add colum and count all weight+pcs
exports.Manoj = async (req, res, next) => {
  const userList = await Production_incharge.aggregate([
    { $match: { product: "GP ROLL", coating: 120, company: "Manoj" } },
    {
      $group: {
        _id: {
          product: "$product",
          Company: "$company",
          Grade: "$grade",
          Grade: "$grade",
          Topcolor: "$topcolor",
          coating: "$coating",
          Temper: "$temper",
          Guardfilm: "$guardfilm",
          Thickness: "$thickness",
          Width: "$width",
          Batch: "$batch",
          Length: "$length",
        },
        weight: { $sum: "$weight" },
        pcs: { $sum: "$pcs" },
      },
    },
  ]);
  res.json({ status: 200, msg: "Data Wrong Hai", res: userList });
};

//pagination

exports.allRecords = async (req, res, next) => {
  const page = parseInt(req.query.page);

  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;

  const total_pages = await Production_incharge.countDocuments().exec();

  const result = {};

  if (endIndex < (await Production_incharge.countDocuments().exec())) {
    result.next = {
      page: page + 1,

      limit: limit,

      total_pages: Math.round(total_pages / limit),
    };
  }

  if (startIndex > 0) {
    result.previous = {
      page: page - 1,

      limit: limit,

      total_pages: Math.round(total_pages / limit),
    };
  }
  try {
    result.results = await Production_incharge.find()
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
//--------------------> get  by ID

exports.getbyid = async (req, res) => {
  var StockList = await Production_incharge.findById(req.params.id);
  if (StockList) {
    res.json({ status: 200, msg: "data has been fetched", res: StockList });
  } else {
    res.json({ status: "400", message: "No Record found" });
  }
};

exports.allRecords = async (req, res) => {
  // Rest of the code will go here
  try {
    const resPerPage = 10; // results per page
    const page = req.params.page || 1; // Page
    //const userList = await readymadeProducts.find().skip((resPerPage * page) - resPerPage).limit(resPerPage);  ////
    const userList = await Production_incharge.find().sort({ _id: -1 });
    res.json({ status: 200, msg: "data has been fetched", res: userList });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//-----------------------**------------------**----------------------**----------------
exports.filter_in_stock = async (req, res) => {
  try {
    let thikness_sel = req.body.thickness_selected;
    let width_sel = req.body.width_selected;
    let color_sel = req.body.color_selected;
    let product_sel = req.body.product_selected;
    let company_sel = req.body.company_selected;
    let length_sel = req.body.length_selected;
    let grade_sel = req.body.grade_selected;
    let coating_sel = req.body.coating_selected;
    let temper_sel = req.body.temper_selected;
    let guardfilm_sel = req.body.guardfilm_selected;
    let batch_number_sel = req.body.batch_number_selected;
    let topcolor_sel = req.body.color_selected;

    let dataArray = [];

    if (thikness_sel) {
      dataArray.push({ thickness: { $eq: thikness_sel } });
    }
    if (width_sel) {
      dataArray.push({ width: { $eq: width_sel } });
    }
    if (color_sel) {
      dataArray.push({ width: { $eq: color_sel } });
    }
    if (product_sel) {
      dataArray.push({ width: { $eq: product_sel } });
    }
    if (company_sel) {
      dataArray.push({ width: { $eq: company_sel } });
    }
    if (length_sel) {
      dataArray.push({ width: { $eq: length_sel } });
    }
    if (grade_sel) {
      dataArray.push({ width: { $eq: grade_sel } });
    }
    if (topcolor_sel) {
      dataArray.push({ width: { $eq: topcolor_sel } });
    }
    if (coating_sel) {
      dataArray.push({ width: { $eq: coating_sel } });
    }
    if (temper_sel) {
      dataArray.push({ width: { $eq: temper_sel } });
    }
    if (guardfilm_sel) {
      dataArray.push({ width: { $eq: guardfilm_sel } });
    }
    if (batch_number_sel) {
      dataArray.push({ width: { $eq: batch_number_sel } });
    }

    // console.log('dataArray >>>', dataArray);

    const List = await Production_incharge.find({
      $or: [
        { thickness: { $eq: thikness_sel } },
        { width: { $eq: width_sel } },
        { product: { $eq: product_sel } },
        { company: { $eq: company_sel } },
        { length: { $eq: length_sel } },
        { grade: { $eq: grade_sel } },
        { topcolor: { $eq: topcolor_sel } },
        { coating: { $eq: coating_sel } },
        { temper: { $eq: temper_sel } },
        { guardfilm: { $eq: guardfilm_sel } },
        { batch_number: { $eq: batch_number_sel } },
        { topcolor: { $eq: color_sel } },

        {
          $and: [{ dataArray }],
        },
      ],
    });

    res.json({ status: 200, msg: "data has been fetched", "list-data": List });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
