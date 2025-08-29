import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { OrderModel } from '@/models/Order';
import '@/models/Product';
import '@/models/User'


export async function GET() {
  try {
    await connectToDB();

    const orders = await OrderModel.find()
      .populate('user')
      .populate('items.product');
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}