import express from 'express';
import {createBookingByWallet} from "../booking.controller.js"
import auth from "../../utl"
const bookingRouter = express.Router();

bookingRouter.Post("/BookingByWallet",auth(),createBookingByWallet)
