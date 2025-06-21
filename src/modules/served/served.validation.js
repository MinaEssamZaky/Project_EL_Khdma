import Joi from "joi";

export const addServedValidation = Joi.object({
    firstName:Joi.string().min(2).max(10).required(),
    secName:Joi.string().min(2).max(10).required(),
    familyName:Joi.string().min(2).max(10).required(),
    fullName: Joi.string().min(2).max(20),
    birthDay: Joi.number().integer().min(1).max(31).required(),
    birthMonth: Joi.number().integer().min(1).max(12).required(),
    birthYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    email: Joi.string().email({ tlds: { allow: ["com"] } }).required(),
    Address: Joi.string().min(5).max(50).required(),
    Address2: Joi.string().min(5).max(50).allow('', null), // Allow empty or null
    mobileNumber1: Joi.string().length(11).required().pattern(/^[0-9]+$/),
    mobileNumber2: Joi.string().length(11).empty('').allow(null).pattern(/^[0-9]*$/).optional(), // Allow empty or null
    isExpatriate: Joi.boolean(),
    landline: Joi.string().length(9).empty('').allow(null).pattern(/^[0-9]*$/).optional(),
    church: Joi.string().min(2).max(50).required(),
    priestName: Joi.string().min(2).max(50),
    college: Joi.string().min(2).max(50),
    governorateOfBirth: Joi.string().min(2).max(50),
    maritalStatus: Joi.string().valid("Single", "Married", "Engaged").required(),
    cohort: Joi.string().min(2).max(50),
    profession: Joi.string().min(2).max(50).allow('', null),
    dayOff: Joi.string().valid("Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday").empty('').allow(null).optional()
});
