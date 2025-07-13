import express from 'express';
import {createBookingByWallet,deleteBooking,createBookingByProof,updateBookingStatus,getPendingBookingsForAdmin,getAllBookingsForAdmin,getAllBookingsForUser } from "./booking.controller.js"
import multer from 'multer';   
import { auth, authorizeRoles } from "../../middleware/auth.js";
import { storage } from '../../utils/cloudinary.config.js';
const upload = multer({ storage});
const bookingRouter = express.Router();

bookingRouter.post("/bookingByWallet",auth(),createBookingByWallet)
bookingRouter.post("/bookingByProof",auth() ,upload.single('screenshot'),createBookingByProof)
bookingRouter.delete("/deleteBooking/:id",auth(),authorizeRoles("Admin","SuperAdmin"),deleteBooking) 
bookingRouter.patch("/updateStatus/:id",auth(),authorizeRoles("Admin", "SuperAdmin"),updateBookingStatus);
bookingRouter.get("/pendingBookings",auth(),authorizeRoles("Admin", "SuperAdmin"),getPendingBookingsForAdmin);
bookingRouter.get("/getAllBookings",auth(),authorizeRoles("Admin", "SuperAdmin"),getAllBookingsForAdmin);
bookingRouter.get("/getAllBookingsForUser",auth(),getAllBookingsForUser);
export default  bookingRouter
