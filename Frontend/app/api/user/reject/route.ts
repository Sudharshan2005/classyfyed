import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function DELETE(req: NextRequest) {
    const { id } = await req.json();

  try {
    await connectToDB();

    const user = await User.findByIdAndDelete(id);

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
      subject: 'Classyfyed - Account Rejection Notice',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #194EB4;">Classyfyed Account Update</h2>
          <p style="font-size: 16px; color: #333333;">
            We're sorry, but your account has been rejected. Please enter your correct details and register again to continue using Classyfyed.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_API_BASE_URL}" style="background: linear-gradient(to right, #194EB4, #AC67DE); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
              Register Again
            </a>
          </div>
          <p style="font-size: 14px; color: #555555;">
            If you believe this is an error or need assistance, please contact our support team at <a href="mailto:support@classyfyed.com" style="color: #194EB4;">support@classyfyed.com</a>.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;">
          <p style="font-size: 12px; color: #999999; text-align: center;">
            © ${new Date().getFullYear()} Classyfyed. All rights reserved.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      message: 'User deleted successfully and notification email sent',
      success: true,
    });

  } catch (err: unknown) {
    console.error('Error deleting user:', err);
    const errorDetails = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Server error', details: errorDetails, success: false },
      { status: 500 }
    );
  }
}
