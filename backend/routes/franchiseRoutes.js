const express = require('express');
const { createFranchise } = require('../controllers/franchiseController');
const router = express.Router();

// ✅ POST route to create a franchise
router.post('/create', createFranchise);

module.exports = router;
