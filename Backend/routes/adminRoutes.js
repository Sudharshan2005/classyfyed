import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ success: false, message: "User ID and password are required" });
    }

    const admin = await Admin.findOne({ userId });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid user ID or password" });
    }

    if (admin.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid user ID or password" });
    }

    const token = jwt.sign({ userId: admin.userId, role: "admin" }, "your_jwt_secret", { expiresIn: "1h" });

    res.status(200).json({ success: true, token, message: "Admin login successful" });
  } catch (error) {
    console.error("Admin Login - Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;