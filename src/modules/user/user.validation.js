import Joi from "joi"

const signUpSchemaVal = Joi.object({
    userName: Joi.string().min(2).max(20).required(),
    email: Joi.string().email({ tlds: { allow: ["com"] } }).required(),
    password: Joi.string().required(),
    rePassword: Joi.valid(Joi.ref('password')).required(),
    phone: Joi.string().length(11).required(),
})

const LogInSchemaVal = Joi.object({
    email: Joi.string().email({ tlds: { allow: ["com"] } }).required(),
    password: Joi.string().required(),
})

const ChangePasswordSchemaVal = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
})



const UpdateSchemaVal = Joi.object({
    userName: Joi.string().min(2).max(20),
    email: Joi.string().email({ tlds: { allow: ["com"] } }),
    phone: Joi.string().length(11),
})

const UpdatedRoleSchemaVal = Joi.object({
    role: Joi.string().valid( "Admin", "User").required()
})


export {
    signUpSchemaVal,
    LogInSchemaVal,
    UpdateSchemaVal,
    ChangePasswordSchemaVal,
    UpdatedRoleSchemaVal
}