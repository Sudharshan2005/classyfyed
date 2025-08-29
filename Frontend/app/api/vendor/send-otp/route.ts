import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Otp from "@/models/Otp";
import Vendor from "@/models/Vendor";
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

    const vendor = await Vendor.findOne({ email });
    if(vendor) {
      return NextResponse.json({ message: "Vendor Already Exist", success: false }, { status: 401 });
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
        subject: 'Verify Your Email – Classyfyed Vendor 4-Digit OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
            <h2 style="color: #194EB4;">Vendor Email Verification – <span style="color: #AC67DE;">Classyfyed</span></h2>
            <p style="font-size: 16px; color: #333333;">
              Thank you for registering as a vendor on Classyfyed. To verify your email address, please enter the 4-digit OTP below. This OTP is valid for the next 5 minutes.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: linear-gradient(to right, #194EB4, #AC67DE); color: white; padding: 14px 28px; font-size: 24px; font-weight: bold; letter-spacing: 8px; border-radius: 6px;">
                ${otp}
              </div>
            </div>
            <p style="font-size: 14px; color: #555555; text-align: center;">
              Didn't request this? Please ignore this email or contact support immediately.
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