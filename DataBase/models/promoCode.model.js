import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
promoCode: {
    type: String,
    required: true,
    unique: true
},
value: {
    type: Number,
    required: true
},
expiresAt: {
    type: Date,
    required: true
},
usageLimit: {
    type: Number, 
    default: 1,
},
isActive: {
    type: Boolean,
    default: true
}
}, { timestamps: true });

export const PromoCodeModel = mongoose.model('PromoCode', promoCodeSchema);