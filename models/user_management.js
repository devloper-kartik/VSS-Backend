const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var currentDate = new Date();
var timestamp = currentDate.getTime();
const userSchema = new Schema({
  firstName: 
   {
     type : String, 
     required : true  
   } ,
   lastName: 
   {
     type : String, 
     required : true  
   },
   phone_no:
   {
     type :Number,
     required : true,
     unique:true,
    maxlength: 10
   },
   role:
   {
     type : String,
     required : true
   },
   email:
   {
     type : String
   },
   address:
   {
     type : String
   },
   city:
   {
     type : String
   },
   pincode : {
     type : Number
   },
   joined_date:
   {
     type : String
   },
   shift_time:
   {
     type : String
   },
   tenure:
   {
     type : String
   },
   user_id:
   {
    type : String
   },
   password:
   {
     type : String,
     required : true
   },
   user_image:
   {
    type : String
   }

});
const User_management = mongoose.model("users", userSchema);
module.exports = User_management;