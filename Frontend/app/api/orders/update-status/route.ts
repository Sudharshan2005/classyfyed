import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { OrderModel } from '@/models/Order';
import mongoose from 'mongoose';

export async function PATCH(req: Request) {
  try {
    await connectToDB();

    const { orderId, productId, status } = await req.json();

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid or missing orderId' }, { status: 400 });
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid or missing productId' }, { status: 400 });
    }

    if (!status || typeof status !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing status' }, { status: 400 });
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: orderId, 'items.product': productId },
      { $set: { 'items.$.status': status } },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order or product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated', order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error('Error updating product status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}