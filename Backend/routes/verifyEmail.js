import express from "express";
import crypto from "crypto";
import Verify from "../models/Verify.js";
import transporter from "../config/mailer.js";

const router = express.Router();

// Send verification email
router.post("/send", async (req, res) => {
  const { email, userId } = req.body;

  if (!email || !userId) {
    return res.status(400).json({ error: "Email and User ID required." });
  }

  const token = crypto.randomBytes(32).toString("hex");

  try {
    // Upsert (if user already requested)
    await Verify.findOneAndUpdate(
      { userId },
      { token, status: "Not Verified" },
      { upsert: true, new: true }
    );

    const link = `https://classyfyed.in/verify/email/${token}`;

    await transporter.sendMail({
      from: `"Classyfyed" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Welcome to Classyfyed!</h2>
        <p>Please click the link below to verify your email:</p>
        <a href="${link}">${link}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.status(200).json({ message: "Verification email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send verification email." });
  }
});

// Verify token
router.get("/email/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const record = await Verify.findOne({ token });

    if (!record) {
      return res.status(400).send("Invalid or expired verification link.");
    }

    if (record.status === "Verified") {
      return res.status(200).send("Email already verified.");
    }

    record.status = "Verified";
    await record.save();

    // You can also mark the user as verified in your main User model here

    res.status(200).send("Email verification successful.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error.");
  }
});

export default router;
