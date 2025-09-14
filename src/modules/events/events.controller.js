import eventModel from "../../../DataBase/models/events.model.js";
import { AppError } from "../../utils/AppError.js";
import { handleError } from "../../middleware/HandleError.js";

export const createEvent = handleError(async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access Denied", 403));
  }
  
  const { 
    eventName, 
    category, 
    date, 
    address, 
    shortDescription, 
    fullDescription, 
    responsiblePerson, 
    phone, 
    price,
    needsBus,
    capacity
  } = req.body;

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
    needsBus,
    capacity,
    images
  });

  res.status(201).json({ message: "Event created successfully", event: newEvent });
});

export const getAllEventsReserveds = handleError(async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access Denied", 403));
  }

  const events = await eventModel.find()
    .sort({ createdAt: -1 }) 
    .populate({
      path: 'reservedUsers',
      select: 'userName phone',
      populate: {
        path: 'bookings',
        select: 'paymentMethod status createdAt event',
        match: { event: { $exists: true } } 
      }
    });

  const result = events.map(event => ({
    ...event._doc,
    capacity: event.capacity,
    reservedCount: event.reservedUsers.length
  }));

  res.status(200).json({ 
    message: "Events retrieved successfully",
    count: events.length,
    events: result
  });
});
export const getAllEvents = handleError(async (req, res, next) => {
  const events = await eventModel.find().sort({ createdAt: -1 });
  res.status(200).json({ message: "success", events });
});

export const getEventReservedsById = handleError(async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access Denied", 403));
  }
  
  const { id } = req.params;
  
  const event = await eventModel.findById(id).populate({
    path: 'reservedUsers',
    select: 'userName phone bookings',
    populate: {
      path: 'bookings',
      match: { event: id },
      select: '_id paymentMethod status createdAt paidAmount comment totalAmount'
    }
  });

  if (!event) {
    return next(new AppError("Event not found", 404));
  }
  const enrichedEvent = {
    ...event._doc,
    capacity: event.capacity,
    reservedCount: event.reservedUsers.length,
    reservedUsers: event.reservedUsers.map(user => ({
      _id: user._id, // إضافة user id إذا كنت تريده
      userName: user.userName,
      phone: user.phone,
      bookingInfo: user.bookings && user.bookings.length > 0 ? {
        bookingId: user.bookings[0]._id, // إضافة bookingId هنا
        paymentMethod: user.bookings[0].paymentMethod,
        status: user.bookings[0].status,
        createdAt: user.bookings[0].createdAt
      } : null
    }))
  };
  res.status(200).json({ 
    message: "success", 
    event: enrichedEvent 
  });
});

export const getEventById = handleError(async (req, res, next) => {
  const { id } = req.params;
  const event = await eventModel.findById(id);

  if (!event) {
    return next(new AppError("Event not found", 404));
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
    return next(new AppError("Event not found", 404));
  }

  res.status(200).json({ message: "Event deleted successfully" });
});
