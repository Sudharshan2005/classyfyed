import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { OrderModel } from '@/models/Order';
import '@/models/Product';
import '@/models/User';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId || !mongoose.Types.ObjectId.isValid(vendorId)) {
      return NextResponse.json({ error: 'Invalid or missing vendorId' }, { status: 400 });
    }

    const orders = await OrderModel.find()
      .populate('user')
      .populate('items.product')
      .sort({ placedAt: -1 });

    const filteredOrders = orders
      .map(order => {
        const filteredItems = order.items.filter((item: { product: { vendorId?: mongoose.Types.ObjectId }; }) => {
          return item.product && item.product.vendorId?.toString() === vendorId;
        });

        if (filteredItems.length > 0) {
          return {
            ...order.toObject(),
            items: filteredItems,
          };
        }

        return null;
      })
      .filter(Boolean);

    return NextResponse.json({filteredOrders, vendorId}, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}