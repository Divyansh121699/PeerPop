const Request = require('../models/request.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// JWT secret key - should match the one in authController
const JWT_SECRET = 'your-secret-key-here';

//get all requests for the authenticated user
async function getAllRequests (req, res) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify and decode token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        // Find requests for this user
        const requests = await Request.find({ userId })
            .populate('userId', 'name major') // Populate user details
            .sort({ createdAt: -1 });
            
        if (!requests || requests.length === 0) {
            return res.json([]);
        }
        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(404).json({ message: "Could not fetch request records" });
    }
}

//get request by id
async function getRequestById (req, res) {
    try {
        const request = await Request.findById(req.params.id)
            .populate('userId', 'name major');
        res.status(200).json(request);
    } catch (error) {
        res.status(404).json("Could not fetch request records");
    }
};

//create request
async function createRequest (req, res) {
    try {
        console.log('Received request data:', req.body);
        
        const { learnSubject, userId, skills } = req.body;

        // Validate required fields
        if (!learnSubject || !userId || !skills) {
            return res.status(400).json({
                message: "Missing required fields",
                received: { learnSubject, userId, skills }
            });
        }

        // Create new request
        const request = new Request({
            learnSubject,
            userId,
            skills: skills.map(skill => ({
                name: skill.name,
                rating: skill.rating || []
            }))
        });

        const savedRequest = await request.save();
        console.log('Saved request:', savedRequest);

        res.status(201).json(savedRequest);
    } catch (error) {
        console.error('Error in createRequest:', error);
        res.status(400).json({
            message: "Could not create request",
            error: error.message
        });
    }
};

//delete request
async function deleteRequest (req, res) {
    try {
        const request = await Request.findByIdAndDelete(req.params.id);
        res.status(200).json(request);
    } catch (error) {
        res.status(404).json("Could not delete request records");
    }
};


module.exports = {
    getAllRequests,
     getRequestById,
      createRequest,
       deleteRequest};