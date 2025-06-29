import express from "express";
import { addMessage , getAllMessage ,deleteMessage} from "./contact.controller.js";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import { validation } from "../../middleware/Validation.js";
import { addMessageValidation } from "./contact.validation.js";


export const contactRouter = express.Router();

contactRouter.post("/addMessage", validation(addMessageValidation),auth(),authorizeRoles("SuperAdmin"),addMessage)
contactRouter.get("/getAllMessage", auth(), authorizeRoles("SuperAdmin"), getAllMessage);
contactRouter.delete("/deleteMessage/:id", auth(), authorizeRoles("SuperAdmin"), deleteMessage);

