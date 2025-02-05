const express = require('express');
const router = express.Router();
const commissionController = require('../controllers/commissionController');

// GET /api/commissions/pending -> Fetch pending commissions
router.get('/pending', commissionController.getPendingCommissions);

module.exports = router;
