import express from 'express';
import {  changePassword,  Deleted,  GitAllAdmins,  GitAllUsers,  LogIn, resendVerifyEmail, signUp, Updated, UpdatedRole, VerifyEmail,  } from './user.controller.js';
import { auth, authorizeRoles } from '../../middleware/auth.js';
import { ChangePasswordSchemaVal, LogInSchemaVal, signUpSchemaVal, UpdatedRoleSchemaVal, UpdateSchemaVal } from './user.validation.js';
import { validation } from '../../middleware/Validation.js';
const userRouter = express.Router();

userRouter.post("/signup",validation(signUpSchemaVal),signUp)
userRouter.post("/login",validation(LogInSchemaVal),LogIn)
userRouter.put("/changePassword",validation(ChangePasswordSchemaVal),auth(),changePassword)
userRouter.get("/verifyEmail", VerifyEmail)
userRouter.post("/resendVerifyEmail",auth(),resendVerifyEmail)
userRouter.put("/update",validation(UpdateSchemaVal),auth(),Updated)
userRouter.put("/updatedRole",validation(UpdatedRoleSchemaVal),auth(),authorizeRoles("SuperAdmin"),UpdatedRole)
userRouter.delete("/delete",auth(),authorizeRoles("SuperAdmin"),Deleted)
userRouter.get("/gitAllUsers",auth(),authorizeRoles("SuperAdmin","Admin"),GitAllUsers)
userRouter.get("/gitAllAdmins",auth(),authorizeRoles("SuperAdmin"),GitAllAdmins)






export default userRouter;