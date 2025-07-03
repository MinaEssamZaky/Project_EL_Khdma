import express from "express";
import { AppError } from "../../utils/AppError.js";
import { handleError } from "../../middleware/HandleError.js";

// ✅ دالة رفع الصور من Cloudinary
export const uploadImage = handleError(async (req, res, next) => {
  // 🔍 التحقق من وجود ملفات مرفوعة
  if (!req.files || req.files.length === 0) {
    return next(new AppError("No images were uploaded", 400));
  }

  try {
    // 🖼️ استخراج روابط الصور من Cloudinary
    const images = req.files.map(file => file.path);

    // ✅ إرسال الرد للفرونت
    res.status(200).json({
      message: 'Images uploaded successfully',
      imageUrls: images
    });

  } catch (error) {
    // ❌ التعامل مع أي خطأ أثناء معالجة الصور
    res.status(500).json({
      message: 'Upload failed',
      error: error.message,         // نص الخطأ الحقيقي
      name: error.name || null,     // نوع الخطأ
      stack: error.stack || null    // تتبع مكان الخطأ
    });
  }
});
