import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import Wishlist from '@/models/Wishlist';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Missing email' },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findOne({ email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    const userId = user._id;

    const wishlist = await Wishlist.findOne({ userId }).populate('products');
    return NextResponse.json({
      success: true,
      wishlist: wishlist || { userId, products: [] },
    });
  } catch (err) {
    console.error('Fetch wishlist failed:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}