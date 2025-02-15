const express = require("express");
const router = express.Router();
const CustomerBecomeAVendor = require("../models/CustomerBecomeAVendor");
const MarketplaceItem = require("../models/MarketplaceItem");
const Transaction = require("../models/Transaction");
const Payout = require("../models/Payout");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Apply to Become a Vendor
router.post("/apply", verifyToken, async (req, res) => {
  try {
    const { businessName, category, contactEmail, phone } = req.body;

    if (!businessName || !category || !contactEmail || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const application = new CustomerBecomeAVendor({
      userId: req.user.id,
      businessName,
      category,
      contactEmail,
      phone,
      status: "pending",
    });

    await application.save();
    res.json({ success: true, message: "Application submitted successfully." });
  } catch (error) {
    console.error("Application Error:", error);
    res.status(500).json({ message: "Error submitting application." });
  }
});

// ✅ Get All Applications (Admin Only)
router.get("/applications", verifyToken, isAdmin, async (req, res) => {
  try {
    const applications = await CustomerBecomeAVendor.find().sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error("Fetch Applications Error:", error);
    res.status(500).json({ message: "Error fetching applications." });
  }
});

// ✅ Approve or Reject an Application (Admin Action)
router.put("/applications/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await CustomerBecomeAVendor.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await application.save();

    res.json({ success: true, message: `Application ${status}` });
  } catch (error) {
    console.error("Application Approval Error:", error);
    res.status(500).json({ message: "Error updating application status." });
  }
});

// ✅ List Customer's Products in the Marketplace (For Approved Vendors)
router.post("/add-product", verifyToken, async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingVendor = await CustomerBecomeAVendor.findOne({ userId: req.user.id, status: "approved" });
    if (!existingVendor) return res.status(403).json({ message: "You are not an approved vendor" });

    const newItem = new MarketplaceItem({
      title,
      description,
      price,
      category,
      seller: req.user.id,
    });

    await newItem.save();
    res.json({ success: true, message: "Product added to marketplace" });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// ✅ Get Vendor Sales & Transactions
router.get("/transactions", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ vendorId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Vendor Transactions Error:", error);
    res.status(500).json({ message: "Error fetching transactions." });
  }
});

// ✅ Customer Become A Vendor Payout Requests
router.post("/payout-request", verifyToken, async (req, res) => {
  try {
    const { amount, method } = req.body;

    if (!amount || !method) {
      return res.status(400).json({ message: "Amount and method are required" });
    }

    const payout = new Payout({
      userId: req.user.id,
      amount,
      method,
      status: "pending",
    });

    await payout.save();
    res.json({ success: true, message: "Payout request submitted." });
  } catch (error) {
    console.error("Payout Request Error:", error);
    res.status(500).json({ message: "Error requesting payout." });
  }
});

module.exports = router;
