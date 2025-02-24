const cron = require('node-cron');
const User = require('../models/User');

// Schedule the cron job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    await User.updateMany({ refreshToken: { $exists: true } }, { $unset: { refreshToken: 1 } });
    console.log('✅ Expired refresh tokens cleaned successfully.');
  } catch (error) {
    console.error('❌ Error cleaning expired refresh tokens:', error);
  }
});
