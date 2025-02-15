const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");
const MarketplaceItem = require("../models/MarketplaceItem");
const Transaction = require("../models/Transaction");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Register a New Vendor
router.post("/register", verifyToken, async (req, res) => {
  try {
    const { name, businessName, contactEmail, phone, category } = req.body;

    if (!name || !businessName || !contactEmail || !phone || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newVendor = new Vendor({
      userId: req.user.id,
      name,
      businessName,
      contactEmail,
      phone,
      category,
    });

    await newVendor.save();
    res.json({ success: true, message: "Vendor registered successfully" });
  } catch (error) {
    console.error("Vendor Registration Error:", error);
    res.status(500).json({ message: "Error registering vendor" });
  }
});

// ✅ Get Vendor Profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id });

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.json({ success: true, data: vendor });
  } catch (error) {
    console.error("Fetch Vendor Profile Error:", error);
    res.status(500).json({ message: "Error fetching vendor profile" });
  }
});

// ✅ Get Vendor's Sales & Transactions
router.get("/transactions", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ vendorId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Vendor Transactions Error:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// ✅ Vendor Adds a Product to the Marketplace
router.post("/add-product", verifyToken, async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newItem = new MarketplaceItem({
      title,
      description,
      price,
      category,
      seller: req.user.id, // Vendor's user ID
    });

    await newItem.save();
    res.json({ success: true, message: "Product added to marketplace" });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// ✅ Vendor Updates an Existing Product
router.put("/update-product/:id", verifyToken, async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const product = await MarketplaceItem.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller !== req.user.id) return res.status(403).json({ message: "Unauthorized action" });

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;

    await product.save();
    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

// ✅ Vendor Deletes a Product
router.delete("/delete-product/:id", verifyToken, async (req, res) => {
  try {
    const product = await MarketplaceItem.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller !== req.user.id) return res.status(403).json({ message: "Unauthorized action" });

    await product.remove();
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
