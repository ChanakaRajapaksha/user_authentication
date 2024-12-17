const prisma = require('../database/prismaClient');
const logger = require('../logger');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const generateRandomPassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const length = 12; // Set desired password length
    return Array.from({ length }, () =>
        charset.charAt(Math.floor(Math.random() * charset.length))
    ).join("");
};

const sendEmail = async (to, subject, body) => {
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
        subject,
        text: body,
    };

    await transporter.sendMail(mailOptions);
};

const handleNewUser = async (req, res) => {
    const { role, name, email, mobile, branch } = req.body;

    // Backend Validation
    if (!role || !name || !email || !mobile || !branch) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check for duplicate email or mobile
        const duplicateEmail = await prisma.masterUser.findUnique({ where: { email } });
        if (duplicateEmail) {
            return res.status(409).json({ message: "Email already exists." });
        }

        // Generate unique EmpId with EMP prefix
        const userCount = await prisma.masterUser.count();
        const empId = `EMP${(userCount + 1).toString().padStart(5, "0")}`;

        // Generate a random password and hash it
        const plainPassword = generateRandomPassword();
        console.log('Generated Plain Password:', plainPassword);
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        console.log('Generated Hashed Password:', hashedPassword);

        // Create new user
        const newUser = await prisma.masterUser.create({
            data: {
                empId,
                role,
                name,
                email,
                mobile,
                branch,
                masterPassword: hashedPassword,
                status: "Active",
            },
        });

        // Send email with login credentials
        const loginURL = "http://localhost:5173/login"; 
        const emailBody = `
            Dear ${name},

            Your account has been successfully created. Here are your login details:

            Email: ${email}
            Password: ${plainPassword}

            Login URL: ${loginURL}

            Please log in and change your password as soon as possible.

            Best regards,
            Admin Team
        `;

        await sendEmail(email, "Your Login Credentials", emailBody);

        logger.info(`User added successfully: ${newUser.empId}`);
        res.status(201).json({
            ...newUser,
            message: "Master user details added successfully."
        });
    } catch (err) {
        console.error(err);
        logger.error(`Error adding user: ${err.message}`);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.masterUser.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found." });
        }

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

const editUser = async (req, res) => {
    const { empId } = req.params;
    const updatedUserData = req.body;

    try {
        const updatedUser = await prisma.masterUser.update({
            where: { empId: empId }, 
            data: updatedUserData, 
        });

        res.json({
            ...updatedUser,
            message: "Master user details updated successfully."
        });
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

const updateUserStatus = async (req, res) => {
    const { empId } = req.params;
    const { status } = req.body; 

    try {
        const updatedUser = await prisma.masterUser.update({
            where: { empId: empId },
            data: { status: status }, 
        });

        res.json({
            ...updatedUser,
            message: `User status updated to ${status} successfully.`,
        });
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

module.exports = { handleNewUser, getAllUsers, editUser, updateUserStatus };
