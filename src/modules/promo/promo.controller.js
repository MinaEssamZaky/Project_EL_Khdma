import { PromoCodeModel } from "../../../DataBase/models/promoCode.model.js";
import userModel from "../../../DataBase/models/user.model.js";
import { handleError } from "../../middleware/HandleError.js";
import { AppError } from "../../utils/AppError.js";

// ✅ Create
export const createPromoCode = handleError(async (req, res, next) => {
      if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
          return next(new AppError("Access Denied", 403));
      }
  
  const { promoCode, value, expiresAt, usageLimit, isActive } = req.body;

  const newPromo = await PromoCodeModel.create({
    promoCode,
    value,
    expiresAt,
    usageLimit,
    isActive,
  });

  res.status(201).json({
    message: "Promo code created successfully",
    promo: newPromo,
  });
});

// ✅ Apply
export const applyPromoCode = handleError(async (req, res, next) => {
  const { promoCode } = req.body;
  const userId = req.user._id;

  if (!promoCode) return next(new AppError('Promo code is required', 400));

  const promo = await PromoCode.findOne({ promoCode, isActive: true });
  if (!promo) return next(new AppError('Invalid or inactive promo code', 404));
  if (promo.expiresAt && promo.expiresAt < new Date())
    return next(new AppError('Promo code has expired', 400));

  const user = await userModel.findById(userId);
  if (!user) return next(new AppError('User not found', 404));

  if (hasUsedPromo(user, promoCode))
    return next(new AppError('You have already used this promo code', 400));

  const previousBalance = user.wallet;
  user.wallet += promo.value;

  // Save transaction in wallet history
  user.walletHistory.push({
    amount: promo.value,
    operation: 'promo',
    description: code,
    previousBalance,
    newBalance: user.wallet,
    createdAt: new Date(),
    performedBy: {
      adminId: userId,
      adminName: user.userName,
      adminRole: user.role,
    },
    walletOwner: {
      userId,
      userName: user.userName,
    },
  });

  await user.save();

  // ✅ Decrease usage limit if available
  if (promo.usageLimit > 0) {
    promo.usageLimit -= 1;
    await promo.save();
  }

  res.status(200).json({
    message: 'Promo code applied successfully',
    addedValue: promo.value,
    walletBalance: user.wallet,
  });
});

// ✅ Get all
export const getAllPromoCodes = handleError(async (req, res, next) => {
  const promos = await PromoCodeModel.find();
  res.json({ message: "done", promos });
});

// ✅ Get by ID
export const getPromoCodeById = handleError(async (req, res, next) => {
  const { id } = req.params;
  const promo = await PromoCodeModel.findById(id);
  if (!promo) return next(new AppError("Promo code not found", 404));
  res.json(promo);
});

// ✅ Delete

export const deletePromoCode = handleError(async (req, res, next) => {
      if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
        return next(new AppError("Access Denied", 403));
    }

  const { id } = req.params;
  const promo = await PromoCodeModel.findByIdAndDelete(id);
  if (!promo) return next(new AppError("Promo code not found", 404));
  res.json({ message: "Promo code deleted successfully" });
});

// ✅ Update

export const updatePromoCode = handleError(async (req, res, next) => {
      if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
        return next(new AppError("Access Denied", 403));
    }

  const { id } = req.params;
  const { promoCode, value, expiresAt, usageLimit, isActive } = req.body;

  const updatedPromo = await PromoCodeModel.findByIdAndUpdate(
    id,
    { promoCode, value, expiresAt, usageLimit, isActive },
    { new: true }
  );

  if (!updatedPromo) return next(new AppError("Promo code not found", 404));

  res.json({
    message: "Promo code updated successfully",
    promo: updatedPromo,
  });
});
