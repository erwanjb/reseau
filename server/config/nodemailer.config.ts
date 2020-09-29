import mailer from "nodemailer";

const transport = mailer.createTransport('SMTP', {
    service: "Gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

export default transport;