import { connectToDatabase } from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  


  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    // const { db } = await connectToDatabase();
    // const user = await db.collection("users").findOne({ email });

    const { db } = await connectToDatabase();
    if (!db) {
      return res.status(500).json({ message: "Database connection failed!" });
    }

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables!");
      return res.status(500).json({ message: "Internal Server Error (JWT Secret missing)" });
    }    

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("🔎 Debug: JWT_SECRET =", process.env.JWT_SECRET);
    console.log("🔎 Debug: MONGO_URI =", process.env.MONGO_URI);
    
    return res.status(200).json({ message: "Login successful!", token });

  } catch (error) {
    console.error("Login API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
