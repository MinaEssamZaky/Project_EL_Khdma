import eventModel from "../../../DataBase/models/events.model.js";
import userModel from "../../../DataBase/models/user.model.js";
import bookingModel from "../../../DataBase/models/bookings.model.js";
import { AppError } from "../../utils/AppError.js";
import { handleError } from "../../middleware/HandleError.js";
export const createBookingByWallet = handleError(async (req, res, next) => {
  const { eventId, totalAmount } = req.body;
  const userId = req.user._id;

  if (!eventId || totalAmount === undefined) {
    return next(new AppError('Missing required booking information', 400));
  }

  const event = await eventModel.findById(eventId);
  if (!event) return next(new AppError('Event not found', 404));

  if (event.capacity && event.reservedCount >= event.capacity) {
    return next(new AppError('Event is fully booked', 400));
  }

  if (event.reservedUsers.includes(userId)) {
    return next(new AppError('You have already booked this event', 400));
  }

  const user = await userModel.findById(userId);
  if (!user) return next(new AppError('User not found', 404));

  if (user.wallet < totalAmount) {
    return next(new AppError('Insufficient wallet balance', 400));
  }

  const previousBalance = user.wallet;
  const newBalance = previousBalance - totalAmount;

  // خصم المبلغ وتسجيله
  user.wallet = newBalance;

  user.walletHistory.push({
    totalAmount: totalAmount,
    operation: 'remove',
    description: `Booking for event: ${event.eventName}`,
    performedBy: {
      adminId: user._id,
      userName: user.userName,
      adminRole: user.role
    },
    walletOwner: {
      userId: user._id,
      userName: user.userName
    },
    previousBalance,
    newBalance,
    createdAt: new Date()
  });

  // تحديث الحدث
  event.reservedUsers.push(userId);
  event.reservedCount = event.reservedUsers.length;

  // إنشاء الحجز
  const booking = await bookingModel.create({
    user: userId,
    event: eventId,
    paymentMethod: 'wallet',
    status: 'approved',
    totalAmount: totalAmount,
    eventName: event.eventName,
    userName: user.userName
  });

  user.bookings.push(booking._id);

  await user.save();
  await event.save();

  res.status(201).json({
    message: 'Booking approved successfully',
    booking
  });
});


export const createBookingByProof = handleError(async (req, res, next) => {
  const { eventId, userId, adminId, responsiblePerson, totalAmount } = req.body;

  if (!req.file) {
    return next(new AppError("Payment Image Is Required"));
  }

  const screenshotPath = req.file.path;

  // التحقق من وجود الحدث
  const event = await eventModel.findById(eventId);
  if (!event) {
    return next(new AppError('Event Not Found', 404));
  }

  // التحقق من وجود المستخدم
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new AppError('User Not Found', 404));
  }

  // التحقق من عدم وجود حجز سابق
  const existingBooking = await bookingModel.findOne({
    user: userId,
    event: eventId,
    status: { $in: ["pending", "approved"] }
  });
  if (existingBooking) {
    return next(new AppError('You have already booked this event', 400));
  }
  const eventName = event.eventName;
  const userName = user.userName;

  const newBooking = await bookingModel.create({
    user: userId,
    event: eventId,
    admin: adminId,
    paymentMethod: "proof",
    status: "pending",
    totalAmount: totalAmount,
    screenshot: screenshotPath,
    responsiblePerson,
    eventName,
    userName
  });

  user.bookings.push(newBooking._id);
  await user.save();

  res.status(201).json({
    message: 'Successfully Send booking And Wait Approve By Admin',
    booking: newBooking
  });
});

export const updateBookingStatus = handleError(async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access Denied", 403));
  }

  const { id } = req.params; 
  const { status, paidAmount, comment } = req.body; 

  if (!["approved", "rejected", "partiallyApproved"].includes(status)) {
    return next(new AppError("Invalid status value", 400));
  }

  const booking = await bookingModel.findById(id);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.status !== "pending") {
    return next(new AppError("You can only update bookings with pending status", 400));
  }

  if (booking.admin && booking.admin.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to update this booking", 403));
  }

  booking.status = status;

  if (status === "approved" || status === "partiallyApproved") {
    const event = await eventModel.findById(booking.event);
    if (!event) {
      return next(new AppError("Associated event not found", 404));
    }

    if (event.capacity && event.reservedCount >= event.capacity) {
      return next(new AppError("Event is fully booked", 400));
    }

    if (!event.reservedUsers.includes(booking.user.toString())) {
      event.reservedUsers.push(booking.user);
      event.reservedCount = event.reservedUsers.length;
      await event.save();
    }

    // 🟢 في حالة الدفع الكامل
    if (status === "approved") {
      booking.paidAmount = booking.totalAmount;
      booking.remainingAmount = 0;
      booking.paymentStatus = "Paid in Full";
      booking.comment = null;
    }

    // 🟢 في حالة الدفع الجزئي
    if (status === "partiallyApproved") {
      if (typeof paidAmount !== "number" || paidAmount <= 0) {
        return next(new AppError("Paid amount is required and must be greater than 0", 400));
      }
      if (!comment) {
        return next(new AppError("Comment is required for partially approved bookings", 400));
      }

      booking.paidAmount += paidAmount;

      if (booking.paidAmount >= booking.totalAmount) {
        booking.paymentStatus = "Paid in Full";
        booking.remainingAmount = 0;
        booking.status = "approved"; // لو دفع المبلغ كله نغيرها لـ approved
        booking.comment = null;
      } else {
        booking.paymentStatus = "Partially Paid";
        booking.remainingAmount = booking.totalAmount - booking.paidAmount;
        booking.comment = comment;
      }
    }

    // إضافة الحجز للمستخدم
    const user = await userModel.findById(booking.user);
    if (user && !user.bookings.includes(booking._id)) {
      user.bookings.push(booking._id);
      await user.save();
    }
  }

  await booking.save();

  res.status(200).json({
    message: `Booking ${status} successfully`,
    booking: {
      id: booking._id,
      status: booking.status,
      totalAmount: booking.totalAmount,
      paidAmount: booking.paidAmount,
      remainingAmount: booking.remainingAmount,
      paymentStatus: booking.paymentStatus,
      comment: booking.comment,
      user: booking.user,
      event: booking.event,
    }
  });
});


export const deleteBooking = handleError(async (req, res, next) => {
  if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
    return next(new AppError("Access Denied", 403));
  }

  const { id } = req.params;

  const booking = await bookingModel.findById(id).lean();
  if (!booking) return next(new AppError("Booking not found", 404));

  const user = await userModel.findById(booking.user);

  if (!user) return next(new AppError("User not found", 404));

  user.bookings.pull(booking._id);
  
  let refundProcessed = false;

  if (booking.status === 'approved') {
    await eventModel.findByIdAndUpdate(booking.event, {
      $pull: { reservedUsers: booking.user },
      $inc: { reservedCount: -1 }
    });

    if (booking.paymentMethod === 'wallet') {
      const previousBalance = user.wallet;
      user.wallet += booking.amount;
      user.walletHistory.push({
        amount: booking.amount,
        operation: 'add',
        description: `Refund for cancelled booking: ${booking.eventName}`,
        performedBy: {
          adminId: req.user._id,
          adminName: req.user.userName,
          adminRole: req.user.role
        },
        walletOwner: {
          userId: user._id,
          userName: user.userName
        },
        previousBalance,
        newBalance: user.wallet,
        createdAt: new Date()
      });
      refundProcessed = true;
    }
  }

  await user.save();
  await bookingModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
    refundProcessed
  });
});


export const getPendingBookingsForAdmin = handleError(async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access Denied", 403));
  }
  const pendingBookings = await bookingModel.find({
    status: "pending",
    admin: req.user._id
  }).populate("user", "userName phone") 
  res.status(200).json({
    message: "Pending bookings",
    count: pendingBookings.length,
    bookings: pendingBookings
  });
});

export const getAllBookingsForAdmin = handleError(async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access Denied", 403));
  }
  const allBookings = await bookingModel.find({admin: req.user._id}).populate("user", "userName phone") 
  res.status(200).json({
    message: "All bookings",
    count: allBookings.length,
    bookings: allBookings
  });
});

