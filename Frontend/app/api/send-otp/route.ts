import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);

  try {
    await connectToDB();

    const user = await User.findOne({ email });
    if(!user) {
      return NextResponse.json({ message: "User Not Found", success: false }, { status: 401 });
    }

    if(!user.isVerified) {
      return NextResponse.json({ message: "User Not Verified", success: false }, { status: 401 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
      },
    });

    await transporter.sendMail({
        from: `"Classyfyed" <${process.env.ZOHO_USER}>`,
        to: email,
        subject: 'Your Classyfyed Login OTP – Secure Access to Your Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
            <h2 style="color: #194EB4;">Welcome back to <span style="color: #AC67DE;">Classyfyed</span>!</h2>
            <p style="font-size: 16px; color: #333333;">
              Use the One-Time Password (OTP) below to complete your login. This OTP is valid for 5 minutes.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: linear-gradient(to right, #194EB4, #AC67DE); color: white; padding: 14px 28px; font-size: 24px; font-weight: bold; letter-spacing: 8px; border-radius: 6px;">
                ${otp}
              </div>
            </div>
            <p style="font-size: 14px; color: #555555; text-align: center;">
              If you didn’t request this OTP, please ignore this email or contact our support team.
            </p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;">
            <p style="font-size: 12px; color: #999999; text-align: center;">
              © ${new Date().getFullYear()} Classyfyed. All rights reserved.
            </p>
          </div>
        `,
      });
      

    await Otp.findOneAndUpdate(
      { email },
      { email, otp },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: "OTP sent successfully", success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to send OTP", success: false }, { status: 500 });
  }
}