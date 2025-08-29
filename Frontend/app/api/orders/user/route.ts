import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { OrderModel } from '@/models/Order';
import '@/models/Product';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid or missing userId' }, { status: 400 });
    }

    const orders = await OrderModel.find({ user: userId })
      .populate('items.product')
      .sort({ placedAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}