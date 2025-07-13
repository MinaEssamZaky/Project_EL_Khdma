import eventModel from "../../../DataBase/models/events.model.js";
import userModel from "../../../DataBase/models/user.model.js";
import bookingModel from "../../../DataBase/models/bookings.model.js";
import { AppError } from "../../utils/AppError.js";
import { handleError } from "../../middleware/HandleError.js";
export const createBookingByWallet = handleError(async (req, res, next) => {
  const { eventId, eventName, price, userName } = req.body;
  const userId = req.user._id;
  // التحقق من البيانات المطلوبة
  if (!eventId || !eventName || price === undefined) {
    return next(new AppError('Missing required booking information', 400));
  }
  // التحقق من وجود الحدث
  const event = await eventModel.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }
  // التحقق من سعة الحدث
  if (event.capacity && event.reservedCount >= event.capacity) {
    return next(new AppError('Event is fully booked', 400));
  }
  // التحقق من أن المستخدم لم يحجز الحدث مسبقاً
  if (event.reservedUsers.includes(userId)) {
    return next(new AppError('You have already booked this event', 400));
  }
  // التحقق من رصيد المحفظة الكافي
  const user = await userModel.findById(userId);
  if (user.wallet < price) {
    return next(new AppError('Insufficient wallet balance', 400));
  }
  // خصم المبلغ من المحفظة
  user.wallet -= price;
  // تسجيل العملية في تاريخ المحفظة
  user.walletHistory.push({
    amount: price,
    operation: 'remove',
    description: `Booking for event: ${eventName}`,
    performedBy: {
      adminId:  user._id,
      adminName: user.userName,
      adminRole: user.role
    },
    walletOwner: {
      userId: user._id,
      userName: user.userName
    },
    previousBalance: user.wallet + price,
    newBalance: user.wallet,
    createdAt: new Date()
  });
  // تحديث الحدث
  event.reservedUsers.push(userId);
  event.reservedCount = event.reservedUsers.length;
  // إنشاء سجل الحجز
  const booking = await bookingModel.create({
    user: userId,
    event: eventId,
    paymentMethod: 'wallet',
    status: 'approved',
    amount: price,
    eventName,
    userName
  });
  // تحديث المستخدم والحدث
  user.bookings.push(booking._id);
  await user.save();
  await event.save();
  res.status(201).json({message: 'Booking approved successfully',booking});
});



export const createBookingByProof = handleError(async (req, res, next) => {
  const { eventId, userId, adminId, responsiblePerson, price } = req.body;

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
    amount: price,
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
  const { status } = req.body; 

  if (!["approved", "rejected"].includes(status)) {
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

  if (status === "approved") {
    const event = await eventModel.findById(booking.event);
    if (!event) {
      return next(new AppError("Associated event not found", 404));
    }

    if (event.capacity && event.reservedCount >= event.capacity) {
      return next(new AppError('Event is fully booked', 400));
    }

    if (!event.reservedUsers.includes(booking.user.toString())) {
      event.reservedUsers.push(booking.user);
      event.reservedCount = event.reservedUsers.length;
      await event.save();
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
    booking
  });
});

export const deleteBooking = handleError(async (req, res, next) => {
  // التحقق من صلاحية المستخدم
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access Denied", 403));
  }

  const { id } = req.params;

  // 1. البحث عن الحجز أولاً لاستخدام بياناته
  const booking = await bookingModel.findById(id);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  // 2. تحديث المستخدم (إزالة الحجز من قائمة bookings)
  await userModel.findByIdAndUpdate(
    booking.user,
    { $pull: { bookings: booking._id } }
  );

  // 3. إذا كان الحجز معتمداً، نحدث الحدث
  if (booking.status === 'approved') {
    await eventModel.findByIdAndUpdate(
      booking.event,
      {
        $pull: { reservedUsers: booking.user },
        $inc: { reservedCount: -1 }
      }
    );

    // 4. إذا كان الدفع تم بالمحفظة، نسترجع المبلغ
    if (booking.paymentMethod === 'wallet') {
      await userModel.findByIdAndUpdate(
        booking.user,
        {
          $inc: { wallet: booking.amount },
          $push: {
            walletHistory: {
              amount: booking.amount,
              operation: 'add',
              description: `Refund for cancelled booking: ${booking.eventName}`,
              performedBy: {
                adminId: req.user._id,
                adminName: req.user.userName,
                adminRole: req.user.role
              },
              walletOwner: {
                userId: booking.user,
                userName: booking.userName
              },
              previousBalance: (await userModel.findById(booking.user)).wallet - booking.amount,
              newBalance: (await userModel.findById(booking.user)).wallet,
              createdAt: new Date()
            }
          }
        }
      );
    }
  }

  // 5. حذف الحجز أخيراً
  await bookingModel.findByIdAndDelete(id);

  res.status(200).json({ 
    success: true,
    message: "Booking deleted successfully",
    refundProcessed: booking.status === 'approved' && booking.paymentMethod === 'wallet'
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

export const getAllBookingsForUser = handleError(async (req, res, next) => {
  const allBookings = await bookingModel.find({user: req.user._id}).populate("event", "eventName date")
  res.status(200).json({
    message: "All bookings",
    count: allBookings.length,
    bookings: allBookings
  });
});
