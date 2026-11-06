const nodemailer = require("nodemailer");
const dns = require("dns");

// Prefer IPv4 DNS resolution
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Nodemailer connection failed:", error);
    } else {
        console.log("Nodemailer is ready to send emails");
    }
});

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Taru Foundation" <${process.env.MAIL_USER}>`,
            to,
            subject,
            text,
            html
        });

        console.log("Email sent:", info.messageId);

        return info;
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

module.exports = sendEmail;