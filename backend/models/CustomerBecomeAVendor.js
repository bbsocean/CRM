const mongoose = require("mongoose");

const CustomerBecomeAVendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  category: { type: String, required: true },
  products: [{ name: String, price: Number, description: String }],
  earnings: { type: Number, default: 0 },
});

module.exports = mongoose.model("CustomerBecomeAVendor", CustomerBecomeAVendorSchema);
