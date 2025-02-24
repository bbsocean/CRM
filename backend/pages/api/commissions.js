import connectDB from "../../config/db";
import Commission from "../../models/Commission";

export default async function handler(req, res) {
  await connectDB(); // Ensure DB connection

  if (req.method === "GET") {
    try {
      const commissions = await Commission.find();
      res.status(200).json(commissions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching commissions" });
    }
  }
}
