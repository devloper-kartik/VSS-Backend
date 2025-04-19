const mongoose = require("mongoose");
const Schema = mongoose.Schema;
         
const billing_Schema = new Schema({
  
  orderId: String,
  company: String,
  contact: String,
  name: String,
  time: String,
  Date: Date,
  grade: String,
  length: Number,
  topColor: String,
  thickness: Number,
  temper: String,
  coating: String,
  grade: String,
  guardFilm: String,
  gst: Number,
  weight: Number,
  width: Number,
  gst: String,
  address: String,
  purchaseNumber: String,
  VehicleNumber: String,
  batch_number: String,
  clientName: String,
  firmName: String,
  address: String,
  city: String,
  phone_no: Number,
  products:String,  
});

const billing_ = mongoose.model("billing_Stock", billing_Schema);

module.exports = (billing_); 
