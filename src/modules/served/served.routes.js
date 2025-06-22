import express from "express";
import { addServed } from "./served.controller.js";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import { validation } from "../../middleware/Validation.js";
import { addServedValidation ,gitAllServeds } from "./served.validation.js";


export const servedRouter = express.Router();

servedRouter.post("/addServed", validation(addServedValidation),auth(),authorizeRoles("Admin"), addServed)
servedRouter.git("/gitAllServeds",auth(),authorizeRoles("Admin,SuperAdmin"), gitAllServeds)
