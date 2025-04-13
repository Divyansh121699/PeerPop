const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// JWT secret key - should match the one in authController
const JWT_SECRET = 'your-secret-key-here';

// Get all users (excluding sensitive information)
const getAllUsers = async (req, res) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        jwt.verify(token, JWT_SECRET);

        // Find all users and exclude sensitive information
        const users = await User.find({}, {
            password: 0, // Exclude password
            email: 0,    // Exclude email
            __v: 0       // Exclude version key
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Error fetching users' });
    }
};

module.exports = {
    getAllUsers
}; 