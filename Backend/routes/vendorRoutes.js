import express from "express";
import Vendor from "../models/Vendor.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Register vendor
router.post("/register", async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      businessCategory,
      contactName,
      email,
      mobile,
      address,
      city,
      state,
      pincode,
      country,
      gst,
      pan,
      bankName,
      accountNumber,
      ifsc,
      accountHolder,
      password,
    } = req.body;

    const existingVendor = await Vendor.findOne({ $or: [{ email }, { mobile }] });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: "Email or mobile already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = new Vendor({
      businessName,
      businessType,
      businessCategory,
      contactName,
      email,
      mobile,
      address,
      city,
      state,
      pincode,
      country,
      gst,
      pan,
      bankName,
      accountNumber,
      ifsc,
      accountHolder,
      password: hashedPassword,
      isVerified: false,
    });

    await vendor.save();
    res.status(201).json({ success: true, message: "Vendor registered successfully, awaiting verification" });
  } catch (error) {
    console.error("Vendor Register - Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all unverified vendors
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find({ isVerified: false }).select(
      "businessName contactName businessCategory mobile gst pan createdAt"
    );
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    console.error("Get Unverified Vendors - Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Approve vendor (set isVerified: true)
router.patch("/vendors/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (isVerified !== true) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, message: "Vendor approved successfully" });
  } catch (error) {
    console.error("Approve Vendor - Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete vendor
router.delete("/vendors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findByIdAndDelete(id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Delete Vendor - Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;