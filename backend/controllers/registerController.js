const prisma = require('../database/prismaClient'); // Import Prisma client
const bcrypt = require('bcrypt');

// Handle new user registration
const handleNewUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
        // Check for duplicate email or username in the database
        const duplicateEmail = await prisma.user.findUnique({ where: { email } });
        const duplicateUsername = await prisma.user.findUnique({ where: { username } });

        if (duplicateEmail) {
            return res.status(409).json({ message: 'Email already exists.' }); // Conflict
        }

        if (duplicateUsername) {
            return res.status(409).json({ message: 'Username already exists.' }); // Conflict
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ success: `New user ${newUser.username} created!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

module.exports = { handleNewUser };
