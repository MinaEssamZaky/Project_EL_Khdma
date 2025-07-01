import eventModel from "../../../DataBase/models/events.model.js";
import userModel from "../../../DataBase/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { handleError } from "../../middleware/HandleError.js";

export const createEvent = handleError(async (req, res, next) => {
   if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin' ) {return next(new AppError("Access Denied", 403));}
  
            const user = await userModel.findById(req.user._id)
                if(!user){return next(new AppError("User not found",404));}

  
  const { eventName, category, date, address, shortDescription, fullDescription, responsiblePerson, phone, price,images } = req.body;

  const newEvent = await eventModel.create({
    eventName,
    category,
    date,
    address,
    shortDescription,
    fullDescription,
    responsiblePerson,
    phone,
    price,
    images,
  });

  res.status(201).json({ message: "Event created successfully", event: newEvent });
});
