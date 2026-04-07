const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema(
  {
    actorType: {
      type: String,
      enum: ["user", "admin"],
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    ip: {
      type: String,
      required: true
    },
    device: {
      type: String,
      required: true
    },
    unusual: {
      type: Boolean,
      default: false
    },
    success: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoginLog", loginLogSchema);
