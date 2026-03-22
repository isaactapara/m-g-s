const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['M-Pesa', 'Cash'],
    required: true
  },
  status: {
    type: String,
    enum: ['PAID', 'PENDING', 'FAILED', 'CANCELLED', 'PARTIAL_PAYMENT_FLAGGED'],
    default: 'PENDING'
  },
  mpesaReceiptNumber: String,
  paymentPhone: String,
  failureReason: String,
  amountPaid: Number,
  mpesaTransactionDate: Date,
  cashier: {
    type: String, // Storing name directly for quick access, or ObjectId if preferred
    required: true
  },
  cashierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  checkoutRequestId: {
    type: String,
    index: true // Optimized for Webhook lookups
  }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
