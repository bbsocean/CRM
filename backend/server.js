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
const reportRoutes = require('./routes/reportRoutes');
//const rateLimit = require('express-rate-limit');  // ✅ Correctly imported
//const logger = require('./utils/logger');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler'); // Import the middleware
const aiInsightsRoutes = require("./routes/aiInsightsRoutes");
const gamificationRoutes = require("./routes/gamificationRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const payoutRoutes = require("./routes/payoutRoutes");
const userRoutes = require("./routes/userRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const selfServiceRoutes = require("./routes/selfServiceRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const franchiseRoutes = require("./routes/franchiseRoutes");
const territoryHeadRoutes = require("./routes/territoryHeadRoutes");
const agentRoutes = require("./routes/agentRoutes");
const customerBecomeAVendorRoutes = require("./routes/customerBecomeAVendorRoutes");
const referralRoutes = require("./routes/referralRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const commissionRoutes = require("./routes/commissionRoutes");
const hierarchyRoutes = require("./routes/hierarchyRoutes");
const commissionTrendRoutes = require("./routes/commissionTrendRoutes");
const salesForecastRoutes = require("./routes/salesForecastRoutes");
const commissionPayoutRoutes = require("./routes/commissionPayoutRoutes");
const userAnalyticsRoutes = require("./routes/userAnalyticsRoutes");
const salesLeaderboardRoutes = require("./routes/salesLeaderboardRoutes");
const revenueBreakdownRoutes = require("./routes/revenueBreakdownRoutes");
const bonusRewardsRoutes = require("./routes/bonusRewardsRoutes");
const commissionReportsRoutes = require("./routes/commissionReportsRoutes");
const commissionSettingsRoutes = require("./routes/commissionSettingsRoutes");
const auditLogsRoutes = require("./routes/auditLogsRoutes");
const supportTicketsRoutes = require("./routes/supportTicketsRoutes");
const userFeedbackRoutes = require("./routes/userFeedbackRoutes");
const performanceAnalyticsRoutes = require("./routes/performanceAnalyticsRoutes");
const revenueTrackingRoutes = require("./routes/revenueTrackingRoutes");
const incentiveProgramsRoutes = require("./routes/incentiveProgramsRoutes");
const referralBonusesRoutes = require("./routes/referralBonusesRoutes");
const multiCurrencyRoutes = require("./routes/multiCurrencyRoutes");
const hierarchyManagementRoutes = require("./routes/hierarchyManagementRoutes");
const userRolesPermissionsRoutes = require("./routes/userRolesPermissionsRoutes");
const franchiseSelfServiceRoutes = require("./routes/franchiseSelfServiceRoutes");
const territoryHeadSelfServiceRoutes = require("./routes/territoryHeadSelfServiceRoutes");
const agentSelfServiceRoutes = require("./routes/agentSelfServiceRoutes");
const vendorSelfServiceRoutes = require("./routes/vendorSelfServiceRoutes");
const customerBecomeVendorSelfServiceRoutes = require("./routes/customerBecomeVendorSelfServiceRoutes");
const referralSelfServiceRoutes = require("./routes/referralSelfServiceRoutes");
const auditLogger = require("./middlewares/auditLogger");
const vendorPerformanceRoutes = require("./routes/vendorPerformanceRoutes");
const predictiveMarketingRoutes = require("./routes/predictiveMarketingRoutes");
const fraudDetectionRoutes = require("./routes/fraudDetectionRoutes");
const crmSupportRoutes = require("./routes/crmSupportRoutes");
const videoCallRoutes = require("./routes/videoCallRoutes");
const autoReplyRoutes = require("./routes/autoReplyRoutes");
const commissionTrackingRoutes = require("./routes/commissionTrackingRoutes");
const transactionHistoryRoutes = require("./routes/transactionHistoryRoutes");
const payoutManagementRoutes = require("./routes/payoutManagementRoutes");
const dashboardCRMRoutes = require("./routes/dashboardCRMRoutes");
const userManagementRoutes = require("./routes/userManagementRoutes");
const escrowPaymentsRoutes = require("./routes/escrowPaymentsRoutes");
const commissionCalculatorRoutes = require("./routes/commissionCalculatorRoutes");
const aiRevenueForecastingRoutes = require("./routes/aiRevenueForecastingRoutes");
const automatedLeadGenerationRoutes = require("./routes/automatedLeadGenerationRoutes");
const aiCustomerRetentionRoutes = require("./routes/aiCustomerRetentionRoutes");
const aiTransactionFraudDetectionRoutes = require("./routes/aiTransactionFraudDetectionRoutes");
const automatedCustomerSupportAIRoutes = require("./routes/automatedCustomerSupportAIRoutes");
const aiRevenueBreakdownRoutes = require("./routes/aiRevenueBreakdownRoutes");
const aiAutomatedExpenseTrackingRoutes = require("./routes/aiAutomatedExpenseTrackingRoutes");
const aiInvoiceAutomationRoutes = require("./routes/aiInvoiceAutomationRoutes");
const aiDisputeResolutionRoutes = require("./routes/aiDisputeResolutionRoutes");
const aiSalesForecastingRoutes = require("./routes/aiSalesForecastingRoutes");
const aiLeadScoringRoutes = require("./routes/aiLeadScoringRoutes");
const aiRevenuePredictionsRoutes = require("./routes/aiRevenuePredictionsRoutes");
const aiProductRecommendationsRoutes = require("./routes/aiProductRecommendationsRoutes");
const aiVoiceVideoSupportRoutes = require("./routes/aiVoiceVideoSupportRoutes");
const aiSecurityAuditLogsRoutes = require("./routes/aiSecurityAuditLogsRoutes");
const aiBugDetectionRoutes = require("./routes/aiBugDetectionRoutes");
const aiPerformanceOptimizationRoutes = require("./routes/aiPerformanceOptimizationRoutes");
const aiScalabilityEnhancementsRoutes = require("./routes/aiScalabilityEnhancementsRoutes");
const aiTrafficLoadBalancingRoutes = require("./routes/aiTrafficLoadBalancingRoutes");
const aiAutoScalingManagementRoutes = require("./routes/aiAutoScalingManagementRoutes");
const aiAutoHealingSystemRoutes = require("./routes/aiAutoHealingSystemRoutes");
const aiAutoResourceAllocationRoutes = require("./routes/aiAutoResourceAllocationRoutes");
const aiCloudCostOptimizationRoutes = require("./routes/aiCloudCostOptimizationRoutes");
const aiDowntimePreventionRoutes = require("./routes/aiDowntimePreventionRoutes");
const aiAutoScalingSecurityRoutes = require("./routes/aiAutoScalingSecurityRoutes");
const aiThreatDetectionRoutes = require("./routes/aiThreatDetectionRoutes");
const aiAnomalyDetectionRoutes = require("./routes/aiAnomalyDetectionRoutes");
const aiFraudDetectionRoutes = require("./routes/aiFraudDetectionRoutes");
const aiSuspiciousActivityMonitorRoutes = require("./routes/aiSuspiciousActivityMonitorRoutes");
const aiSystemHealthMonitorRoutes = require("./routes/aiSystemHealthMonitorRoutes");
const aiPerformanceOptimizerRoutes = require("./routes/aiPerformanceOptimizerRoutes");
const aiAutoScalingRoutes = require("./routes/aiAutoScalingRoutes");
const aiResourceAllocatorRoutes = require("./routes/aiResourceAllocatorRoutes");
const aiLoadBalancerRoutes = require("./routes/aiLoadBalancerRoutes");
const aiDatabaseOptimizerRoutes = require("./routes/aiDatabaseOptimizerRoutes");
const aiSecurityMonitorRoutes = require("./routes/aiSecurityMonitorRoutes");
const aiIncidentResponseRoutes = require("./routes/aiIncidentResponseRoutes");
const aiAuditComplianceRoutes = require("./routes/aiAuditComplianceRoutes");
const aiSystemPerformanceRoutes = require("./routes/aiSystemPerformanceRoutes");
const aiDataAnalyticsRoutes = require("./routes/aiDataAnalyticsRoutes");
const aiAutomationSuiteRoutes = require("./routes/aiAutomationSuiteRoutes");
const aiPersonalizationEngineRoutes = require("./routes/aiPersonalizationEngineRoutes");
const aiSmartChatAssistantRoutes = require("./routes/aiSmartChatAssistantRoutes");
const aiTaskAutomationRoutes = require("./routes/aiTaskAutomationRoutes");
const aiSalesOptimizerRoutes = require("./routes/aiSalesOptimizerRoutes");
const aiCustomerInsightsRoutes = require("./routes/aiCustomerInsightsRoutes");
const aiBehaviorAnalysisRoutes = require("./routes/aiBehaviorAnalysisRoutes");
const aiProductRecommendationRoutes = require("./routes/aiProductRecommendationRoutes");
const aiSalesPredictorRoutes = require("./routes/aiSalesPredictorRoutes");
const aiExpensePredictionRoutes = require("./routes/aiExpensePredictionRoutes");
const aiTaxCalculationRoutes = require("./routes/aiTaxCalculationRoutes");
const aiAutoReplyRoutes = require("./routes/aiAutoReplyRoutes");
const aiVoiceAssistantRoutes = require("./routes/aiVoiceAssistantRoutes");
const aiVideoCallRoutes = require("./routes/aiVideoCallRoutes");
const aiSystemOptimizationRoutes = require("./routes/aiSystemOptimizationRoutes");
const aiCRMFinalTestingRoutes = require("./routes/aiCRMFinalTestingRoutes");

require('dotenv').config();

const app = express();

// ✅ Security Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(helmet());
app.use(hpp());
app.use(errorHandler);  // Add the error-handling middleware at the end
//app.use(rateLimiter);  // Apply global rate-limiting
// app.use(morgan('combined', { 
//   stream: { write: message => logger.info(message.trim()) }
//  }));  // ✅ Morgan middleware for HTTP request logging
app.use("/api/ai-insights", aiInsightsRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/payouts", payoutRoutes);
app.use("/api/users", userRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/self-service", selfServiceRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/franchise", franchiseRoutes);
app.use("/api/territory-heads", territoryHeadRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/customer-become-vendor", customerBecomeAVendorRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/commissions", commissionRoutes);
app.use("/api/hierarchy", hierarchyRoutes);
app.use("/api/commission-trends", commissionTrendRoutes);
app.use("/api/sales-forecast", salesForecastRoutes);
app.use("/api/commission-payouts", commissionPayoutRoutes);
app.use("/api/user-analytics", userAnalyticsRoutes);
app.use("/api/sales-leaderboard", salesLeaderboardRoutes);
app.use("/api/revenue-breakdown", revenueBreakdownRoutes);
app.use("/api/bonus-rewards", bonusRewardsRoutes);
app.use("/api/commission-reports", commissionReportsRoutes);
app.use("/api/commission-settings", commissionSettingsRoutes);
app.use("/api/audit-logs", auditLogsRoutes);
app.use("/api/support-tickets", supportTicketsRoutes);
app.use("/api/user-feedback", userFeedbackRoutes);
app.use("/api/performance-analytics", performanceAnalyticsRoutes);
app.use("/api/revenue-tracking", revenueTrackingRoutes);
app.use("/api/incentive-programs", incentiveProgramsRoutes);
app.use("/api/referral-bonuses", referralBonusesRoutes);
app.use("/api/multi-currency", multiCurrencyRoutes);
app.use("/api/hierarchy-management", hierarchyManagementRoutes);
app.use("/api/user-roles-permissions", userRolesPermissionsRoutes);
app.use("/api/franchise-self-service", franchiseSelfServiceRoutes);
app.use("/api/territory-head-self-service", territoryHeadSelfServiceRoutes);
app.use("/api/agent-self-service", agentSelfServiceRoutes);
app.use("/api/vendor-self-service", vendorSelfServiceRoutes);
app.use("/api/customer-become-vendor-self-service", customerBecomeVendorSelfServiceRoutes);
app.use("/api/referral-self-service", referralSelfServiceRoutes);
app.use(auditLogger);
app.use("/api/vendor-performance", vendorPerformanceRoutes);
app.use("/api/predictive-marketing", predictiveMarketingRoutes);
app.use("/api/fraud-detection", fraudDetectionRoutes);
app.use("/api/crm-support", crmSupportRoutes);
app.use("/api/video-call", videoCallRoutes);
app.use("/api/auto-reply", autoReplyRoutes);
app.use("/api/commission-tracking", commissionTrackingRoutes);
app.use("/api/transaction-history", transactionHistoryRoutes);
app.use("/api/payout-management", payoutManagementRoutes);
app.use("/api/dashboard-crm", dashboardCRMRoutes);
app.use("/api/users", userManagementRoutes);
app.use("/api/escrow-payments", escrowPaymentsRoutes);
app.use("/api/commission-calculator", commissionCalculatorRoutes);
app.use("/api/ai-revenue-forecasting", aiRevenueForecastingRoutes);
app.use("/api/automated-leads", automatedLeadGenerationRoutes);
app.use("/api/ai-customer-retention", aiCustomerRetentionRoutes);
app.use("/api/ai-transaction-fraud-detection", aiTransactionFraudDetectionRoutes);
app.use("/api/automated-customer-support", automatedCustomerSupportAIRoutes);
app.use("/api/ai-revenue-breakdown", aiRevenueBreakdownRoutes);
app.use("/api/ai-expense-tracking", aiAutomatedExpenseTrackingRoutes);
app.use("/api/ai-invoice-automation", aiInvoiceAutomationRoutes);
app.use("/api/ai-dispute-resolution", aiDisputeResolutionRoutes);
app.use("/api/ai-sales-forecasting", aiSalesForecastingRoutes);
app.use("/api/ai-lead-scoring", aiLeadScoringRoutes);
app.use("/api/ai-revenue-predictions", aiRevenuePredictionsRoutes);
app.use("/api/ai-product-recommendations", aiProductRecommendationsRoutes);
app.use("/api/ai-voice-video-support", aiVoiceVideoSupportRoutes);
app.use("/api/ai-security-audit-logs", aiSecurityAuditLogsRoutes);
app.use("/api/ai-bug-detection", aiBugDetectionRoutes);
app.use("/api/ai-performance-optimization", aiPerformanceOptimizationRoutes);
app.use("/api/ai-scalability-enhancements", aiScalabilityEnhancementsRoutes);
app.use("/api/ai-traffic-load-balancing", aiTrafficLoadBalancingRoutes);
app.use("/api/ai-auto-scaling", aiAutoScalingManagementRoutes);
app.use("/api/ai-auto-healing", aiAutoHealingSystemRoutes);
app.use("/api/ai-auto-resource-allocation", aiAutoResourceAllocationRoutes);
app.use("/api/ai-cloud-cost-optimization", aiCloudCostOptimizationRoutes);
app.use("/api/ai-downtime-prevention", aiDowntimePreventionRoutes);
app.use("/api/ai-auto-scaling-security", aiAutoScalingSecurityRoutes);
app.use("/api/ai-threat-detection", aiThreatDetectionRoutes);
app.use("/api/ai-anomaly-detection", aiAnomalyDetectionRoutes);
app.use("/api/ai-fraud-detection", aiFraudDetectionRoutes);
app.use("/api/ai-suspicious-activity-monitor", aiSuspiciousActivityMonitorRoutes);
app.use("/api/ai-system-health-monitor", aiSystemHealthMonitorRoutes);
app.use("/api/ai-performance-optimizer", aiPerformanceOptimizerRoutes);
app.use("/api/ai-auto-scaling", aiAutoScalingRoutes);
app.use("/api/ai-resource-allocator", aiResourceAllocatorRoutes);
app.use("/api/ai-load-balancer", aiLoadBalancerRoutes);
app.use("/api/ai-server-health", aiServerHealthRoutes);
app.use("/api/ai-database-optimizer", aiDatabaseOptimizerRoutes);
app.use("/api/ai-security-monitor", aiSecurityMonitorRoutes);
app.use("/api/ai-incident-response", aiIncidentResponseRoutes);
app.use("/api/ai-audit-compliance", aiAuditComplianceRoutes);
app.use("/api/ai-system-performance", aiSystemPerformanceRoutes);
app.use("/api/ai-data-analytics", aiDataAnalyticsRoutes);
app.use("/api/ai-automation-suite", aiAutomationSuiteRoutes);
app.use("/api/ai-personalization", aiPersonalizationEngineRoutes);
app.use("/api/ai-smart-chat", aiSmartChatAssistantRoutes);
app.use("/api/ai-task-automation", aiTaskAutomationRoutes);
app.use("/api/ai-sales-optimizer", aiSalesOptimizerRoutes);
app.use("/api/ai-customer-insights", aiCustomerInsightsRoutes);
app.use("/api/ai-behavior-analysis", aiBehaviorAnalysisRoutes);
app.use("/api/ai-product-recommendations", aiProductRecommendationRoutes);
app.use("/api/ai-sales-predictor", aiSalesPredictorRoutes);
app.use("/api/ai-expense-prediction", aiExpensePredictionRoutes);
app.use("/api/ai-tax-calculation", aiTaxCalculationRoutes);
app.use("/api/ai-auto-reply", aiAutoReplyRoutes);
app.use("/api/ai-voice-assistant", aiVoiceAssistantRoutes);
app.use("/api/ai-video-call", aiVideoCallRoutes);
app.use("/api/ai-system-optimization", aiSystemOptimizationRoutes);
app.use("/api/ai-crm-final-testing", aiCRMFinalTestingRoutes);

//logger.info('🚀 Server is starting...');

// Import the cron job for cleaning expired tokens
require('./cronJobs/tokenCleanup');
require('./cronJobs/payoutProcessor');
require('./cronJobs/payoutScheduler');  // Import the payout scheduler


// ✅ CORS configuration (adjust the origin as necessary for production)
const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:5173'],  // Replace with your frontend production URL if necessary
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
app.use('/api/reports', reportRoutes);
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
