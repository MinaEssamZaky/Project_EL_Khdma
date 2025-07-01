import express from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import { validation } from "../../middleware/Validation.js";
import { createEvent } from "./events.controller.js";
import {eventValidation} from "./events.validation.js"

const eventRoute = express.Router();

eventRoute.post("/addEvent",auth(),authorizeRoles("Admin", "SuperAdmin"),createEvent);

export default eventRoute;

