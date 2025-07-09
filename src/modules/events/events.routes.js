import express from "express";
import multer from 'multer';
import { auth, authorizeRoles } from "../../middleware/auth.js";
import { validation } from "../../middleware/Validation.js";
import { createEvent,getAllEvents,getEventById,deleteEvent,getEventReservedsById,getAllEventsReserveds} from "./events.controller.js";
import {eventValidation} from "./events.validation.js"
import { storage } from "../../utils/cloudinary.config.js"; // تأكد من مسار الملف الصحيح

const eventsRouter = express.Router();
const upload = multer({ storage}); // استخدام الذاكرة لتخزين الملفات مؤقتًا


eventsRouter.post("/addEvent",auth(),authorizeRoles("Admin", "SuperAdmin"),upload.array ("images"),createEvent);
eventsRouter.get("/getAllEvents",getAllEvents);
eventsRouter.get("/getAllEventsReserveds",,auth(),authorizeRoles("Admin", "SuperAdmin"),getAllEventsReserveds);
eventsRouter.get("/getEventById/:id",getEventById);
eventsRouter.get("/getEventReservedsById/:id",auth(),authorizeRoles("Admin", "SuperAdmin"),getEventReservedsById);
eventsRouter.delete("/deleteEvent/:id",auth(),authorizeRoles("Admin", "SuperAdmin"),deleteEvent);
 
export default eventsRouter;

getAllEventsReserveds 



