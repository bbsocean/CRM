// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const { createServer } = require('http');
// const { Server } = require('socket.io'); // ✅ Importing Socket.IO

// require('dotenv').config();  // Load environment variables

// // Initialize Express app and server
// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:5173",  // ✅ Replace this with your frontend's URL if different
//     methods: ["GET", "POST"],
//   },
// });

// // Middleware
// app.use(express.json());  // For parsing JSON requests
// app.use(cors());  // Enable CORS for cross-origin requests

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ Connected to MongoDB'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));  // Authentication routes
// app.use('/api/sales', require('./routes/salesRoutes'));  // Sales and commission routes
// app.use('/api/payouts', require('./routes/payoutRoutes'));  // Payout management
// app.use('/api/reports', require('./routes/reportRoutes'));  // Reporting and analytics
// app.use('/api/admin', require('./routes/adminDashboardRoutes'));  // Admin dashboard
// app.use('/api/dashboard', require('./routes/dashboardRoutes'));  // Admin, agent, franchise dashboards
// app.use('/api/customer-vendor', require('./routes/customerBecomeVendorRoutes'));  // Customer Become Vendor routes

// // Sample Route for testing the server
// app.get('/', (req, res) => {
//   res.send('Commission Tracking App Backend Running');
// });

// // Health check route
// app.get('/test', (req, res) => {
//   res.send('✅ Server is working fine!');
// });

// // Payout status monitoring (Optional)
// app.get('/api/payouts/status', (req, res) => {
//   res.send('✅ Payout status monitoring route is active');
// });

// // Socket.IO setup for real-time updates
// io.on('connection', (socket) => {
//   console.log('🔥 New client connected: ', socket.id);

//   // Example: Listening for new sale events
//   socket.on('new-sale', (saleData) => {
//     console.log('📢 New sale event received:', saleData);
//     io.emit('update-dashboard', saleData);  // Broadcast to all connected clients
//   });

//   socket.on('disconnect', () => {
//     console.log('❌ Client disconnected:', socket.id);
//   });
// });

// // Improved Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('🚨 Internal Server Error:', err);
//   res.status(500).json({
//     message: 'Internal server error',
//     error: err.message,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined  // Show stack trace only in development mode
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//-----------------------------------------------------------------------------------------------------

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
//const rateLimit = require('express-rate-limit');  // ✅ Correctly imported
//const logger = require('./utils/logger');
const morgan = require('morgan');

require('dotenv').config();

const app = express();

// ✅ Security Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(helmet());
app.use(hpp());
//app.use(rateLimiter);  // Apply global rate-limiting
// app.use(morgan('combined', { 
//   stream: { write: message => logger.info(message.trim()) }
//  }));  // ✅ Morgan middleware for HTTP request logging

// Log server startup
//logger.info('🚀 Server is starting...');

// Import the cron job for cleaning expired tokens
require('./cronJobs/tokenCleanup');
require('./cronJobs/payoutProcessor');
require('./cronJobs/payoutScheduler');  // Import the payout scheduler


// ✅ CORS configuration (adjust the origin as necessary for production)
const corsOptions = {
  origin: ['http://localhost:3000'],  // Replace with your frontend production URL if necessary
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Global Rate Limiting for API Requests (100 requests per 15 minutes per IP)
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,  // 15 minutes
//   max: 100,  // Limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again after 15 minutes.'
// });
// app.use('/api/', apiLimiter);  // Apply to API routes

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Application Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/payouts', require('./routes/payoutRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminDashboardRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/customer-vendor', require('./routes/customerBecomeVendorRoutes'));
app.use('/api/franchisees', require('./routes/franchiseRoutes'));


app.use(express.json()); // Middleware for parsing JSON requests




// ✅ Sample Route for testing the server
app.get('/', (req, res) => {
  res.send('Commission Tracking App Backend Running');
});

// ✅ Health check route
app.get('/test', (req, res) => {
  res.send('✅ Server is working fine!');
});

// ✅ Improved Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Internal Server Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,  // Show stack trace in development only
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('🚨 Global Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
