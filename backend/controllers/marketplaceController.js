const express = require("express");
const router = express.Router();
const MarketplaceItem = require("../models/MarketplaceItem");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Fetch Marketplace Listings (with Search & Filters)
router.get("/", async (req, res) => {
  try {
    const { category, seller, minPrice, maxPrice, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (seller) filter.seller = seller;
    if (minPrice || maxPrice) {
      filter.price = { $gte: minPrice || 0, $lte: maxPrice || Number.MAX_VALUE };
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    const items = await MarketplaceItem.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    console.error("Marketplace Fetch Error:", error);
    res.status(500).json({ message: "Error fetching marketplace items" });
  }
});

// ✅ Create a New Marketplace Listing
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, price, category, seller } = req.body;

    if (!title || !price || !category || !seller) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newItem = new MarketplaceItem({
      title,
      description,
      price,
      category,
      seller,
    });

    await newItem.save();
    res.json({ success: true, message: "Marketplace item listed successfully" });
  } catch (error) {
    console.error("Marketplace Creation Error:", error);
    res.status(500).json({ message: "Error listing marketplace item" });
  }
});

// ✅ Update Marketplace Listing (Only Owner Can Update)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const item = await MarketplaceItem.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.seller !== req.user.id) return res.status(403).json({ message: "Unauthorized action" });

    item.title = title || item.title;
    item.description = description || item.description;
    item.price = price || item.price;
    item.category = category || item.category;

    await item.save();
    res.json({ success: true, message: "Marketplace item updated successfully" });
  } catch (error) {
    console.error("Marketplace Update Error:", error);
    res.status(500).json({ message: "Error updating marketplace item" });
  }
});

// ✅ Delete Marketplace Listing (Only Owner or Admin Can Delete)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.seller !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await item.remove();
    res.json({ success: true, message: "Marketplace item deleted successfully" });
  } catch (error) {
    console.error("Marketplace Deletion Error:", error);
    res.status(500).json({ message: "Error deleting marketplace item" });
  }
});

module.exports = router;
