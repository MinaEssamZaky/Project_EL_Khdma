// models/bookingModel.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "event",
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ["wallet", "proof"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  amount: {
    type: Number,
    required: true
  },
  screenshot: {
    type: String,
    required: function() { return this.paymentMethod === "proof"; }
  },
  responsiblePerson: {
    type: String,
    required: function() { return this.paymentMethod === "proof"; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const bookingModel = mongoose.model("booking", bookingSchema);
export default bookingModel;
