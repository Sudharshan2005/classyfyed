import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  institute: string;
  role: "STUDENT" | "FACULTY";
  name: string;
  instituteId: string;
  mobile: string;
  email: string;
  gender: "male" | "female" | "other";
  dob: Date;
  stream?: "engineering" | "science" | "arts" | "commerce" | "medicine" | "other";
  branch?: string;
  currentYear?: "1" | "2" | "3" | "4" | "5";
  passoutYear?: string;
  idCardFront: string;
  idCardBack: string;
  driveLink?: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>(
  {
    institute: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["STUDENT", "FACULTY"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    instituteId: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    stream: {
      type: String,
      enum: ["engineering", "science", "arts", "commerce", "medicine", "other"],
      required: function (this: IUser) {
        return this.role === "STUDENT";
      },
    },
    branch: {
      type: String,
      trim: true,
      required: function (this: IUser) {
        return this.role === "STUDENT";
      },
    },
    currentYear: {
      type: String,
      enum: ["1", "2", "3", "4", "5"],
      required: function (this: IUser) {
        return this.role === "STUDENT";
      },
    },
    passoutYear: {
      type: String,
      required: function (this: IUser) {
        return this.role === "STUDENT";
      },
    },
    idCardFront: {
      type: String,
      required: true,
      trim: true,
    },
    idCardBack: {
      type: String,
      required: true,
      trim: true,
    },
    driveLink: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;