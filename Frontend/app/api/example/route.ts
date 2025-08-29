import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    MONGODB_URI: process.env.MONGODB_URI || null,
    ZOHO_USER: process.env.ZOHO_USER || null,
    ZOHO_PASS: process.env.ZOHO_PASS || null,
    ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET || null
  });
}