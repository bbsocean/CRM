// backend/models/TerritoryHead.js

const mongoose = require('mongoose');

const territoryHeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  region: { type: String, required: true },
  agents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }],
  vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
  earnings: { type: Number, default: 0 },
});

module.exports = mongoose.model('TerritoryHead', territoryHeadSchema);
