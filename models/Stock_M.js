const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productionSchema = new Schema(
  {
    product: String,
    company: String,
    grade: String,
    topcolor: String,
    coating: Number,
    temper: String,
    guardfilm: String,
    thickness: Number,
    width: Number,
    length: Number,
    pcs: Number,
    weight: Number,
    approx_weight: Number,
    batch_number: [String],
    batch_details: [
      {
        batchNumber: String,
        weight: Number,
      },
    ],
    ready_production: String,
    vehical_no: String,
    vendor: String,
    production_incharge_name: String,
    assign_date: String,
    thickness_selected: String,
    width_selected: String,
    color_selected: String,
    company_name_selected: String,
    completion_date: String,
    batch_assign: String,
    note: String,
    density: String,
    approx_length_in_batch: Number,
    approx_weight_per_mm: Number,
    pcs_cut: Number,
    length_per_pcs_cut: Number,
    approx_weight_cut: "mixed",
    total_length_cut: "mixed",
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);
const Production_incharge = mongoose.model(
  "productionschema",
  productionSchema
);

module.exports = Production_incharge;
