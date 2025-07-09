import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  category: { type: String, required: true, enum: ["event", "trip"] },
  date: { type: Date, required: true },
  address: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  responsiblePerson: { type: String, required: true },
  phone: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
  needsBus: { type: Boolean },
  capacity: { type: Number },
reservedUsers: [{
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "user" 
  },
  userName: {
    type: String
  }               
}]
   reservedCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const eventModel = mongoose.model("event", eventSchema);
export default eventModel;
