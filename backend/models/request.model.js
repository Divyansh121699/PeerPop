const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    learnSubject: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skills: [{
        name: {
            type: String,
            required: true
        },
        rating: [{
            type: Number,
            required: false
        }]
    }]
}, { timestamps: true });

// Export the model only if it hasn't been registered
module.exports = mongoose.models.Request || mongoose.model('Request', requestSchema);