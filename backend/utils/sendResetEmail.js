const nodemailer = require('nodemailer');

const sendResetEmail = async (username, to, resetToken) => {
    const resetUrl = resetToken ? `http://localhost:5173/reset-password/${resetToken}` : null;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; border: 1px solid #ddd; padding: 20px; border-radius: 10px; max-width: 600px; margin: 20px auto; background-color: #f9f9f9;">
            <h2 style="color: #0056b3;">Password Reset Request</h2>
            <p style="font-size: 16px;">Dear <strong>${username}</strong>,</p>
            <p style="font-size: 14px;">A reset password request was submitted for your account associated with the email: <strong>${to}</strong>.</p>
            <p style="font-size: 14px;">If you did not make this request, you can safely ignore this email. Otherwise, click the link below to reset your password:</p>
            <p style="text-align: center; font-size: 16px;"><a href="${resetUrl}" style="color: #007bff; text-decoration: none;">${resetUrl}</a></p>
            <p style="margin-top: 30px; font-size: 12px; color: #888;">Note: This is a system-generated email. Please do not reply. If you encounter any issues resetting your password, kindly contact the System Administrator.</p>
        </div>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Password Reset Request',
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
