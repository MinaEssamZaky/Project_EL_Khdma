import Joi from "joi";

export const addServedValidation = Joi.object({
    firstName:Joi.string().min(2).max(10),
    secondName:Joi.string().min(2).max(10),
    familyName:Joi.string().min(2).max(10),
    fullName: Joi.string().min(2).max(20),
    Birthdate: Joi.date().required(),
    email: Joi.string().email({ tlds: { allow: ["com"] } }).required(),
    address: Joi.string().min(5).max(50).required(),
    address2: Joi.string().min(5).max(50).allow('', null), // Allow empty or null
    mobileNumber1: Joi.string().length(11).required().pattern(/^[0-9]+$/),
    mobileNumber2: Joi.string().length(11).empty().allow(null).pattern(/^[0-9]*$/).optional(), // Allow empty or null
    IsExpatriate: Joi.boolean(),
    Landline: Joi.string().length(9).empty().allow(null).pattern(/^[0-9]*$/).optional(),
    Church: Joi.string().min(2).max(50).required(),
    priestName: Joi.string().min(2).max(50),
    collegeOrInstitute: Joi.string().min(2).max(50),
    governorateOfBirth: Joi.string().min(2).max(50),
    maritalStatus: Joi.string().valid("Single", "Married", "Engaged").required(),
    Cohort: Joi.string().min(2).max(50),
    Profession: Joi.string().min(2).max(50).allow('', null),
});