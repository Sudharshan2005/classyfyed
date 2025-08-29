import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

export interface IShippingAddress {
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  placedAt: Date;
}

const OrderItemSchema: Schema<IOrderItem> = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
});

const ShippingAddressSchema: Schema<IShippingAddress> = new Schema<IShippingAddress>({
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
});

const OrderSchema: Schema<IOrder> = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [OrderItemSchema], required: true },
  shippingAddress: { type: ShippingAddressSchema, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: "Unpaid" },
  orderStatus: { type: String, default: "Placed" },
  totalAmount: { type: Number, required: true },
  placedAt: { type: Date, default: Date.now },
});

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);