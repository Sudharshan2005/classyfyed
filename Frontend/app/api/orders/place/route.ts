import { NextRequest, NextResponse } from "next/server";
import { OrderModel, IOrderItem, IShippingAddress } from "@/models/Order";
import Cart from "@/models/Cart";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod,
    }: {
      userId: string;
      items: IOrderItem[];
      shippingAddress: IShippingAddress;
      paymentMethod: string;
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No items in order", success: false }, { status: 400 });
    }

    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = new OrderModel({
      user: userId,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Unpaid",
      orderStatus: "Placed",
      totalAmount,
    });

    const savedOrder = await order.save();

    const deletedCart = await Cart.deleteOne({ userId: userId });
    if (deletedCart.deletedCount === 0) {
      console.warn(`No cart found for userId: ${userId}`);
    }

    return NextResponse.json({
      message: "Order placed successfully",
      order: savedOrder,
      success: true
    }, { status: 201 });

  } catch (error) {
    console.error("Error placing order:", error, req.json());
    return NextResponse.json({ message: "Internal Server Error", succes: false }, { status: 500 });
  }
};
