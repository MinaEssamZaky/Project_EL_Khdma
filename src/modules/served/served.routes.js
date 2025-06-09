import express from "express";
import { addServed } from "./served.controller.js";
import { auth, authorizeRoles } from "../../middleware/auth.js";


export const servedRouter = express.Router();

servedRouter.post("/addServed", auth(),authorizeRoles("Admin"), addServed)