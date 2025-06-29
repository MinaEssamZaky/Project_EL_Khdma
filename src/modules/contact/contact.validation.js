import Joi from "joi"

export const addMessageValidation= joi.object ({
  userName= joi.string().min(5).max(20).required(),
  message= joi.string().max(500).required(),
   phone= joi.string().min(11).max(11).required()
})
