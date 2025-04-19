const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    
   username:
   {
     type:String,
     required:true,

   },
   password:
   {
     type:String,
     required:true
   }
  //  status:
  //  {
  //    type:String,
  //    default:false
  //  },
  //  role: { type: String, 
  //   enum: ['salesManager','productionHead', 'productManager','stockManager'],
  //   required:false
  //  }
});
const Adminlogin = mongoose.model('admins', adminSchema);
module.exports = Adminlogin;