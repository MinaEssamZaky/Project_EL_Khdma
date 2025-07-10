import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ["event", "trip"],
    default: "event"
  },
  date: { type: Date, required: true },
  address: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  responsiblePerson: { type: String, required: true },
  phone: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  images: { type: [String], required: true },
  needsBus: { type: Boolean, default: false},
  capacity: { type: Number, min: 0 },
  reservedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }],
  reservedCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

// Virtual for available seats
eventSchema.virtual('availableSeats').get(function() {
  return this.capacity ? this.capacity - this.reservedCount : null;
});

const eventModel = mongoose.model("event", eventSchema);
export default eventModel;
