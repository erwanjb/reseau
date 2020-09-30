import { google } from "googleapis";
import  mailer from "nodemailer";


const transport = mailer.createTransport({
    service: "GMAIL",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

export default transport;