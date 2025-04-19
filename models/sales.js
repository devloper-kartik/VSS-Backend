const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var currentDate = new Date();
var timestamp = currentDate.getTime();
const saleSchema = new Schema(
  {
    // clientId:{
    //   type: String,
    //   required: true
    // },
    // --------client data---------
    // editstatus:{
    //   type: Boolean,
    //   default: true

    // },
    clientName: {
      type: String, //,
      //required: true
    },
    firmName: {
      type: String, //,
      //required: true
    },
    address: {
      type: String, //,
      //required: true
    },
    city: {
      type: String, //,
      //required: true
    },
    phone_no: {
      type: Number,
      maxlength: 10,
    },

    //--------- order create-----------
    // sales_id:{
    //   type: Number | String | mongoose.Schema.Types.ObjectId //,
    //   //required: true
    // },
    sales_id: {
      type: mongoose.Schema.Types.Mixed,
    },

    sales_name: {
      type: String, //,required: true
    },

    orderId: {
      type: Number,
      required: true,
    },
    deliveryDate: {
      type: String, //,
      //required: true
    },
    currentDate: {
      type: String, //,
      // required:true
    },
    note: {
      type: String,
    },

    orderstatus: {
      type: String, // Use an array if you want to allow both String and Number
      default: "pending",
    },

    Order_mark: {
      type: String,
      default: "pending",
    },

    products: [
      {
        isOrderReady: {
          type: Boolean,
        },
        productId: {
          // type: String//,
          type: mongoose.Schema.Types.ObjectId,
          ref: "productionschema",
          //      required: true
        },

        select_product: {
          type: String, //,
          //    required: true
        },
        company: {
          type: String, //,
              //  required: true
        },
        grade: {
          type: String, //,
          //      required: true
        },
        topcolor: {
          type: String, //,
          //      required: true
        },
        coating: {
          type: Number, //,
          //      required: true
        },
        temper: {
          type: String, //,
          //     required: true
        },
        guardfilm: {
          type: String, //,
          //      required: true
        },
        thickness: {
          type: Number, //,
          //      required: true
        },
        width: {
          type: Number, //,
          //      required: true
        },
        length: {
          type: Number, //,
          //      required: true
        },
        pcs: {
          type: Number, //,
          //     required: true
        },
        weight: {
          type: Number, //,
          //      required: true
        },
        rate: {
          type: Number, //,
          //      required: true
        },
        gst: {
          type: Number, //,
          //      required: true // if order with gst store 1 and without gst store 2
        },
        //    production_in:[
        //   {
        pIn_id: {
          type: String, //,
          //  required: true
        },
        productionincharge: {
          type: String, //,
          //    required: true
        },
        assignDate: {
          type: String, //,
          //    required: true
        },
        completionDate: {
          type: String, //,
          //    required: true
        },
        phNote: {
          type: String,
        },
        //  }],
        batch_list: [
          {
            batch_id: {
              type: String, //,
              //  required: true
            },
            batch_no: {
              type: String, //,
              //  required: true
            },
          },
        ],

        Batch_Number: [
          {
            type: String,
          },
        ],
      },
    ],

    //-------- production head data-----------
    ph_id: {
      type: String,
    },
    ph_name: {
      type: String,
    },
    process_bar: {
      type: String, //,
      //  required: true
    },

    //------- dispatch manager
    smName: {
      type: String, //
      //  required:true
    },

    // dp_id:{

    // },

    db_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mobile",
      },
    ],

    dispatchManager: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mobile",
      },
    ],

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    vehicleNum: {
      type: String, //,
      //    required:true
    },

    dpDate: {
      type: String, //,
      //    required:true
    },

    dpRecieved: {
      type: String,
      default: "Not-Received",
      //    required: true
    },

    dpPhone: {
      type: Number, //,
      // required:true
    },

    dpTotalWeight: {
      type: Number, //,
      //required:true
    },

    // productionincharge:
    // {
    //   type:mongoose.Schema.Types.ObjectId,
    //   ref:'mobile'
    // }
    productionincharge: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mobile",
      },
    ],

    pdf_order: {
      type: {
        type: String,
        default: "application/pdf",
      },
      data: Buffer,
    },

    pdf_url: {
      type: String,
    },
    Email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const sales = mongoose.model("saleorders", saleSchema);
module.exports = sales;
