import Joi from "joi"

const signUpSchemaVal = Joi.object({
    firstName: Joi.string().min(2).max(10).required(),
    secName: Joi.string().min(2).max(10).required(),
    familyName: Joi.string().min(2).max(10).required(),
    email: Joi.string().email({ tlds: { allow: ["com"] } }).required(),
    password: Joi.string().min(6).required(),
    rePassword: Joi.valid(Joi.ref("password")).required(),
    phone: Joi.string().length(11).required(),
});

const LogInSchemaVal = Joi.object({
    email: Joi.string().email({ tlds: { allow: ["com"] } }).required(),
    password: Joi.string().required(),
});

const ChangePasswordSchemaVal = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
});

const UpdateSchemaVal = Joi.object({
    email: Joi.string().email({ tlds: { allow: ["com"] } }),
    phone: Joi.string().length(11),
});

const UpdatedRoleSchemaVal = Joi.object({
    role: Joi.string().valid("Admin", "User").required(),
});

export {
    signUpSchemaVal,
    LogInSchemaVal,
    UpdateSchemaVal,
    ChangePasswordSchemaVal,
    UpdatedRoleSchemaVal,
};
