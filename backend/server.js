const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { reconcilePendingTransactions } = require('./controllers/paymentController');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Database Connection Check Middleware
app.use((req, res, next) => {
  // Allow health check and M-Pesa callbacks to bypass DB check (so we can log them)
  if (req.originalUrl.includes('/health') || req.path.startsWith('/api/payments/callback')) {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database is currently offline. Please ensure MongoDB is running.',
      error: 'ECONNREFUSED'
    });
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Test & Health Route
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => {
  res.json({ message: 'M&G Restaurant Hub API is Live' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack || err.message || err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  if (process.env.NODE_ENV === 'development') {
    try {
      const localtunnel = require('localtunnel');
      const tunnel = await localtunnel({ port: PORT });
      console.log(`🌍 M-Pesa Webhook Tunnel Active: ${tunnel.url}`);
      process.env.MPESA_CALLBACK_URL = `${tunnel.url}/api/payments/callback`;
      console.log(`🔗 Webhook Callback URL: ${process.env.MPESA_CALLBACK_URL}`);
      
      tunnel.on('close', () => console.log('Tunnel closed'));
    } catch (err) {
      console.error('Localtunnel failed:', err.message);
    }
  }

  // Reconciliation scheduler to keep pending M-Pesa orders in sync
  setInterval(async () => {
    try {
      const reconciled = await reconcilePendingTransactions();
      if (reconciled > 0) {
        console.log(`🔁 Reconciliation job processed ${reconciled} pending bill(s)`);
      }
    } catch (err) {
      console.error('Reconciliation scheduler error:', err.message);
    }
  }, 3 * 60 * 1000); // every 3 minutes
});
