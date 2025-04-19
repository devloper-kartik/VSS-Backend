const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const ObjectId = Schema.ObjectId;
//model = mongoose.model.bind(mongoose),
// ObjectId = Mongoose.Schema.Types.ObjectId;

const purchaseStockSchema = new Schema({

    //checked
    orderdate: String,
    vendor: {
        type: String
    },
    email: {
        type: String,

    },
    deliveryDate: {
        type: String,

    },
    rate_TN: {
        type: Number,

    },
    quantity: {
        type: Number
    },
    purchaseNumber: {
        type: String
    },
    sales_id: {
        type: String
    },
    sales_name: {
        type: String
    },
    orderStatus: {
        type: Number
    },
    purchaseId: String,
    arrivedate: String,
    clientName: String,
    firmName: String,
    address: String,
    city: String,
    phone_no: Number,
    note: String,
    products: [{
        product: Number,
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
        gst: Number,
    }]

});

const purchaseList = Mongoose.model("purchaseStock", purchaseStockSchema);


module.exports = purchaseList;