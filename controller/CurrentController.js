const SalesModel = require("../models/sales");
const Mongoose = require("mongoose");

// ##########get alll######################################

exports.getAll = (req, res) => {
  SalesModel.find({}, function (err, result) {
    res.send(result);
  });
};

// ##################get pending order#############################

exports.getPendingSales = async (req, res) => {
  // status = 1......red pending.....................................

  const pendingOrder = await SalesModel.find({ orderstatus: "1" });

  // status = 2 ..........orange  delivered .................................

  const deliveredOrder = await SalesModel.find({ orderstatus: "2" });

  // status = 3 ............. green progressIn.......................................

  const progressInOrder = await SalesModel.findOne({ orderstatus: "3" });

  res.json({
    status: 200,
    msg: "All Order Status",
    pendingOrder: pendingOrder,
    deliveredOrder,
    progressInOrder,
  });
};
