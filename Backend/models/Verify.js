import mongoose from "mongoose";

const verifySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, required: true, default: "Not Verified" },
});

export default mongoose.model("Verify", verifySchema);