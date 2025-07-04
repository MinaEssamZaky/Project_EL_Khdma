import eventModel from "../../../DataBase/models/events.model.js";
import { AppError } from "../../utils/AppError.js";
import { handleError } from "../../middleware/HandleError.js";

export const createEvent = handleError(async (req, res, next) => {
if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access Denied", 403));
  }
  const { eventName, category, date, address, shortDescription, fullDescription, responsiblePerson, phone, price} = req.body;

if (!req.files || req.files.length === 0) {
    return next(new AppError("No images were uploaded", 400));
  }
  const images = req.files.map(file => file.path);

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


export const getAllEvents =  handleError(async (req, res, next) => {
const getAll = await eventModel.find().sort({ date: 1 });
res.status(200).json({ message: "success", events: getAll });

})


export const getEventById = handleError(async (req, res, next) => {
  const { id } = req.params;

  const event = await eventModel.findById(id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.status(200).json({ message: "success", event });
});


export const deleteEvent = handleError(async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access Denied", 403));
  }

  const { id } = req.params;

  const deletedEvent = await eventModel.findByIdAndDelete(id);

  if (!deletedEvent) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.status(200).json({ message: "Event deleted successfully" });
});
