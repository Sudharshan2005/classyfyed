import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: Number, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Otp", otpSchema);