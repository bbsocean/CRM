// controllers/commissionCalculatorController.js
const calculateCommission = async (req, res) => {
    try {
      const { salesAmount, role } = req.body;
  
      const commissionRates = {
        Franchise: 10,
        "Territory Head": 8,
        Agent: 5,
        Vendor: 3,
        CustomerBecomeAVendor: 4,
        Referral: 2,
      };
  
      const percentage = commissionRates[role] || 0;
      const amount = (salesAmount * percentage) / 100;
  
      res.status(200).json({ percentage, amount });
    } catch (error) {
      console.error("Error calculating commission:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  module.exports = { calculateCommission };
  