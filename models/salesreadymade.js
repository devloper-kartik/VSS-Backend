const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var currentDate = new Date();
var timestamp = currentDate.getTime();
const userSchema = new Schema({

productId:{
  type: String//,
//  required: true
  },
select_product:
{
  type: String
  //,required: true
},
  company: {
    type: String//,
    //required: true
  },
  grade:
  {
    type: String//,
    //required: true
  },
  topcolor:
  {
    type: String//,
    //required: true
  },
  coatingnum:
  {
    type: String//,
    //required: true
  },
  temper:
  {
    type: String//,
    //required: true
  },
  guardfilm:
  {
    type: String//,
    //required: true
  },
  thickness:
  {
    type: Number//,
    //required: true
  },
  width:
  {
    type: Number//,
    //required: true
  },
  length:
  {
    type: Number//,
    //required: true
  },
  pcs:
  {
    type: Number//,
    //required: true
  },
  weight:
  {
    type: Number//,
    //required: true
  },
  ready_production:
  {
    type: String
  },
  note:
  {
    type: String
  },
  productPictures_img:
  {
     type: String 
  } 
   
});
const salesreadymade = mongoose.model("salereadymadeproducts", userSchema);
module.exports = salesreadymade;