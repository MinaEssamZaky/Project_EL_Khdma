import express from 'express';
import userModel from '../../../DataBase/models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { handleError } from '../../middleware/HandleError.js';
import { AppError } from '../../utils/AppError.js';
import { sendMail } from '../../emails/sendEmail.js';

export const signUp = handleError(async (req, res,next) => {
const { userName, email, password, phone} = req.body;

const existingUser = await userModel.findOne({ email });
if (existingUser) {
    return next(new AppError("Email already exists",400));
}else {
    const saltRounds = parseInt(process.env.SALT_ROUNDS)
        const hashedPassword =bcrypt.hashSync (password, saltRounds);
                    const emailToken = jwt.sign({ email }, process.env.TOKEN, { expiresIn: "10m" });
                    await sendMail(email, emailToken);
    const user = await userModel.create({userName,email,password:hashedPassword,phone});
    // Assuming sendMail is a function that sends a verification email
    user? res.status(200).json({message: "User created successfully", user}): res.status(400).json({message: "Error creating user"})

 
}

})


export const LogIn = handleError(async (req, res, next) => {
    const { email, password } = req.body;

    const User = await userModel.findOne({ email })
        .populate({
            path: 'bookings',
            populate: {
                path: 'event',
                select: 'eventName date status',
                options: { retainNullValues: true }
            }
        });

    if (!User) {
        return next(new AppError("User Not Exist", 400));
    }
    if (!User.isConfirmed) {
        return next(new AppError("Please verify your email first", 401));
    }
    const MatchPassword = bcrypt.compareSync(password, User.password);
    if (!MatchPassword) {
        return next(new AppError("Wrong Password", 400));
    }

    const token = jwt.sign({ id: User._id, email: User.email }, process.env.TOKEN, { expiresIn: "24h" });

    const formattedBookings = User.bookings.map(booking => {
        const eventName = booking.event?.eventName || booking.eventName || "Event Not Available ";
        const eventDate = booking.event?.date || "Date not available";
        return {
            _id: booking._id,
            eventName,
            eventDate,
            status: booking.status,
            paymentMethod: booking.paymentMethod,
            amount: booking.amount
        };
    });

    res.status(200).json({
        message: "Done",
        Id: User._id,
        userName: User.userName,
        token,
        Role: User.role,
        wallet: User.wallet,
        Bookings: formattedBookings 
    });
});

export const getAllBookingsForUser = handleError(async (req, res, next) => {
    const userId = req.user._id;
    const user = await userModel.findById(userId)
        .populate({
            path: 'bookings',
            populate: {
                path: 'event',
                select: 'eventName date status',
                options: { retainNullValues: true }
            }
        });

    if (!user) {
        return next(new AppError("User not found", 404));
    }
    const formattedBookings = user.bookings.map(booking => ({
        _id: booking._id,
        eventName: booking.event?.eventName || booking.eventName || "Event Not Available",
        eventDate: booking.event?.date || "Date not available",
        status: booking.status,
        paymentMethod: booking.paymentMethod,
        amount: booking.amount
    }));
    res.status(200).json({
        message: "All bookings retrieved successfully",
        count: formattedBookings.length,
        Bookings: formattedBookings
    });
});



export const VerifyEmail = handleError(async (req, res, next) => {
    const { token } = req.query;
    if (!token) {
        return next(new AppError("Token is required", 400));
    }
    const decoded = jwt.verify(token, process.env.TOKEN);
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    user.isConfirmed = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
});

export const resendVerifyEmail = handleError(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    if (user.isConfirmed) {
        return next(new AppError("Email already verified", 400));
    }
    const emailToken = jwt.sign({ email }, process.env.TOKEN, { expiresIn: "3m" });
    await sendMail(email, emailToken);
    return res.status(200).json({ message: "Verification email resent successfully" });
});

    export const changePassword = handleError(async(req,res,next)=>{
            const {oldPassword,newPassword} = req.body
        const user = await userModel.findById(req.user._id)
            if(!user){
            return next(new AppError("you should be logged in to change your password",400));
            }
            if(!oldPassword || !newPassword){
                    return next(new AppError("please Enter old and new password",400));
            }
            const match = bcrypt.compareSync(oldPassword,user.password)
            if(!match){
                            return next(new AppError("old password is not correct",400));
            }
            if(oldPassword === newPassword){
                    return next(new AppError("new password should be different from old password",400));
            }
            const saltRounds = parseInt(process.env.NEW_SALTROUNDS)
            const hashedPassword = bcrypt.hashSync(newPassword,saltRounds)
            user.password = hashedPassword
            const updatedUser = await user.save()           
                return res.status(200).json({message:"password changed",user:updatedUser})
        })


export const Updated = handleError(async (req,res,next)=>{
    const { userName, email ,phone} = req.body
    const user = await userModel.findById(req.user._id)

        if (!user) {
                return next(new AppError("User not found",400));
    }

    if (userName) {
        if(user.userName == userName){
        return next(new AppError("UserName already exists",400));
        }
        user.userName = userName;
    }

    if (email) {
        const existingUser = await userModel.findOne({ email });
        if(user.email == email||existingUser){
        return next(new AppError("Email already exists",400));
        }
        user.email = email;
    }

    if (phone) {
                const existingPhone = await userModel.findOne({ phone });
        if(user.phone == phone||existingPhone){
        return next(new AppError("Phone already exists",400));
        }
        user.phone = phone;
    }
    const updatedUser = await user.save();
    return res.status(200).json({ message: 'Done', user: updatedUser });
})


export const deleteUserById = handleError(async (req, res, next) => {
  if (req.user.role !== 'SuperAdmin') {
    return next(new AppError("Access Denied", 403));
  }

  const targetUserId = req.params.id;
  const user = await userModel.findById(targetUserId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await userModel.findByIdAndDelete(targetUserId);
  return res.status(200).json({ message: "User Deleted Successfully" });
});



export const GitAllUsers = handleError(async (req, res, next) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
        return next(new AppError("Access Denied", 403));
    }
    const users = await userModel.find({ role: 'User' });
    return res.status(200).json({ message: "All Users", users });

});


export const GitAllAdmins = handleError(async (req, res, next) => {
    const admins = await userModel.find({ role: 'Admin' });
    return res.status(200).json({ message: "All Admin", admins });
});


export const UpdatedRole = handleError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError("User ID is required", 400));
    }
    const {role } = req.body;
    if (req.user.role !== 'SuperAdmin') {
        return next(new AppError("Access Denied", 403));
    }
    const user = await userModel.findById(id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    if (role) {
        if (role !== 'Admin' && role !== 'User') {
            return next(new AppError("Invalid role", 400));
        }
        user.role = role;
    }
    const updatedUser = await user.save();
    return res.status(200).json({ message: 'Role updated successfully', user: updatedUser });


})


export const UpdateWallet = handleError(async (req, res, next) => {
  const { id } = req.params;
  const { amount, operation, description } = req.body;

  if (!id) return next(new AppError("User ID is required", 400));

  const user = await userModel.findById(id);
  if (!user) return next(new AppError("User not found", 404));

  if (!amount || isNaN(amount) || amount <= 0) {
    return next(new AppError("Please enter a valid positive amount", 400));
  }

  if (!['add', 'remove'].includes(operation)) {
    return next(new AppError("Invalid operation. Use 'add' or 'remove'", 400));
  }

  const numAmount = Number(amount);
  const previousBalance = user.wallet; 
  let newBalance = previousBalance;

  let transactionDescription = description?.trim() || "";

  if (operation === 'add') {
    newBalance += numAmount;
    if (!transactionDescription) {
      transactionDescription = `Deposit by ${req.user.userName} (${req.user.role})`;
    }
  } else if (operation === 'remove') {
    if (user.wallet < numAmount) {
      return next(new AppError("Insufficient wallet balance", 400));
    }
    newBalance -= numAmount;
    if (!transactionDescription) {
      transactionDescription = `Withdrawal by ${req.user.userName} (${req.user.role})`;
    }
  }

  // Update the wallet
  user.wallet = newBalance;

  user.walletHistory.push({
    amount: numAmount,
    operation,
    description: transactionDescription,
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
    newBalance,      
    createdAt: new Date()
  });

  const updatedUser = await user.save();

  res.status(200).json({
    message: 'Wallet updated successfully',
    newBalance: updatedUser.wallet,
    lastTransaction: updatedUser.walletHistory.at(-1)
  });
});


export const GetMyWalletHistory = handleError(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);
    
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    const sortedHistory = [...user.walletHistory].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({ 
        message: 'My wallet history',
        walletHistory: sortedHistory, 
        currentBalance: user.wallet,
         totalTransactions: user.walletHistory.length
    });
});

export const GetMyWalletBalance = handleError(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ message: 'My wallet balance',balance: user.wallet});
});

export const ClearWalletHistory = handleError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.walletHistory = [];
  await user.save();

  res.status(200).json({
    message: "Wallet history cleared successfully",
    userId: user._id,
    remainingBalance: user.wallet
  });
});

export const GetRole = handleError(async (req, res, next) => {
    const user = await userModel.findById(req.user._id); 
    if (!user) return next(new AppError("User not found", 404));

    return res.status(200).json({ message: "User Role", role: user.role });
});
