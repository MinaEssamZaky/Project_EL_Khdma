import express from 'express';
import {createBookingByWallet} from "../booking.controller.js"
import multer from 'multer';
import { auth, authorizeRoles } from "../../middleware/auth.js";
import { storage } from "../../utils/cloudinary.config.js"; // تأكد من مسار الملف الصحيح

const bookingRouter = express.Router();

bookingRouter.Post("/BookingByWallet",auth(),createBookingByWallet)
