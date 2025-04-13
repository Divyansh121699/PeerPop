const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { getAllUsers } = require('../controller/userController');

// Get skills analytics
router.get('/skills-analytics', async (req, res) => {
  try {
    // Get users from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const users = await User.find({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching skills analytics:', error);
    res.status(500).json({ error: 'Failed to fetch skills analytics' });
  }
});


router.get('/skills_have/:skillName', async (req, res) => {
  const { skillName } = req.params;
  try {
    const users = await User.find({
      skills_have: { $elemMatch: {name: skillName} },
      location: {$exists: true} 
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users who can teach:', error);
    res.status(500).json({ error: 'Failed to fetch users who can teach' });
  }
});


router.get('/skills_want/:skillName', async (req, res) => {
  const { skillName } = req.params;
  try {
    const users = await User.find({
      skills_want: { $elemMatch: {name: skillName} },
      location: {$exists: true}
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users who can teach:', error);
    res.status(500).json({ error: 'Failed to fetch users who can teach' });
  }
});

// Get all users
router.get('/all', getAllUsers);

module.exports = router; 