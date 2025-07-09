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



// export const getAllEvents =  handleError(async (req, res, next) => {
// const getAll = await eventModel.find().sort({ date: 1 });
// res.status(200).json({ message: "success", events: getAll });

// })


// export const getEventById = handleError(async (req, res, next) => {
//   const { id } = req.params;

//   const event = await eventModel.findById(id);

//   if (!event) {
//     return res.status(404).json({ message: "Event not found" });
//   }

//   res.status(200).json({ message: "success", event });
// });


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
