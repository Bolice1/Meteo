const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    device: { type: String, required: true },
    loggedInAt: { type: Date, default: Date.now },
    unusual: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    location: {
      city: { type: String, trim: true, default: "" },
      lat: { type: Number, default: null },
      lon: { type: Number, default: null }
    },
    lastLoginIP: { type: String, default: "" },
    lastLoginDevice: { type: String, default: "" },
    loginHistory: {
      type: [loginHistorySchema],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    },
    disabledAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
