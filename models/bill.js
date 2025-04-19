const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// var currentDate = new Date();
// var timestamp = currentDate.getTime();

const BillSchema = new Schema({
  clientName: String,
  firmName: String,
  address: String,
  city: String,
  phone_no: Number,

  orderId: String,
  deliveryDate: String,
  currentDate: String,
  note: String,
  orderstatus: Number,
  products: [
    {
      productId: String,
      select_product: String,
      company: String,
      grade: String,
      topcolor: String,
      coatingnum: Number,
      temper: String,
      guardfilm: String,
      thickness: Number,
      width: Number,
      length: Number,
      pcs: Number,
      weight: Number,
      rate: Number,
      gst: Number, //if order with gst store 1 and without gst store 2
    },
  ],

  process_bar: String,
  productionincharge: String,
  assignDate: String,
  completionDate: String,
  phNote: String,

  //------- dispatch manager

  smName: String,
  vehicleNum: String,
  dpDate: String,
  dpRecieved: String,
  dpPhone: Number,
  dpweight_itm1: Number,
  dpweight_itm2: Number,
  dpweight_itm3: Number,
  dpweight_itm4: Number,
  dpweight_itm5: Number,
  dpweight_itm6: Number,
  dpweight_itm7: Number,
  dpTotalWeight: Number,
});

const bill = mongoose.model("BillingSchema", BillSchema);
module.exports = bill;
