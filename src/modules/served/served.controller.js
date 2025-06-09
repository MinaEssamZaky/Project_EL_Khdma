import express from "express";
import { AppError } from "../../utils/AppError.js";
import servedModel from "../../../DataBase/models/servedInformation.model.js";
import { handleError } from "../../middleware/HandleError.js";


export const addServed = handleError(async (req, res, next) => {
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

    if (req.user.role !== 'Admin') {
        return next(new AppError("Access Denied", 403));
    }

    // تجميع الاسم الثلاثي
    const fullName = `${firstName} ${secondName} ${familyName}`;

    const addServed = await servedModel.create({
        fullName, // فقط الاسم الثلاثي
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
    });

    res.status(201).json({ message: "Done", addServed });
});