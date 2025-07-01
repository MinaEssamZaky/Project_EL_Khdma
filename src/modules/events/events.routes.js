import express from "express";
import { createEvent } from "./event.controller.js";
import {eventValidation} from "./events.validation.js"

const eventRoute = express.Router();

eventRoute.post("/addEvent",auth(),authorizeRoles("Admin", "SuperAdmin"),createEvent);

export default eventRoute;

