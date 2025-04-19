const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mobileSchema = new Schema({
  UserName: {
    type: String,
    required: true,
  },

  Password: {
    type: String,
    required: true,
  },

  Status: {
    type: Boolean,
    default: true,
  },

  Phone: {
    type: Number,
    required: false,
  },

  LastName: {
    type: String,
    required: false,
  },

  ProfileImage: {
    type: String,
  },

  CurrentDate: {
    type: Date,
  },

  Tenure: {
    type: Schema.Types.Mixed,
  },

  Role: {
    type: String,
    enum: [
      "salesManager",
      "ProductionHead",
      "ProductionIncharge",
      "Dispatchmanager",
      "Billing in-charge",
      "StockManager",
    ],
    required: true,
  },
});

const Mobilelogin = mongoose.model("mobile", mobileSchema);
module.exports = Mobilelogin;
