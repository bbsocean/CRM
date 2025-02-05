const cron = require('node-cron');
const Transaction = require('../models/Transaction');
const Payout = require('../models/Payout');
// const BankAPI = require('../services/bankAPI');  // Mock or real bank API
// const axios = require('axios');

// Function to process pending payouts
// const processPendingPayouts = async () => {
//   try {
//     console.log('🔄 Running payout processing job...');

//     // Find all pending transactions
//     const pendingTransactions = await Transaction.find({ status: 'Pending' });

//     for (const transaction of pendingTransactions) {
//       // Simulate payout processing (e.g., bank transfer or wallet payment)
//       console.log(`Processing payout for transaction ID: ${transaction._id}`);

//       //-------- Simulate or integrate with a real banking API--------------
//     //   const bankApiResponse = await axios.post('https://mockbankapi.com/payouts', {
//     //     recipientAccount: transaction.bankAccount,
//     //     amount: transaction.amount,
//     //     paymentMethod: transaction.paymentMethod,  // Bank Transfer, Wallet, etc.
//     //   });

//     //   if (bankApiResponse.data.status === 'success') {
//     //     // Mark transaction as completed
//     //     transaction.status = 'Completed';
//     //     await transaction.save();
//     //     console.log(`✅ Payout successfully processed for transaction ID: ${transaction._id}`);
//     //   } else {
//     //     console.error(`❌ Payout failed for transaction ID: ${transaction._id} - ${bankApiResponse.data.message}`);
//     //   }
//     // }
//         //------------------------------------

//       // Mark the transaction as completed after processing
//       transaction.status = 'Completed';
//       await transaction.save();

//       console.log(`✅ Payout processed successfully for transaction ID: ${transaction._id}`);
//     }
//   } catch (error) {
//     console.error('❌ Error processing payouts:', error);
//   }
// };

// // Schedule the cron job to run every 15 minutes (adjust if necessary)
// cron.schedule('*/15 * * * *', processPendingPayouts);


// Retry limit and delay configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 5 * 60 * 1000;  // 5 minutes

const processPendingPayouts = async () => {
  try {
    const pendingPayouts = await Payout.find({ status: 'Pending' });

    for (const payout of pendingPayouts) {
      try {
        console.log(`🚀 Processing payout: ${payout._id}`);
        
        // Attempt to process the payout using the bank API
        await BankAPI.transferFunds(payout.recipientAccount, payout.amount);

        // Mark payout as completed
        payout.status = 'Completed';
        payout.retries = 0;
        await payout.save();
        console.log(`✅ Payout ${payout._id} processed successfully.`);

      } catch (error) {
        console.error(`❌ Error processing payout ${payout._id}:`, error.message);
        
        // Increment retry count
        payout.retries = (payout.retries || 0) + 1;

        if (payout.retries >= MAX_RETRIES) {
          payout.status = 'Failed';
          console.error(`🚫 Payout ${payout._id} marked as permanently failed.`);
        } else {
          console.log(`🔄 Retrying payout ${payout._id} after ${RETRY_DELAY / 60000} minutes...`);
          payout.status = 'Retrying';
          setTimeout(() => retryPayout(payout), RETRY_DELAY);
        }

        await payout.save();
      }
    }
  } catch (error) {
    console.error('🚨 Global error in processing payouts:', error);
  }
};

// Retry payout function
const retryPayout = async (payout) => {
  try {
    console.log(`🔄 Retrying payout ${payout._id}`);
    await BankAPI.transferFunds(payout.recipientAccount, payout.amount);
    payout.status = 'Completed';
    payout.retries = 0;
    await payout.save();
    console.log(`✅ Payout ${payout._id} retried successfully.`);
  } catch (error) {
    console.error(`❌ Retry failed for payout ${payout._id}:`, error.message);
  }
};

module.exports = processPendingPayouts;
