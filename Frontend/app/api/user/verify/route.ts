import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function PATCH(req: Request) {
  try {
    const { id, isVerified } = await req.json();

    if (isVerified !== true) {
      return NextResponse.json(
        { message: 'Invalid verification status', success: false },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Classyfyed" <${process.env.ZOHO_USER}>`,
      to: user.email,
      subject: 'Classyfyed - Your Account Has Been Verified!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #194EB4;">Congratulations from <span style="color: #AC67DE;">Classyfyed</span>!</h2>
          <p style="font-size: 16px; color: #333333;">
            Your account has been successfully verified! You're now eligible to claim student discounts until December 31, ${user.passoutYear}.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_API_BASE_URL}" style="background: linear-gradient(to right, #194EB4, #AC67DE); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
              Explore Classyfyed
            </a>
          </div>
          <p style="font-size: 14px; color: #555555;">
            Start exploring our platform to take advantage of your student benefits. If you have any questions, feel free to contact our support team.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;">
          <p style="font-size: 12px; color: #999999; text-align: center;">
            © ${new Date().getFullYear()} Classyfyed. All rights reserved.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      message: 'User verified successfully and confirmation email sent',
      success: true,
    });

  } catch (err) {
    console.error('Error verifying user:', err);
    const errorDetails = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Server error', details: errorDetails, success: false },
      { status: 500 }
    );
  }
}