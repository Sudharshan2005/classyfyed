import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Verify from '@/models/Verify';

export async function DELETE(req: Request) {
  try {
    await connectToDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const verify = await Verify.findOneAndDelete({ email });

    if (!verify) {
      return NextResponse.json({ error: 'Verification record not found' }, { status: 404 });
    }

      return NextResponse.json({ success: true, message: 'Verification record deleted' }, { status: 200 });
  } catch (error) {
    console.error('[VERIFY_POST_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}