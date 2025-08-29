import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IVariant {
  key: string;
  value: string;
}

export interface IReview {
  rating: number;
  comment: string;
  user: string;
}

export interface IProduct extends Document {
  _id: string;
  images: string[];
  brandName: string;
  mobile: string;
  genericName: string;
  originalPrice: number;
  discountPrice: number;
  category: string;
  subCategory: string;
  stock: number;
  sales: number;
  productModel?: string;
  color?: string;
  weight?: string;
  variants: Types.Array<IVariant>;
  description?: string;
  reviews: Types.Array<IReview>;
  status: 'active' | 'inactive' | 'pending';
  vendorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema: Schema<IVariant> = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const reviewSchema: Schema<IReview> = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    user: { type: String, required: true },
  },
  { _id: false }
);

const productSchema: Schema<IProduct> = new Schema(
  {
    images: [{ type: String, required: true }],
    brandName: { type: String, required: true },
    mobile: { type: String, required: true },
    genericName: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    stock: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    productModel: { type: String },
    color: { type: String },
    weight: { type: String },
    variants: [variantSchema],
    description: { type: String },
    reviews: [reviewSchema],
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
  },
  { timestamps: true }
);

const ProductModel: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default ProductModel;
