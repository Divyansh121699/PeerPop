const express = require('express');
const router = express.Router();
const { fetchUserEmail } = require('../controller/fetchEmailController');
    
router.post('/fetch-email', fetchUserEmail);

module.exports = router;    
