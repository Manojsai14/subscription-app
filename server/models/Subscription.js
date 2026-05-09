const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  monthlyCost: { type: Number, required: true },
  category: {
    type: String,
    enum: ['OTT', 'Music', 'Software', 'Gaming', 'Other'],
    default: 'Other'
  },
  lastUsedDate: { type: Date, required: true },
  renewalDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);