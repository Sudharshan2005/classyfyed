import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/encryption';
import { connectToDB } from '@/lib/mongodb';
import Verify from '@/models/Verify';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { email, name } = await req.json();

  if (!email || !name) {
    return NextResponse.json(
      { message: 'Email and name are required', success: false },
      { status: 400 }
    );
  }

  try {
    await connectToDB();

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: 'User already exists', success: false },
        { status: 409 }
      );
    }

    const payload = JSON.stringify({
      email,
      expiresAt: Date.now() + 1000 * 60 * 30, // 30 minutes expiry
    });

    const token = encrypt(payload);
    const verifyUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verify?token=${encodeURIComponent(token)}`;

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
      },
    });

    await Verify.findOneAndUpdate(
      { email },
      { name, isVerified: false, token, expiresAt: new Date(Date.now() + 1000 * 60 * 30) },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `"Classyfyed" <${process.env.ZOHO_USER}>`,
      to: email,
      subject: 'Welcome to Classyfyed – Verify Your Email to Get Started!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #194EB4;">Welcome to <span style="color: #AC67DE;">Classyfyed</span>!</h2>
          <p style="font-size: 16px; color: #333333;">
            Thank you for signing up. To complete your registration and start using Classyfyed, please verify your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(to right, #194EB4, #AC67DE); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
              Verify Email
            </a>
          </div>
          <p style="font-size: 14px; color: #555555;">
            If the button above doesn't work, copy and paste this link into your browser:<br/>
            <a href="${verifyUrl}" style="color: #194EB4;">${verifyUrl}</a>
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;">
          <p style="font-size: 12px; color: #999999; text-align: center;">
            © ${new Date().getFullYear()} Classyfyed. All rights reserved.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ 
      message: 'Verification email sent', 
      success: true 
    });

  } catch (err: Error | unknown) {
    console.error('Nodemailer error:', err);
    const errorDetails = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to send email', details: errorDetails, success: false }, { status: 500 });
  }
}