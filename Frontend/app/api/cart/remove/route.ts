import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Cart, { ICart, CartItem } from '@/models/Cart';
import User from '@/models/User';

interface RemoveFromCartBody {
  email: string;
  productId: string;
}

export async function DELETE(request: Request) {
  try {
    const { email, productId }: RemoveFromCartBody = await request.json();

    if (!email || !productId) {
      return NextResponse.json({ success: false, error: 'Missing email or productId' }, { status: 400 });
    }

    await connectToDB();

    const user = await User.findOne({ email }).select('_id');
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    const userId = user._id;

    const cart: ICart | null = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ success: false, error: 'Cart not found' }, { status: 404 });
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter((item: CartItem) => item.productId.toString() !== productId);

    if (cart.items.length === initialItemCount) {
      return NextResponse.json({ success: false, error: 'Item not found in cart' }, { status: 404 });
    }

    if (cart.items.length === 0) {
      await Cart.deleteOne({ userId });
      return NextResponse.json({ success: true, cart: { userId, items: [] } });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error('Remove from cart failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to remove item' }, { status: 500 });
  }
}