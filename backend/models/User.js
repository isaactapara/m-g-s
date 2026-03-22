const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  pin: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'cashier'],
    default: 'cashier'
  }
}, { timestamps: true });

// Hash PIN before saving
userSchema.pre('save', async function() {
  if (!this.isModified('pin')) return;
  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
});

// Compare PIN
userSchema.methods.comparePIN = async function(candidatePIN) {
  return await bcrypt.compare(candidatePIN, this.pin);
};

module.exports = mongoose.model('User', userSchema);
