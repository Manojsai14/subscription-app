require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Subscription = require('./models/Subscription');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// Renewal Alert Cron Job (runs every day at 9 AM)
cron.schedule('0 9 * * *', async () => {
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const upcomingRenewals = await Subscription.find({
    renewalDate: { $gte: today, $lte: sevenDaysFromNow }
  }).populate('userId');

  upcomingRenewals.forEach(sub => {
    console.log(`⚠️ Renewal Alert: ${sub.name} renews soon for user ${sub.userId.email}`);
    // Add nodemailer email sending here if needed
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));