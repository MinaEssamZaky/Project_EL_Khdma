import Joi from "joi"

export const addServedValidation = joi.object({
    firstName: Joi.string().min(2).max(20).required(),
    secondName: Joi.string().min(2).max(20).required(),
    familyName: Joi.string().min(2).max(20).required(),
    Birthdate: Joi.date().required(),
    email: Joi.string().email({ tlds: { allow: ["com"] } }).required(),
    address: Joi.string().min(5).max(50).required(),
    address2: Joi.string().min(5).max(50),
    mobileNumber1: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
    mobileNumber2: Joi.string().length(11).pattern(/^[0-9]+$/),
    IsExpatriate: Joi.boolean().required(),
    Landline: Joi.string().length(11).pattern(/^[0-9]+$/),
    Church: Joi.string().min(2).max(50).required(),
    priestName: Joi.string().min(2).max(50),
    collegeOrInstitute: Joi.string().min(2).max(50),
    governorateOfBirth: Joi.string().min(2).max(50),
    maritalStatus: Joi.string().valid("Single", "Married", "Divorced", "Widowed").required(),
    Cohort: Joi.string().min(2).max(50),
    Profession: Joi.string().min(2).max(50)
});