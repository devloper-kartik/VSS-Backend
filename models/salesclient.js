const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var currentDate = new Date();
var timestamp = currentDate.getTime();
const saleSchema = new Schema({
    
   clientName:
   {
     type:String,
     required:true
   },
   firmName:
   {
     type:String,
     required:true
   },
   address:
   {
     type:String,
     required:true
   },
   city:
   {
     type:String,
     required:true
   },
   phone_no:
   {
     type:Number,
     required:true
   }
   
   
});
const salesclient = mongoose.model("clients", saleSchema);
module.exports = salesclient;