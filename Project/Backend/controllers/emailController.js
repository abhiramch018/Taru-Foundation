const sendEmail = require("../utils/mailer");

const sendTestEmail = async (req, res) => {
    try {
        const { to } = req.body;

        if (!to) {
            return res.status(400).json({
                message: "Recipient email is required"
            });
        }

        await sendEmail({
            to,
            subject: "Taru Foundation - Test Email",
            text: "This is a test email from Taru Foundation.",
            html: `
                <h2>Taru Foundation</h2>
                <p>This is a test email from the Taru Foundation backend.</p>
            `
        });

        return res.status(200).json({
            message: "Test email sent successfully"
        });

    } catch (error) {
        console.error("Test email error:", error);

        return res.status(500).json({
            message: "Failed to send test email"
        });
    }
};

module.exports = {
    sendTestEmail
};