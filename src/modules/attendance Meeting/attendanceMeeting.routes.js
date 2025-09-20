import express from 'express';
import { auth, authorizeRoles } from '../../middleware/auth.js';
import { createMeeting, markAttendance,getMeetingById, getAllMeetings,deleteMeeting } from './attendanceMeeting.controller.js';
const attendanceRouter = express.Router();

attendanceRouter.post("/createMeeting",auth(),authorizeRoles("SuperAdmin","Admin",),createMeeting)
attendanceRouter.patch ("/markAttendance/:id",auth(),authorizeRoles("SuperAdmin","Admin",),markAttendance)
attendanceRouter.get ("/getMeetingById/:id",auth(),authorizeRoles("SuperAdmin","Admin","User"),getMeetingById)
attendanceRouter.get ("/getAllMeetings",auth(),authorizeRoles("SuperAdmin","Admin","User"),getAllMeetings)
attendanceRouter.delete ("/deleteMeeting/:id",auth(),authorizeRoles("SuperAdmin","Admin","User"),deleteMeeting)




export default attendanceRouter;
