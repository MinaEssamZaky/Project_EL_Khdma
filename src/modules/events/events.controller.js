import eventModel from "../../../DataBase/models/events.model.js";
import { AppError } from "../../utils/AppError.js";
import { handleError } from "../../middleware/HandleError.js";

export const createEvent = handleError(async (req, res, next) => {
  const { eventName, category, date, address, shortDescription, fullDescription, responsiblePerson, phone, price } = req.body;

  if (!req.files || req.files.length === 0) {
    return next(new AppError("Images are required", 400));
  }

  const images = req.files.map(file => file.path); // استخراج روابط الصور من Cloudinary

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
