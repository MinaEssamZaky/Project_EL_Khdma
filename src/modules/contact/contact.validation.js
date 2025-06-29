import Joi from "joi"

export const addMessageValidation= Joi.object ({
  userName:Joi.string().min(5).max(20).required(),
  message:Joi.string().max(500).required(),
   phone :Joi.string().min(11).max(11).required()
})
