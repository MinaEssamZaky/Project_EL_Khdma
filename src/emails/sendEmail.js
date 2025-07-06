// npm install nodemailer
import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (email, token) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }, 
        });

        // Send mail
        const info = await transporter.sendMail({
            from: '"UGM Meeting" <ugmmeeting@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Welcome To The UGM Meeting", // Subject line 
            html: emailTemplate(token) // html body
        });

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw the error for handling in the calling function
    }
};
