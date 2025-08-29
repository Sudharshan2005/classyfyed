import { NextRequest, NextResponse } from "next/server";
import Otp from "@/models/Otp";
import { connectToDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "5vvgj23hbz";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, otp } = body;

  if (!email || !otp) {
    return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
  }

  try {
    await connectToDB();

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return NextResponse.json({ message: "OTP not found" }, { status: 404 });
    }

    if (otpRecord.otp !== Number(otp)) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
    }

    const token = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    await Otp.deleteOne({ email });

    return NextResponse.json({ message: "OTP verified successfully", token, success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to verify OTP", success: false }, { status: 500 });
  }
}
