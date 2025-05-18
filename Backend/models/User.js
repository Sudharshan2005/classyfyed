import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    required: function () {
      return this.role === "STUDENT";
    },
  },
  branch: {
    type: String,
    trim: true,
    required: function () {
      return this.role === "STUDENT";
    },
  },
  currentYear: {
    type: String,
    enum: ["1", "2", "3", "4", "5"],
    required: function () {
      return this.role === "STUDENT";
    },
  },
  passoutYear: {
    type: String,
    required: function () {
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
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;