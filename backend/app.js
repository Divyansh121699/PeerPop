require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mailRoutes = require('./routes/mailRoutes');
const fetchEmailRoutes = require('./routes/fetchEmailRoutes');
const recommendationRoutes = require('./routes/recommendation.route');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);
    next();
});
// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both common Vite ports
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Routes
// app.use('/', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', mailRoutes);
app.use('/api/email',fetchEmailRoutes);
app.use('/recommendations', recommendationRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    // console.log('Successfully connected to MongoDB');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// MongoDB connection events
mongoose.connection.on('connected', () => {
    // console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    // console.log('Mongoose disconnected from MongoDB');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const port = 3000;
app.listen(port, () => {
    // console.log(`Server is running on port ${port}`);
});

module.exports = app;