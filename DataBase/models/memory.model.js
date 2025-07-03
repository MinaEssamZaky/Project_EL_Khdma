import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
memoryTitle:{ type: String, required: true },
date:      { type: Date , required: true },
mainImage: { type: String, required: true },
galleryImages: { type: [String], required: true }
}, { timestamps: true });

const memoryModel = mongoose.model("memory", memorySchema);
export default memoryModel;
