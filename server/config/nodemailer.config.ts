import { google } from "googleapis";
import  mailer from "nodemailer";

const OAuth2 = google.auth.OAuth2;

const myOAuth2Client = new OAuth2(
    process.env.CLIENT_ID_GMAIL,
    process.env.SECRET_GMAIL,
    "https://developers.google.com/oauthplayground"
);

myOAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN_GMAIL
});

const transport = async () => {
    const myAccessToken = await myOAuth2Client.getAccessToken();
    return mailer.createTransport({
        service: "GMAIL",
        auth: {
            type: "OAuth2",
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.CLIENT_ID_GMAIL,
            clientSecret: process.env.SECRET_GMAIL,
            refreshToken: process.env.REFRESH_TOKEN_GMAIL,
            accessToken: myAccessToken
        },
    } as any);
}

export default transport;