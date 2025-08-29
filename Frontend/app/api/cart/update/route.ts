import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Cart, { ICart, CartItem } from '@/models/Cart';
import User from '@/models/User';

interface UpdateCartBody {
    email: string;
    productId: string;
    quantity: number;
}

export async function PUT(request: Request) {
    try {
      const { email, productId, quantity }: UpdateCartBody = await request.json();
  
      if (!email || !productId || quantity < 1) {
        return NextResponse.json(
          { success: false, error: 'Missing userId, productId, or invalid quantity' },
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
  
      const cart: ICart | null = await Cart.findOne({ userId });
      if (!cart) {
        return NextResponse.json({ success: false, error: 'Cart not found' }, { status: 404 });
      }
  
      const item = cart.items.find((item: CartItem) => item.productId.toString() === productId);
      if (!item) {
        return NextResponse.json({ success: false, error: 'Item not found in cart' }, { status: 404 });
      }
  
      item.quantity = quantity;
      await cart.save();
  
      const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
      return NextResponse.json({ success: true, cart: updatedCart });
    } catch (error) {
      console.error('Update cart failed:', error);
      return NextResponse.json({ success: false, error: 'Failed to update cart' }, { status: 500 });
    }
  }