import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import User from '@/models/User';
import '@/models/Product';


export async function GET(req: Request, { params }: { params: Promise<{ email: string }> }) {
  try {
    await connectToDB();

    const { email } = await params;

    const user = await User.findOne({ email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    const userId = user._id;

    const cart = await Cart.findOne({ userId }).populate('items.productId');

    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    console.error('Fetch cart failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}