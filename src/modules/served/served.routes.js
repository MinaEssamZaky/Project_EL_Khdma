import express from "express";
import { addServed , getAllServeds ,updateServed,deleteServed} from "./served.controller.js";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import { validation } from "../../middleware/Validation.js";
import { addServedValidation ,updateServedValidation  } from "./served.validation.js";


export const servedRouter = express.Router();

servedRouter.post("/addServed", validation(addServedValidation),auth(),authorizeRoles("Admin"), addServed)
servedRouter.get("/getAllServeds", auth(), authorizeRoles("Admin", "SuperAdmin"), getAllServeds);
servedRouter.put('/updateServed/:id',  validation(updateServedValidation),auth(), authorizeRoles("Admin", "SuperAdmin"), updateServed);
servedRouter.delete("/deleteServed/:id", auth(), authorizeRoles("Admin", "SuperAdmin"), deleteServed);

