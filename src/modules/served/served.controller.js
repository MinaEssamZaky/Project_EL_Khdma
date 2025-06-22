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
        profession,
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
        profession,
        creatorId: req.user._id,
        dayOff,


    });

    res.status(201).json({ message: "Successfully", served: newServed });
});


export const getAllServeds = handleError(async (req, res, next) => {

          if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin' ) {
        return next(new AppError("Access Denied", 403));
    }
            const user = await userModel.findById(req.user._id)
                if(!user){
                return next(new AppError("User not found",404));
                }
        
        const getAll = await servedModel.find().populate({
  path: "creatorId",
  select: "userName -_id" // حدد الحقول اللي عايزها من المستخدم
});
        res.status(201).json({ message: "Successfully", served: getAll });
})


export const updateServed = handleError(async (req, res, next) => {
  if (!['Admin', 'SuperAdmin'].includes(req.user.role)) {
    return next(new AppError("Access Denied", 403));
  }

  const servedId = req.params.id;
  const served = await servedModel.findById(servedId);
  if (!served) {
    return next(new AppError("Served not found", 404));
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
    profession,
    dayOff
  } = req.body;

  // تحقق من التكرار في الإيميل
  if (email && email !== served.email) {
    const existingUser = await servedModel.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already exists", 400));
    }
    served.email = email;
  }

  // تحقق من التكرار في رقم الهاتف
  if (mobileNumber1 && mobileNumber1 !== served.mobileNumber1) {
    const existingPhone = await servedModel.findOne({ mobileNumber1 });
    if (existingPhone) {
      return next(new AppError("Phone already exists", 400));
    }
    served.mobileNumber1 = mobileNumber1;
  }

 if (mobileNumber2 && mobileNumber2 !== served.mobileNumber2) {
    const existingPhone = await servedModel.findOne({ mobileNumber2 });
    if (existingPhone) {
      return next(new AppError("Phone already exists", 400));
    }
    served.mobileNumber2 = mobileNumber2;
  }
        
  // تحديث باقي الحقول
  if (firstName) served.firstName = firstName;
  if (secName) served.secName = secName;
  if (familyName) served.familyName = familyName;
  if (birthDay) served.birthDay = birthDay;
  if (birthMonth) served.birthMonth = birthMonth;
  if (birthYear) served.birthYear = birthYear;
  if (Address) served.Address = Address;
  if (Address2) served.Address2 = Address2;
  if (isExpatriate !== undefined) served.isExpatriate = isExpatriate;
  if (landline) served.landline = landline;
  if (church) served.church = church;
  if (priestName) served.priestName = priestName;
  if (college) served.college = college;
  if (governorateOfBirth) served.governorateOfBirth = governorateOfBirth;
  if (maritalStatus) served.maritalStatus = maritalStatus;
  if (cohort) served.cohort = cohort;
  if (profession) served.profession = profession;
  if (dayOff) served.dayOff = dayOff;

  // تحديث الاسم الكامل
  const fullNameArray = [served.firstName, served.secName, served.familyName];
  served.fullName = fullNameArray.join(" ");

  const updatedServed = await served.save();

  return res.status(200).json({ message: 'Updated Successfully', served: updatedServed });
});
