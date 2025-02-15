const express = require("express");
const axios = require("axios");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const API_KEY = "your_api_key"; // Replace with actual API key
const API_URL = "https://openexchangerates.org/api/latest.json"; // Replace with actual currency API

// ✅ Fetch Live Exchange Rates
router.get("/exchange-rates", verifyToken, async (req, res) => {
  try {
    const { baseCurrency = "USD" } = req.query;
    const response = await axios.get(`${API_URL}?app_id=${API_KEY}&base=${baseCurrency}`);

    if (response.data && response.data.rates) {
      res.json({ success: true, data: response.data.rates });
    } else {
      res.status(500).json({ message: "Failed to fetch exchange rates." });
    }
  } catch (error) {
    console.error("Currency Exchange Rate Error:", error);
    res.status(500).json({ message: "Error fetching exchange rates." });
  }
});

// ✅ Convert an Amount Between Two Currencies
router.get("/convert", verifyToken, async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.query;
    if (!amount || !fromCurrency || !toCurrency) {
      return res.status(400).json({ message: "Amount, fromCurrency, and toCurrency are required." });
    }

    const response = await axios.get(`${API_URL}?app_id=${API_KEY}`);
    const rates = response.data.rates;

    if (!rates[fromCurrency] || !rates[toCurrency]) {
      return res.status(400).json({ message: "Invalid currency codes." });
    }

    const convertedAmount = (amount / rates[fromCurrency]) * rates[toCurrency];

    res.json({
      success: true,
      originalAmount: amount,
      convertedAmount,
      fromCurrency,
      toCurrency,
    });
  } catch (error) {
    console.error("Currency Conversion Error:", error);
    res.status(500).json({ message: "Error converting currency." });
  }
});

// ✅ Get Available Currencies
router.get("/available-currencies", verifyToken, async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}?app_id=${API_KEY}`);
    const currencies = Object.keys(response.data.rates);

    res.json({ success: true, data: currencies });
  } catch (error) {
    console.error("Available Currencies Fetch Error:", error);
    res.status(500).json({ message: "Error fetching available currencies." });
  }
});

// ✅ Set User's Preferred Currency
router.post("/set-preference", verifyToken, async (req, res) => {
  try {
    const { preferredCurrency } = req.body;
    if (!preferredCurrency) {
      return res.status(400).json({ message: "Preferred currency is required." });
    }

    req.user.preferredCurrency = preferredCurrency;
    await req.user.save();

    res.json({ success: true, message: "Preferred currency updated successfully." });
  } catch (error) {
    console.error("Set Preferred Currency Error:", error);
    res.status(500).json({ message: "Error updating preferred currency." });
  }
});

module.exports = router;
