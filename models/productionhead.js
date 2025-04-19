// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
// var currentDate = new Date();
// var timestamp = currentDate.getTime();
// const productionHead = new Schema({
//   _cId:{
//     type:ObjectId,ref:'clients',
//     required:true
//   },
//   oId:{
//     type:ObjectId,ref:'saleorders',
//     required:true
//   },
//   productionincharge:
//     {
//       type:String,
//       required:true
//     },
//     deliveryDate:
//    {
//      type:String,
//      required:true
//    },
//     completionDate:
//    {
//      type:String,
//      required:true
//    }
// });
// const Production_head = mongoose.model("productionhead", productionHead);
// module.exports = Production_head;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productionHeadSchema = new Schema({
  _cId: {
    type: Schema.Types.ObjectId,
    ref: "clients",
    required: true,
  },
  oId: {
    type: Schema.Types.ObjectId,
    ref: "saleorders",
    required: true,
  },
  productionincharge: {
    type: String,
    required: true,
  },
  deliveryDate: {
    type: String,
    required: true,
  },

  completionDate: {
    type: String,
    required: true,
  },
});

const Production_head = mongoose.model("productionhead", productionHeadSchema);

module.exports = Production_head;
