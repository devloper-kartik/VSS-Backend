const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderNoticeSchema = new Schema({
  company: String,
  remark: String,
});

const StockList = mongoose.model("OrderNotice", OrderNoticeSchema);
module.exports = StockList;
