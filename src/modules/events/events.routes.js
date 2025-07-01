import express from "express";
import { upload } from "../../../utils/fileUpload.js";
import { createEvent } from "./event.controller.js";

const eventRoute = express.Router();

eventRoute.post("/addEvent",auth(),authorizeRoles("Admin", "SuperAdmin"), upload.array("images", 5), validation(eventValidation),createEvent);

export default eventRoute;

