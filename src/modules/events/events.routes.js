import express from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import { validation } from "../../middleware/Validation.js";
import { createEvent,getAllEvents,getEventById,deleteEvent} from "./events.controller.js";
import {eventValidation} from "./events.validation.js"

const eventsRouter = express.Router();

eventsRouter.post("/addEvent",auth(),authorizeRoles("Admin", "SuperAdmin"),createEvent);
eventsRouter.get("/getAllEvents",auth(),getAllEvents);
eventsRouter.get("/getEventById/:id",auth(),getEventById);
eventsRouter.post("/deleteEvent/:id",auth(),authorizeRoles("Admin", "SuperAdmin"),deleteEvent);

export default eventsRouter;

