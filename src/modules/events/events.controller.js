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
  const events = await eventModel.find()
    .sort({ createdAt: -1 })
    .populate({
      path: 'reservedUsers',
      select: 'userName email phone',
      populate: {
        path: 'bookings',
        select: 'paymentMethod status createdAt event' 
      }
    });


  res.status(200).json({ 
    message: "Events retrieved successfully",
    count: enrichedEvents.length,
    events: enrichedEvents,
    capacity:event.capacity
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
    select: 'userName email phone bookings',
    populate: {
      path: 'bookings',
      match: { event: id }, // تأكد من أن الحجز مرتبط بهذا الحدث المحدد
      select: 'paymentMethod status createdAt event' // أضفنا event هنا
    }
  });

  if (!event) {
    return next(new AppError("Event not found", 404));
  }

  // إضافة معلومات الحجز لكل مستخدم
  const enrichedEvent = {
    ...event._doc,
    capacity: event.capacity,
    reservedUsers: event.reservedUsers.map(user => {
      // البحث عن الحجز المرتبط بهذا الحدث
      const relatedBooking = user.bookings?.find(booking => 
        booking.event && booking.event.toString() === id
      );
      
      return {
        ...user._doc,
        bookingInfo: relatedBooking ? {
          paymentMethod: relatedBooking.paymentMethod,
          status: relatedBooking.status,
          createdAt: relatedBooking.createdAt
        } : null
      };
    })
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
