const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        major: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        // Optional image field
        // image: {
        //     type: String,
        //     required: true
        // },

        skills_have: [
            {
                name: {
                    type: String,
                    required: true
                },
                rating: {
                    type: Number,
                    default: 0 // optional rating for how skilled they are
                }
            }
        ],

        // skills_want: [
        //     {
        //         name: {
        //             type: String,
        //             required: true
        //         }
        //     }
        // ],  

        location: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },  
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;