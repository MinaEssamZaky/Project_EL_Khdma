import express from "express";
import { AppError } from "../../utils/AppError.js";
import { handleError } from "../../middleware/HandleError.js";
import memoryModel from "../../../DataBase/models/memory.model.js";


export const createMemory = handleError(async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access Denied", 403));
  }
  const { memoryTitle, date } = req.body;

  // استقبال الصور من الحقول الصحيحة
  const mainImageFile = req.files?.mainImage?.[0];
  const galleryFiles = req.files?.galleryImages || [];

  if (!mainImageFile) {
    return next(new AppError("Main Image Is Required", 400));
  }
  if (!galleryFiles.length) {
    return next(new AppError("Gallery Images Are Required", 400));
  }

  const galleryImages = galleryFiles.map(file => file.path);

  const newMemory = await memoryModel.create({
    memoryTitle,
    date,
    mainImage: mainImageFile.path,
    galleryImages
  });

  res.status(201).json({ message: "Memory created successfully", memory: newMemory });
});


export const getAllMemories =  handleError(async (req, res, next) => {
const getAll = await memoryModel.find();
res.status(200).json({ message: "success", memories: getAll });

})


export const getMemoryById = handleError(async (req, res, next) => {
  const { id } = req.params;

  const memory = await memoryModel.findById(id);

  if (!memory) {
    return res.status(404).json({ message: "Memory not found" });
  }

  res.status(200).json({ message: "success", memory });
});


export const deleteMemory = handleError(async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access Denied", 403));
  }

  const { id } = req.params;

  const deletedMemory = await memoryModel.findByIdAndDelete(id);

  if (!deletedMemory) {
    return res.status(404).json({ message: "Memory not found" });
  }

  res.status(200).json({ message: "Memory deleted successfully" });
});
