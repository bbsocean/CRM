const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Vendor Update Products & Inventory
router.put("/update-inventory", verifyToken, async (req, res) => {
  try {
    const { productId, stockCount } = req.body;
    const vendor = await Vendor.findById(req.user.id);

    if (!vendor) return res.status(404).json({ message: "Vendor not found." });

    const product = vendor.products.find((p) => p._id.toString() === productId);
    if (!product) return res.status(404).json({ message: "Product not found." });

    product.stock = stockCount;
    await vendor.save();

    res.json({ success: true, message: "Inventory updated successfully." });
  } catch (error) {
    console.error("Vendor Inventory Update Error:", error);
    res.status(500).json({ message: "Error updating inventory." });
  }
});

module.exports = router;
