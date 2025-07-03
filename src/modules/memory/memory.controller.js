
 import express from "express";
import { AppError } from "../../utils/AppError.js";
import { handleError } from "../../middleware/HandleError.js";


export const uploadImage = handleError(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("No images were uploaded", 400));
  }
   const images = req.files.map(file => file.path);
  
      res.status(200).json({message: 'Images uploaded successfully',imageUrls: images});
});

