import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js"
import vendorRoutes from "./routes/vendorRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import verifyEmail from "./routes/verifyEmail.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/product", productRoutes);
app.use("/api/email", verifyEmail);

app.listen(PORT, () => {
    console.log("Classyfyed backend running on port", PORT);
  });