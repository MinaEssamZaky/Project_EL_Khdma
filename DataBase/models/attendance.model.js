// attendance.model.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  records: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
      time: { type: Date }, // وقت تسجيل الحضور
      attendedMass: { type: Boolean, default: false }, // حضر القداس
      confessed: { type: Boolean, default: false },    // اعترف
    },
  ],
});

export const attendanceModel = mongoose.model("Attendance", attendanceSchema);
