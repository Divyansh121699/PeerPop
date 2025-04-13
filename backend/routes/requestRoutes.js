const express = require('express');
const router = express.Router();
const { createRequest, getAllRequests, getRequestById, deleteRequest } = require('../controller/requestController');

// Debug middleware for routes
router.use((req, res, next) => {
    console.log('Request route hit:', {
        method: req.method,
        path: req.url
    });
    next();
});

// Define routes
router.post('/create', createRequest);
router.get('/all', getAllRequests);
router.get('/:id', getRequestById);
router.delete('/:id', deleteRequest);

module.exports = router;
