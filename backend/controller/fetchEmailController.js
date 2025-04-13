const User = require('../models/user.model');

const fetchUserEmail = async (req, res) => {
    try {
        const { userId } = req.body;

        // Validate that userId is provided
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Find user by ID and only select the email field
        const user = await User.findById(userId).select('email');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            email: user.email
        });
    } catch (error) {
        console.error('Error fetching user email:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user email',
            error: error.message
        });
    }
};

module.exports = {
    fetchUserEmail
};
