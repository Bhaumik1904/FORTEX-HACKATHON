const nodemailer = require("nodemailer");

// Create a test account to use Ethereal Email (no API key needed)
let testAccount = null;
let transporter = null;

async function initMailer() {
    if (transporter) return;

    try {
        testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        console.log("📧 Notification Service Ready");
        console.log(`📧 Test Account: ${testAccount.user}`);

    } catch (error) {
        console.error("❌ Failed to init mailer:", error);
    }
}

// Initialize on load
initMailer();

async function sendStatusUpdateEmail(userEmail, userName, complaintCategory, newStatus) {
    if (!transporter) await initMailer();

    try {
        const info = await transporter.sendMail({
            from: '"Fortex Admin" <admin@fortex.com>',
            to: userEmail,
            subject: `Complaint Status Updated: ${newStatus}`,
            text: `Hello ${userName},\n\nYour complaint regarding "${complaintCategory}" has been updated to: ${newStatus}.\n\nPlease check your dashboard for more details.\n\nRegards,\nFortex Admin`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333;">Complaint Status Update</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Your complaint regarding <strong>"${complaintCategory}"</strong> has been updated.</p>
          <p>New Status: <span style="background-color: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${newStatus}</span></p>
          <br/>
          <p>Please log in to your dashboard to view more details.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #777; font-size: 12px;">This is an automated message from the Fortex Early Warning System.</p>
        </div>
      `,
        });

        console.log("✅ Email sent: %s", info.messageId);
        console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return nodemailer.getTestMessageUrl(info);

    } catch (error) {
        console.error("❌ Error sending email:", error);
        return null;
    }
}

module.exports = { sendStatusUpdateEmail };
