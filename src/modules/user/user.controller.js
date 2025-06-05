import express from 'express';
import userModel from '../../../DataBase/models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { handleError } from '../../middleware/HandleError.js';
import { AppError } from '../../utils/AppError.js';
import { sendMail } from '../../emails/sendEmail.js';

export const signUp = handleError(async (req, res,next) => {
const { userName, email, password, phone} = req.body;

const existingUser = await userModel.findOne({ email });
if (existingUser) {
    return next(new AppError("Email already exists",400));
}else {
    const saltRounds = parseInt(process.env.SALT_ROUNDS)
        const hashedPassword = await bcrypt.hashSync (password, saltRounds);
                    const emailToken = jwt.sign({ email }, process.env.TOKEN, { expiresIn: "5m" });
                    await sendMail(email, emailToken);
    const user = await userModel.create({userName,email,password:hashedPassword,phone});
    // Assuming sendMail is a function that sends a verification email
    user? res.status(200).json({message: "User created successfully", user}): res.status(400).json({message: "Error creating user"})
    
}})


export const LogIn = handleError(async (req,res,next)=>{
    const {email,password} = req.body;
    
    const User= await userModel.findOne({email})
    if(!User){
            return next(new AppError("User Not Exist",400));
    }
    if (!User.isConfirmed) {
        return next(new AppError("Please verify your email first", 401));
    }
    const MatchPassword= bcrypt.compareSync(password,User.password)
    if(!MatchPassword){
                    return next(new AppError("Wrong Password",400));
    }
    const token =jwt.sign({id:User._id,email:User.email},process.env.TOKEN,{expiresIn:"24h"})
    res.status(200).json({message:"Done",token})
}
)

export const VerifyEmail = handleError(async (req, res, next) => {
    const { token } = req.query;
    if (!token) {
        return next(new AppError("Token is required", 400));
    }
    const decoded = jwt.verify(token, process.env.TOKEN);
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    user.isConfirmed = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
});

export const resendVerifyEmail = handleError(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    if (user.isConfirmed) {
        return next(new AppError("Email already verified", 400));
    }
    const emailToken = jwt.sign({ email }, process.env.TOKEN, { expiresIn: "3m" });
    await sendMail(email, emailToken);
    return res.status(200).json({ message: "Verification email resent successfully" });
});

    export const changePassword = handleError(async(req,res,next)=>{
            const {oldPassword,newPassword} = req.body
        const user = await userModel.findById(req.user._id)
            if(!user){
            return next(new AppError("you should be logged in to change your password",400));
            }
            if(!oldPassword || !newPassword){
                    return next(new AppError("please Enter old and new password",400));
            }
            const match = bcrypt.compareSync(oldPassword,user.password)
            if(!match){
                            return next(new AppError("old password is not correct",400));
            }
            if(oldPassword === newPassword){
                    return next(new AppError("new password should be different from old password",400));
            }
            const saltRounds = parseInt(process.env.NEW_SALTROUNDS)
            const hashedPassword = bcrypt.hashSync(newPassword,saltRounds)
            user.password = hashedPassword
            const updatedUser = await user.save()           
                return res.status(200).json({message:"password changed",user:updatedUser})
        })


export const Updated = handleError(async (req,res,next)=>{
    const { userName, email ,phone} = req.body
    const user = await userModel.findById(req.user._id)

        if (!user) {
                return next(new AppError("User not found",400));
    }

    if (userName) {
        if(user.userName == userName){
        return next(new AppError("UserName already exists",400));
        }
        user.userName = userName;
    }

    if (email) {
        const existingUser = await userModel.findOne({ email });
        if(user.email == email||existingUser){
        return next(new AppError("Email already exists",400));
        }
        user.email = email;
    }

    if (phone) {
                const existingPhone = await userModel.findOne({ phone });
        if(user.phone == phone||existingPhone){
        return next(new AppError("Phone already exists",400));
        }
        user.phone = phone;
    }
    const updatedUser = await user.save();
    return res.status(200).json({ message: 'Done', user: updatedUser });
})


export const Deleted = handleError(async (req, res,next) => {
        if (req.user.role !== 'SuperAdmin' ) {
        return next(new AppError("Access Denied", 403));
    }
    else{
            const user = await userModel.findById(req.user._id)
    if (!user) {
                return next(new AppError("User not found",400));
    }
    await userModel.findByIdAndDelete(req.user._id); // حذف المستخدم فعليًا
    return res.status(200).json({ message: "User Deleted" });
    }
    
})


export const GitAllUsers = handleError(async (req, res, next) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
        return next(new AppError("Access Denied", 403));
    }
    const users = await userModel.find({ role: 'User' });
    return res.status(200).json({ message: "All Users", users });
});


export const GitAllAdmins = handleError(async (req, res, next) => {
    if (req.user.role !== 'SuperAdmin' ) {
        return next(new AppError("Access Denied", 403));
    }
    const users = await userModel.find({ role: 'Admin' });
    return res.status(200).json({ message: "All Admin", users });
});


export const UpdatedRole = handleError(async (req, res, next) => {
    const {_id,role } = req.body;
    if (req.user.role !== 'SuperAdmin') {
        return next(new AppError("Access Denied", 403));
    }
    const user = await userModel.findById(_id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    if (role) {
        if (role !== 'Admin' && role !== 'User') {
            return next(new AppError("Invalid role", 400));
        }
        user.role = role;
    }
    const updatedUser = await user.save();
    return res.status(200).json({ message: 'Role updated successfully', user: updatedUser });


})