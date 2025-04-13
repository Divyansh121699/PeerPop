const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../services/recommendation.service');

// Get skill recommendations for a user
router.get('/skills/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`Received recommendation request for user: ${userId}`);
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        const recommendations = await getRecommendations(userId);
        console.log(`Successfully generated recommendations for user: ${userId}`);
        res.json(recommendations);
    } catch (error) {
        console.error('Error in recommendation route:', error);
        res.status(500).json({ 
            error: 'Failed to generate recommendations',
            message: error.message || 'Unknown error',
            details: error.stack
        });
    }
});

module.exports = router; 