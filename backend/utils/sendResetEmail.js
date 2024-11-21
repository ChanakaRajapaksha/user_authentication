const nodemailer = require('nodemailer');

const sendResetEmail = async (email, resetToken) => {
    const resetUrl = `http://localhost:5000/auth/reset-password/${resetToken}`;

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
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
