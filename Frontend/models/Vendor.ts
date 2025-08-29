import mongoose, { Document, Schema, Model, models } from 'mongoose';

// 1. Interface for the Vendor document
export interface VendorDocument extends Document {
  businessName: string;
  businessType: 'individual' | 'partnership' | 'llc' | 'corporation';
  businessCategory: 'electronics' | 'books' | 'software' | 'fashion' | 'lifestyle';
  contactName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gst?: string;
  pan: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolder: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Schema definition
const VendorSchema = new Schema<VendorDocument>(
  {
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    businessType: {
      type: String,
      required: [true, 'Business type is required'],
      enum: ['individual', 'partnership', 'llc', 'corporation'],
    },
    businessCategory: {
      type: String,
      required: [true, 'Business category is required'],
      enum: ['electronics', 'books', 'software', 'fashion', 'lifestyle'],
    },
    contactName: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Business email is required'],
      unique: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
    },
    address: {
      type: String,
      required: [true, 'Business address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'India',
    },
    gst: {
      type: String,
      trim: true,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$|^$/,
        'Please enter a valid GST number or leave empty',
      ],
      default: '',
    },
    pan: {
      type: String,
      required: [true, 'PAN number is required'],
      trim: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number'],
    },
    bankName: {
      type: String,
      required: [true, 'Bank name is required'],
      trim: true,
    },
    accountNumber: {
      type: String,
      required: [true, 'Account number is required'],
      trim: true,
    },
    ifsc: {
      type: String,
      required: [true, 'IFSC code is required'],
      trim: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code'],
    },
    accountHolder: {
      type: String,
      required: [true, 'Account holder name is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 3. Prevent recompilation in dev mode
const Vendor: Model<VendorDocument> =
  models.Vendor || mongoose.model<VendorDocument>('Vendor', VendorSchema);

export default Vendor;
