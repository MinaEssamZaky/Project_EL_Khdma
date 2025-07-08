import Joi from "joi";

export const eventValidation = Joi.object({
  eventName: Joi.string().min(3).max(50).required(),
  category: Joi.string().valid("event", "trip").required(),
  date: Joi.date().greater("now").required(), 
  address: Joi.string().min(5).max(100).required(),
  shortDescription: Joi.string().min(10).max(200).required(),
  fullDescription: Joi.string().min(2).max(1000).required(),
  responsiblePerson: Joi.string().min(3).max(50).required(),
  phone: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
  price: Joi.number().min(0).required(),
  images: Joi.array().items(Joi.string()).min(1).max(4).required(),
  needBus: Joi.boolean().default(false), 
  capacity: Joi.number().min(1), 
  availableSeats: Joi.number().min(0).max(Joi.ref("capacity")), 
  reservedSeats: Joi.number().min(0).max(Joi.ref("capacity")).default(0), 
});
