import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:    process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'UgmMemoryUploads', // اسم الفولدر على Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => {
      return `${Date.now()}-${file.originalname}`; // اسم مميز لكل صورة
    },
  },
});

export { cloudinary, storage };
