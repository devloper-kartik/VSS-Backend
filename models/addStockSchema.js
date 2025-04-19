const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addStockSchema = new Schema({
    item:
   {
     type:String,
     required:true
   },
   company:
   {
     type:String,
     required:true
   },
   topColor:
   {
       type:String,
       required:true
   },
   thickness:
   {
       type:Number,
       required:true
   },
   width:
   {
       type:Number,
       required:true
   },
   length:
   {
       type:Number,
       required:true
   },
   temper:
   {
       type:String,
       required:true
   },
   coating:
   {
       type:Number,
       required:true
   },
   grade:
   {
       type:String,
       required:true
   },
   guardFilm:
   {
       type:Number,
       required:true
   },
   batchNumber:
   {
       type:Number,
       required: true
   },
   purchaseNumber:
   {
       type:Number,
       required:true
   },
   Weight:{
    type:Number,
    required:true
   },
   Date:{
    type:String
   }
},
{ timestamps: true }
);

const StockList = mongoose.model("AddStock", addStockSchema);
module.exports = StockList;