const nodemailer = require('nodemailer');

const sendResetEmail = async (email, resetToken) => {
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h1>Password Reset Request</h1>
            <p>Hi,</p>
            <p>We received a request to reset your password. Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you didn’t request this, you can ignore this email.</p>
            <p>Thanks,</p>
            <p>Your Team</p>
        </div>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
