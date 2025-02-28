// backend/models/Agent.js

const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  territoryHead: { type: mongoose.Schema.Types.ObjectId, ref: 'TerritoryHead' },
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  region: { type: String, required: true },
  vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
  earnings: { type: Number, default: 0 },
});

module.exports = mongoose.model('Agent', agentSchema);
