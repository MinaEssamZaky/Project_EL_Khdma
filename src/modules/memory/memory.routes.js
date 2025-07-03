import express from 'express';
import multer from 'multer';
import { createMemory, deleteMemory, getAllMemories, getMemoryById,  } from './memory.controller.js'; // تأكد من مسار الملف الصحيح
import { storage } from '../../utils/cloudinary.config.js';
import { auth, authorizeRoles } from '../../middleware/auth.js';

const memoryRouter = express.Router();
// إعداد multer لرفع الملفات باستخدام Cloudinary
const upload = multer({ storage}); // استخدام الذاكرة لتخزين الملفات مؤقتًا

memoryRouter.post("/createMemory",auth(),authorizeRoles("Admin", "SuperAdmin"),upload.fields([{ name: 'mainImage', maxCount: 1 },{ name: 'galleryImages' }]) ,createMemory);
memoryRouter.get("/getAllMemories",auth(),getAllMemories);
memoryRouter.get("/getMemoryById/:id",auth() ,getMemoryById);
memoryRouter.delete("/deleteMemory/:id",auth(),authorizeRoles("Admin", "SuperAdmin"),deleteMemory);

export default memoryRouter;
