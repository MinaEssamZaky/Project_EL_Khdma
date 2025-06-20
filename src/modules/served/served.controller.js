import express from "express";
import { AppError } from "../../utils/AppError.js";
import servedModel from "../../../DataBase/models/servedInformation.model.js";
import { handleError } from "../../middleware/HandleError.js";
import userModel from "../../../DataBase/models/user.model.js";


export const addServed = handleError(async (req, res, next) => {
        if (req.user.role !== 'Admin') {
        return next(new AppError("Access Denied", 403));
    }
            const user = await userModel.findById(req.user._id)
                if(!user){
                return next(new AppError("User not found",404));
                }

    
    const {
        firstName,
        secName,
        familyName,
        birthDay,
        birthMonth,
        birthYear,
        email,
        Address,
        Address2,
        mobileNumber1,
        mobileNumber2,
        isExpatriate,
        landline,
        church,
        priestName,
        college,
        governorateOfBirth,
        maritalStatus,
        cohort,
        Profession,
        dayOff
    } = req.body;


    const fullNameArray = [firstName, secName, familyName];
    const fullName = fullNameArray.join(' ');
    const newServed = await servedModel.create({
        fullName,
        birthDay,
        birthMonth,
        birthYear,
        email,
        Address,
        Address2,
        mobileNumber1,
        mobileNumber2,
        isExpatriate,
        landline,
        church,
        priestName,
        college,
        governorateOfBirth,
        maritalStatus,
        cohort,
        Profession,
        creatorId: req.user._id,
        dayOff,


    });

    res.status(201).json({ message: "Successfully", served: newServed });
});