import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  isVerified: { type: Boolean, default: false },
});

export default models.Verify || mongoose.model('Verify', UserSchema);