import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (email, token, resetLink = null) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ugmmeeting@gmail.com",
                pass: "zeswnfgzblbgvyvx", 
            },
        });

        const subject = resetLink
            ? "Reset Your Password"
            : "Welcome To The UGM Meeting";

        const html = resetLink
            ? `<h3>Click the link below to reset your password:</h3>
               <a href="${resetLink}" target="_blank">${resetLink}</a>
               <p>This link will expire in 10 minutes.</p>`
            : emailTemplate(token); 

        const info = await transporter.sendMail({
            from: '"UGM Meeting" <ugmmeeting@gmail.com>',
            to: email,
            subject,
            html,
        });

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
