const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JWT secret key - in production, this should be in environment variables
const JWT_SECRET = 'your-secret-key-here';

//verifying user credentials
const loginFunc = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return user data (excluding password) and token
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            major: user.major,
            year: user.year,
            skills_have: user.skills_have,
            // skills_want: user.skills_want,
            token: token
        };

        res.json(userResponse);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

//creating new user entry
const registerFunc = async (req, res) => {
    try {
        const { name, email, password, major, year, skills_have } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            major,
            year,
            skills_have: skills_have || [],
            // skills_want: skills_want || []
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return user data (excluding password) and token
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            major: user.major,
            year: user.year,
            skills_have: user.skills_have,
            // skills_want: user.skills_want,
            token: token
        };

        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerFunc,
    loginFunc
};
