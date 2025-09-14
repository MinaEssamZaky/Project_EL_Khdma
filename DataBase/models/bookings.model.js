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
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: function () { return this.paymentMethod === "proof"; }
  },
  paymentMethod: {
    type: String,
    enum: ["wallet", "proof"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending","approved", "rejected","partiallyApproved"],
    default: "pending"
  },

  // 🟢 المبلغ الكلي المطلوب
  totalAmount: {
    type: Number,
    required: true
  },

 

  // 🟢 حالة الدفع
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Partially Paid", "Paid in Full"],
    default: "Unpaid"
  },

  // 🟢 تعليق الادمن (لو دفع جزئي)
  comment: {
    type: String,
    default: null
  },

  screenshot: {
    type: String,
    required: function () { return this.paymentMethod === "proof"; }
  },
  responsiblePerson: {
    type: String,
    required: function () { return this.paymentMethod === "proof"; }
  },
  eventName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  }
}, { timestamps: true });

const bookingModel = mongoose.model("booking", bookingSchema);
export default bookingModel;
