import mongoose, { Schema, models } from 'mongoose';

const OtpSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  otp: { type: Number, required: true },
});

export default models.Otp || mongoose.model('Otp', OtpSchema);