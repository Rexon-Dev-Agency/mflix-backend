import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, RESET_PASSWORD_REDIRECT_URL, } from "../env.js";
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    },
});
export const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `"Mflix" <${SMTP_USER}>`,
        to,
        subject,
        html,
    });
};
//# sourceMappingURL=email.js.map