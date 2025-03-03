const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Franchise', 'Agent', 'Vendor', 'CustomerVendor'], default: 'Agent' },
  createdAt: { type: Date, default: Date.now },
  refreshToken: { type: String },  // Store refresh token securely
}, { timestamps: true });



// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords for login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
 
module.exports = mongoose.model('User', userSchema);
