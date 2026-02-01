const nodemailer = require('nodemailer');

// Verify transporter on startup
const transporter = nodemailer.createTransport({
    service: 'gmail', // Using the existing configuration style
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

// Test email connection
transporter.verify((error, success) => {
    if (error) {
        console.log('Email transporter error:', error.message);
    } else {
        console.log('Email transporter ready:', success);
    }
});

const sendWelcomeEmail = async (email, firstName) => {
    try {
        const mailOptions = {
            from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
            to: email,
            subject: 'Welcome to Our Platform!',
            html: `
        <h1>Welcome ${firstName}!</h1>
        <p>Your account has been successfully created.</p>
        <p>You can now login to your account.</p>
        <p>Best regards,<br>The Team</p>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✓ Welcome email sent to', email, 'Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('✗ Error sending email to', email, ':', error.message);
        // Don't throw error to prevent registration failure
        return { success: false, error: error.message };
    }
};

module.exports = { sendWelcomeEmail };
