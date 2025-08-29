import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/encryption';
import { connectToDB } from '@/lib/mongodb';
import Verify from '@/models/Verify';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  try {
    const decrypted = decrypt(decodeURIComponent(token));
    const { email, expiresAt } = JSON.parse(decrypted);

    if (Date.now() > expiresAt) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    await connectToDB();
    const user = await Verify.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.classyfyed.com';
    return NextResponse.redirect(new URL('/thank-you', baseUrl));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }
}