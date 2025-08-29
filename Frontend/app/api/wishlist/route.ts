import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import Wishlist from '@/models/Wishlist';
import { Types } from 'mongoose';

type RequestBody = {
  email: string;
  productId: string;
  action?: 'add' | 'remove';
};

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { email, productId, action = 'add' }: RequestBody = await req.json();

    const user = await User.findOne({ email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    const userId = user._id as Types.ObjectId;

    const update =
      action === 'remove'
        ? { $pull: { products: new Types.ObjectId(productId) } }
        : { $addToSet: { products: new Types.ObjectId(productId) } };

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      update,
      {
        new: true,
        upsert: action === 'add',
        setDefaultsOnInsert: true,
      }
    );

    if (action === 'remove' && wishlist && wishlist.products.length === 0) {
      await Wishlist.deleteOne({ _id: wishlist._id });
      return NextResponse.json({
        success: true,
        wishlist: null,
        message: 'Wishlist emptied and removed',
      });
    }

    return NextResponse.json({ success: true, wishlist });
  } catch (err) {
    console.error('Wishlist update failed:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update wishlist' },
      { status: 500 }
    );
  }
}
