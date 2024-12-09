const prisma = require('../database/prismaClient');
const logger = require('../logger');

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

        // Create new user
        const newUser = await prisma.masterUser.create({
            data: {
                empId,
                role,
                name,
                email,
                mobile,
                branch,
                status: "Active",
            },
        });

        logger.info(`User added successfully: ${newUser.empId}`);
        res.status(201).json({ success: `User ${newUser.name} created with ID ${newUser.empId}`, ...newUser });
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

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found." });
        }

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        logger.error(`Error fetching users: ${err.message}`);
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
            message: "User details updated successfully."
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
