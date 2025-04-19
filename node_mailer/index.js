require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendMailService() {
    try {

        const data = await transporter.sendMail({
            from: '"Wingfi Support" <mail@web.shipsar.in>',
            to: "be1newinner@gmail.com",
            subject: "Welcome Mail!",
            text: "HOW ARE YOU! TESTING MAIL!",
        });
        console.log(data)
    } catch (error) {
        console.error(error)
    }
}


sendMailService()