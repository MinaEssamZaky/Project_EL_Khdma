import express from 'express';
import {changePassword,deleteUserById,GitAllAdmins,GitAllUsers,LogIn,resendVerifyEmail,signUp,Updated,UpdatedRole, VerifyEmail, UpdateWallet,GetMyWalletHistory,GetMyWalletBalance} from './user.controller.js';
import { auth, authorizeRoles } from '../../middleware/auth.js';
import { ChangePasswordSchemaVal, LogInSchemaVal, signUpSchemaVal, UpdatedRoleSchemaVal, UpdateSchemaVal } from './user.validation.js';
import { validation } from '../../middleware/Validation.js';
const userRouter = express.Router();

userRouter.post("/signup",validation(signUpSchemaVal),signUp)
userRouter.post("/login",validation(LogInSchemaVal),LogIn)
userRouter.put("/changePassword",validation(ChangePasswordSchemaVal),auth(),changePassword)
userRouter.get("/verifyEmail", VerifyEmail)
userRouter.post("/resendVerifyEmail",resendVerifyEmail)
userRouter.put("/update",validation(UpdateSchemaVal),auth(),Updated)
userRouter.put("/updatedRole/:id",validation(UpdatedRoleSchemaVal),auth(),authorizeRoles("SuperAdmin"),UpdatedRole)
userRouter.delete("/delete/:id",auth(),authorizeRoles("SuperAdmin"),deleteUserById )
userRouter.get("/gitAllUsers",auth(),authorizeRoles("SuperAdmin","Admin"),GitAllUsers)
userRouter.get("/gitAllAdmins",auth(),GitAllAdmins)
userRouter.put("/updateWallet/:id",auth(),UpdateWallet)
userRouter.get("/getMyWalletHistory",auth(),GetMyWalletHistory)
userRouter.get("/getMyWalletBalance",auth(),GetMyWalletBalance)



export default userRouter;
