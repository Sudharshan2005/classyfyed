import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Verify from '@/models/Verify';

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const verify = await Verify.findOne({ email });

    if (!verify) {
      return NextResponse.json({ error: 'Verification record not found' }, { status: 404 });
    }

    if (verify.isVerified) {
      await verify.deleteOne({ email });
      return NextResponse.json({ success: true, message: 'Email already verified' }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'Email not verified yet' }, { status: 200 });
    }
  } catch (error) {
    console.error('[VERIFY_POST_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}