import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  user: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
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
  model: { type: String },
  color: { type: String },
  weight: { type: String },
  variants: [variantSchema],
  description: { type: String },
  reviews: [reviewSchema],
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'inactive' },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);