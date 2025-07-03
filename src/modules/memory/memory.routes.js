import express from 'express';
import multer from 'multer';
import { uploadImage } from './memory.controller.js'; // تأكد من مسار الملف الصحيح
import { storage } from '../../utils/cloudinary.config.js';

const uploadRouter = express.Router();
// إعداد multer لرفع الملفات باستخدام Cloudinary
const upload = multer({ storage}); // استخدام الذاكرة لتخزين الملفات مؤقتًا

uploadRouter.post('/uploadPhotos', upload.array('image'), uploadImage);

export default uploadRouter;
