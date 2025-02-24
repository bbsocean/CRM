import mongoose from "mongoose";

const CommissionSchema = new mongoose.Schema({
  agent: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Commission || mongoose.model("Commission", CommissionSchema);
