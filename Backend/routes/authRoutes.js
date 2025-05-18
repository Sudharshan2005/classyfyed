import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "5vvgj23hbz"; // Use env variable in production

// Register user
router.post("/register", async (req, res) => {
  try {
    const {
      institute,
      role,
      name,
      instituteId,
      mobile,
      gender,
      dob,
      stream,
      branch,
      currentYear,
      passoutYear,
      idCardFront,
      idCardBack,
      driveLink,
    } = req.body;

    // Enhanced validation
    if (!institute || !role || !name || !instituteId || !mobile || !gender || !dob) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: "Please provide a valid 10-digit mobile number" });
    }
    if (role === "STUDENT" && (!stream || !branch || !currentYear || !passoutYear)) {
      return res.status(400).json({ success: false, message: "Missing student-specific fields" });
    }
    if (!idCardFront || !idCardBack) {
      return res.status(400).json({ success: false, message: "ID card front and back links are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this mobile number" });
    }

    // Create user
    const user = new User({
      institute,
      role,
      name,
      instituteId,
      mobile,
      gender,
      dob: new Date(dob),
      stream,
      branch,
      currentYear,
      passoutYear,
      idCardFront,
      idCardBack,
      driveLink,
      isVerified: false, // Default to false
    });

    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
});

// Get unverified users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ isVerified: false }).select(
      "_id name institute role instituteId mobile createdAt idCardFront idCardBack"
    );
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching unverified users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get user by mobile number
router.get("/users/mobile/:mobile", async (req, res) => {
  try {
    const { mobile } = req.params;
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: "Invalid mobile number" });
    }
    const user = await User.findOne({ mobile }).select("_id isVerified");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by mobile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Approve user (set isVerified to true)
router.patch("/users/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (isVerified !== true) {
      return res.status(400).json({ success: false, message: "Invalid verification status" });
    }

    const user = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User verified successfully" });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Reject user (delete user)
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Sign in user
router.post("/signin", async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    // Validate input
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: "Mobile number and OTP are required" });
    }
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: "Invalid mobile number" });
    }
    if (otp !== "1234") {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // Check if user exists and is verified
    const user = await User.findOne({ mobile }).select("_id role isVerified");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Verification still pending" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ success: true, token, message: "Login successful" });
  } catch (error) {
    console.error("Error signing in user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;