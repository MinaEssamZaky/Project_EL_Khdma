import { attendanceModel } from "../../../DataBase/models/attendance.model.js";
import express from 'express';
import userModel from '../../../DataBase/models/user.model.js';
import { handleError } from '../../middleware/HandleError.js';
import { AppError } from '../../utils/AppError.js';
import xlsx from "xlsx"; // تحتاج تثبيت مكتبة xlsx

export const createMeeting = handleError(async (req, res, next) => {
if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({ message: "Access Denied" });
}

const { title, date } = req.body;

  // جلب كل المستخدمين
const allUsers = await userModel.find({}, "_id");

  // إضافة كل المستخدمين كغياب في البداية
const records = allUsers.map(user => ({
    user: user._id,
    status: "Absent" // الافتراضي غياب
}));

  // إنشاء ميتينج جديد
const meeting = await attendanceModel.create({ title, date, records });

res.status(201).json({ message: "Meeting created", meeting });
});


export const markAttendance = handleError(async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({ message: "Access Denied" });
}

  const { id } = req.params;   
  const { userId, attendedMass, confessed } = req.body;        

  // هات الميتينج
  const meeting = await attendanceModel.findById(id);
  if (!meeting) {
    return next(new AppError("Meeting not found", 404));
  }

  // شوف هل المستخدم موجود في الـ records
  const record = meeting.records.find(r => r.user.toString() === userId);
  if (!record) {
    return next(new AppError("User not found in this meeting", 404));
  }

  record.status = "Present";
  record.time = new Date();
  if (typeof attendedMass !== "undefined") record.attendedMass = attendedMass;
  if (typeof confessed !== "undefined") record.confessed = confessed;

  await meeting.save();

  res.status(200).json({ message: "Attendance marked successfully", meeting });
});

export const getMeetingById = handleError(async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({ message: "Access Denied" });
  }

  const { id } = req.params;

  // ✅ استخدم populate بشكل صحيح
  const meeting = await attendanceModel.findById(id)
    .populate({
      path: "records.user",
      select: "userName"  // هيا دي اللي هترجع بس اسم اليوزر
    });

  if (!meeting) {
    return res.status(404).json({ message: "Meeting not found" });
  }

  res.json({ message: "done", meeting });
});


export const getAllMeetings = handleError(async (req, res) => {
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({ message: "Access Denied" });
}

  const meetings = await attendanceModel.find().select("title date");
  res.json({message :"done", meetings } );


})

