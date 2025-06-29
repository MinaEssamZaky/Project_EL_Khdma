import express from "express";
import { upload } from "../../../utils/fileUpload.js";
import { createEvent } from "./event.controller.js";

const eventRoute = express.Router();

eventRoute.post("/addEvent", upload.array("images", 5), createEvent);

export default eventRoute;

