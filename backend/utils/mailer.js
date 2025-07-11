import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "internkujojo@gmail.com",
        pass: process.env.GMAIL_PASS,
    },
});

export async function sendMail(to, subject, text) {
    const mailOptions = {
        from: 'internkujojo@gmail.com',
        to,
        subject,
        text,
    };
    return transporter.sendMail(mailOptions);
}

