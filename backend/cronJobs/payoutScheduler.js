const cron = require('node-cron');
const processPendingPayouts = require('./payoutProcessor');

// Schedule to run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('⏰ Starting daily payout processing...');
  await processPendingPayouts();
  console.log('✅ Daily payout processing completed.');
});
