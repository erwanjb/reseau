import mailer from "nodemailer";

const transport = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

export default transport;