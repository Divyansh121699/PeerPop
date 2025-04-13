const express = require('express');
const router = express.Router();
const {loginFunc, registerFunc} = require('../controller/authController');

// Auth routes
router.post('/register', registerFunc);
router.post('/login', loginFunc);

module.exports = router;
