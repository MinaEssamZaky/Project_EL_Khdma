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
        secondName,
        familyName,
        Birthdate,
        email,
        address,
        address2,
        mobileNumber1,
        mobileNumber2,
        IsExpatriate,
        Landline,
        Church,
        priestName,
        collegeOrInstitute,
        governorateOfBirth,
        maritalStatus,
        Cohort,
        Profession
    } = req.body;

    const fullNameArray = [firstName, secondName, familyName];
    const fullName = fullNameArray.join(' ');
    const newServed = await servedModel.create({
        fullName, 
        Birthdate,
        email,
        address,
        address2,
        mobileNumber1,
        mobileNumber2,
        IsExpatriate,
        Landline,
        Church,
        priestName,
        collegeOrInstitute,
        governorateOfBirth,
        maritalStatus,
        Cohort,
        Profession,
        creatorId: req.user._id
    });

    res.status(201).json({ message: "Successfully", served: newServed });
});