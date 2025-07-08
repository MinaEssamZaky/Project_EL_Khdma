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
  bookingDate: {
    type: Date,
    default: Date.now
  },
  numberOfSeats: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["wallet", "cash", "money transfer"],
    required: true
  },
  transactionId: String
}, { timestamps: true });

const bookingModel = mongoose.model("booking", bookingSchema);
export default bookingModel;
