import mongoose, { Schema, models } from 'mongoose';

const adminSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true }
});

export default models.Admin || mongoose.model('Admin', adminSchema);