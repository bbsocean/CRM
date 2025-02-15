const express = require("express");
const router = express.Router();
const Commission = require("../models/Commission");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const fs = require("fs");

// ✅ Generate Commission Report with Filters
router.get("/generate", verifyToken, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate, role, format } = req.query;

    let matchCondition = {};
    if (startDate && endDate) {
      matchCondition.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (role) matchCondition.role = role;

    const commissions = await Commission.find(matchCondition)
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    if (format === "csv") {
      const json2csvParser = new Parser({ fields: ["userId.name", "userId.email", "role", "commissionAmount", "status", "createdAt"] });
      const csv = json2csvParser.parse(commissions);
      res.attachment("commission-report.csv").send(csv);
    } else if (format === "pdf") {
      const doc = new PDFDocument();
      const filePath = "commission-report.pdf";
      doc.pipe(fs.createWriteStream(filePath));

      doc.fontSize(18).text("Commission Report", { align: "center" }).moveDown();
      commissions.forEach((commission) => {
        doc
          .fontSize(12)
          .text(`User: ${commission.userId.name} (${commission.userId.email})`)
          .text(`Role: ${commission.role}`)
          .text(`Amount: $${commission.commissionAmount}`)
          .text(`Status: ${commission.status}`)
          .text(`Date: ${commission.createdAt}`)
          .moveDown();
      });

      doc.end();
      res.download(filePath);
    } else {
      res.json({ success: true, data: commissions });
    }
  } catch (error) {
    console.error("Commission Report Error:", error);
    res.status(500).json({ message: "Error generating commission report." });
  }
});

// ✅ Get User's Commission Report
router.get("/user", verifyToken, async (req, res) => {
  try {
    const commissions = await Commission.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: commissions });
  } catch (error) {
    console.error("User Commission Report Error:", error);
    res.status(500).json({ message: "Error fetching user commission report." });
  }
});

module.exports = router;
