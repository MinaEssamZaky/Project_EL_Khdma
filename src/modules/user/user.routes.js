import express from 'express';
import {  changePassword,  Deleted,  LogIn, signUp, Updated, VerifyEmail,  } from './user.controller.js';
import { auth } from '../../middleware/auth.js';
import { ChangePasswordSchemaVal, LogInSchemaVal, signUpSchemaVal, UpdateSchemaVal } from './user.validation.js';
import { validation } from '../../middleware/Validation.js';
const userRouter = express.Router();

userRouter.post("/signUp",validation(signUpSchemaVal),signUp)
userRouter.post("/LogIn",validation(LogInSchemaVal),LogIn)
userRouter.put("/changePassword",validation(ChangePasswordSchemaVal),auth(),changePassword)
userRouter.get("/VerifyEmail", VerifyEmail)
userRouter.put("/update",validation(UpdateSchemaVal),auth(),Updated)
userRouter.delete("/Deleted",auth(),Deleted)





export default userRouter;