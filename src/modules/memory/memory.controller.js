  import express from "express";
import { AppError } from "../../utils/AppError.js";
import { handleError } from "../../middleware/HandleError.js";


export const uploadImage = handleError(async (req, res, next) => {
   const images = req.files.map(file => file.path);
  if(!images){
    return AppError({"Upload failed",500})
  }
      res.status(200).json({
      message: 'Images uploaded successfully',
      imageUrls: images
    });
});
