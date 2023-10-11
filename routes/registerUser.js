// registerUser.js

const { hash } = require("bcrypt");
const db = require('../lib/db') // Update with the actual path to your database connection

console.log(db);
async function registerUser(req, res) {
    try {
        const { email, username, password } = req.body;

        // Validate fields
        if (!email || !username || !password) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        const existingEmail = await db.user.findUnique({
            where: { email: email },
        });

        if (existingEmail) {
            return res.status(409).json({ user: null, message: "user with the same email already exists" });
        }

        const existingUsername = await db.user.findUnique({
            where: { username: username },
        });

        if (existingUsername) {
            return res.status(409).json({ user: null, message: "user with the same username already exists" });
        }

        const hashedpasskey = await hash(password, 10);
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedpasskey,
            },
        });

        const { password: newuserPassword, ...userResponse } = newUser;

        return res.status(201).json({ user: userResponse, message: "user created successfully" });
    } catch (error) {
        let errorMessage = "Internal Server Error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(500).json({
            message: errorMessage,
            details: error instanceof Error ? error.message : error,
        });
    }
}

module.exports = registerUser;
