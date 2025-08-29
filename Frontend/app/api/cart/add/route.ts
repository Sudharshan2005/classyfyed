import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Cart, { ICart, CartItem } from '@/models/Cart';
import User from '@/models/User';
import { Types } from 'mongoose';

type RequestBody = {
  email: string;
  productId: string;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { email, productId, quantity }: RequestBody = await req.json();

    const user = await User.findOne({ email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    const userId = user._id;

    let cart: ICart | null = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId: new Types.ObjectId(productId), quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item: CartItem) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId: new Types.ObjectId(productId),
          quantity,
        });
      }

      await cart.save();
    }

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('Add to cart failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}