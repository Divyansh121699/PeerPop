require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../backend/models/user.model');
const Skill = require('../backend/models/skill.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample data
const users = [
    {
        name: 'User 1',
        email: 'user1@example.com',
        password: 'password123',
        major: 'Computer Science',
        year: 3,
        skills_have: [
            { name: 'JavaScript', rating: 4 },
            { name: 'React', rating: 3 },
            { name: 'Node.js', rating: 4 }
        ],
        coordinates: [0, 0]
    },
    {
        name: 'User 2',
        email: 'user2@example.com',
        password: 'password123',
        major: 'Computer Science',
        year: 2,
        skills_have: [
            { name: 'Python', rating: 5 },
            { name: 'Machine Learning', rating: 4 },
            { name: 'JavaScript', rating: 3 }
        ],
        coordinates: [0, 0]
    },
    {
        name: 'User 3',
        email: 'user3@example.com',
        password: 'password123',
        major: 'Data Science',
        year: 4,
        skills_have: [
            { name: 'Python', rating: 5 },
            { name: 'Machine Learning', rating: 5 },
            { name: 'SQL', rating: 4 }
        ],
        coordinates: [0, 0]
    }
];

const skills = [
    {
        name: 'JavaScript',
        major: 'Computer Science',
        description: 'Programming language for web development',
        level: 'Intermediate'
    },
    {
        name: 'Python',
        major: 'Computer Science',
        description: 'General-purpose programming language',
        level: 'Advanced'
    },
    {
        name: 'Machine Learning',
        major: 'Data Science',
        description: 'Field of study in artificial intelligence',
        level: 'Advanced'
    },
    {
        name: 'React',
        major: 'Computer Science',
        description: 'JavaScript library for building user interfaces',
        level: 'Intermediate'
    },
    {
        name: 'Node.js',
        major: 'Computer Science',
        description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
        level: 'Intermediate'
    },
    {
        name: 'SQL',
        major: 'Data Science',
        description: 'Standard query language for databases',
        level: 'Intermediate'
    }
];

// Function to seed the database
const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Skill.deleteMany({});
        
        // Insert new data
        await User.insertMany(users);
        await Skill.insertMany(skills);
        
        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeding function
seedDatabase(); 