// npm install nodemailer
import nodemailer from "nodemailer"
import { emailTemplate } from "./emailTemplate.js";
import { auth } from '../middleware/auth.js';

export const sendMail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "minaessam856@gmail.com",
            pass: "myqrasdcklowicsw",
        }, 
    });
    const info = await transporter.sendMail({
        from: '"Mina Essam" <minaessam856@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line 
        html: emailTemplate(token) // html body
    });

    console.log("Message sent: %s", info.messageId);
}