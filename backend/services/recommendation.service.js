const User = require('../models/user.model');

// Skill categories with their relationships and difficulty levels
const skillCategories = {
    'Programming Languages': {
        skills: ['Python', 'JavaScript', 'Java', 'C++', 'Ruby', 'Go', 'Rust'],
        difficulty: 3,
        prerequisites: []
    },
    'Web Development': {
        skills: ['React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask'],
        difficulty: 3,
        prerequisites: ['JavaScript', 'HTML', 'CSS']
    },
    'Data Science & ML': {
        skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'R'],
        difficulty: 4,
        prerequisites: ['Python', 'Statistics', 'Mathematics']
    },
    'Cloud & DevOps': {
        skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
        difficulty: 4,
        prerequisites: ['Linux', 'Networking', 'Scripting']
    },
    'Databases': {
        skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch'],
        difficulty: 3,
        prerequisites: ['SQL', 'Data Modeling']
    },
    'Design & UI/UX': {
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'],
        difficulty: 2,
        prerequisites: []
    },
    'Business & Soft Skills': {
        skills: ['Project Management', 'Agile', 'Leadership', 'Communication'],
        difficulty: 2,
        prerequisites: []
    }
};

// Career paths and their required skills
const careerPaths = {
    'Full Stack Developer': {
        core: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        recommended: ['TypeScript', 'Docker', 'AWS'],
        level: 'Intermediate'
    },
    'Data Scientist': {
        core: ['Python', 'Pandas', 'Scikit-learn', 'SQL'],
        recommended: ['TensorFlow', 'PyTorch', 'Big Data'],
        level: 'Advanced'
    },
    'DevOps Engineer': {
        core: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
        recommended: ['Terraform', 'Python', 'Linux'],
        level: 'Advanced'
    },
    'UI/UX Designer': {
        core: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        recommended: ['HTML/CSS', 'JavaScript', 'Motion Design'],
        level: 'Intermediate'
    },
    'Product Manager': {
        core: ['Project Management', 'Agile', 'Product Strategy'],
        recommended: ['Data Analytics', 'User Research', 'Technical Writing'],
        level: 'Intermediate'
    }
};

// Generate synthetic user data for testing
const generateSyntheticUsers = () => {
    const users = [];
    const numUsers = 100;

    for (let i = 0; i < numUsers; i++) {
        const userSkills = new Set();
        const teachingSkills = new Set();
        const skillRatings = {};
        const careerPath = Object.keys(careerPaths)[Math.floor(Math.random() * Object.keys(careerPaths).length)];

        // Add core skills for career path
        careerPaths[careerPath].core.forEach(skill => {
            if (Math.random() > 0.2) { // 80% chance to have core skills
                userSkills.add(skill);
                skillRatings[skill] = Math.floor(Math.random() * 2) + 4; // 4-5 rating
            }
        });

        // Add some recommended skills
        careerPaths[careerPath].recommended.forEach(skill => {
            if (Math.random() > 0.4) { // 60% chance to have recommended skills
                userSkills.add(skill);
                skillRatings[skill] = Math.floor(Math.random() * 2) + 3; // 3-4 rating
            }
        });

        // Add some random skills from categories
        Object.entries(skillCategories).forEach(([category, data]) => {
            if (Math.random() > 0.6) { // 40% chance to add a skill from each category
                const skill = data.skills[Math.floor(Math.random() * data.skills.length)];
                if (!userSkills.has(skill)) {
                    userSkills.add(skill);
                    skillRatings[skill] = Math.floor(Math.random() * 3) + 2; // 2-4 rating
                }
            }
        });

        // Select teaching skills (subset of user's skills with high ratings)
        Object.entries(skillRatings).forEach(([skill, rating]) => {
            if (rating >= 4 && Math.random() > 0.5) { // 50% chance to teach high-rated skills
                teachingSkills.add(skill);
            }
        });

        users.push({
            id: `user_${i}`,
            careerPath,
            skills: Array.from(userSkills),
            teachingSkills: Array.from(teachingSkills),
            skillRatings
        });
    }

    return users;
};

// Calculate skill similarity based on categories and prerequisites
const calculateSkillSimilarity = (skill1, skill2) => {
    // Check if skills are in the same category
    for (const [category, data] of Object.entries(skillCategories)) {
        if (data.skills.includes(skill1) && data.skills.includes(skill2)) {
            return 1.0;
        }
    }

    // Check if one skill is a prerequisite for the other
    for (const [category, data] of Object.entries(skillCategories)) {
        if (data.prerequisites.includes(skill1) && data.skills.includes(skill2)) {
            return 0.8;
        }
        if (data.prerequisites.includes(skill2) && data.skills.includes(skill1)) {
            return 0.8;
        }
    }

    return 0.3; // Default similarity for unrelated skills
};

// Calculate user similarity based on multiple factors
const calculateUserSimilarity = (user1, user2) => {
    // Career path similarity
    const careerSimilarity = user1.careerPath === user2.careerPath ? 1.0 : 0.3;

    // Skill overlap similarity
    const user1Skills = new Set(user1.skills);
    const user2Skills = new Set(user2.skills);
    const skillIntersection = new Set([...user1Skills].filter(x => user2Skills.has(x)));
    const skillUnion = new Set([...user1Skills, ...user2Skills]);
    const skillSimilarity = skillIntersection.size / skillUnion.size;

    // Teaching skills similarity
    const teachingSimilarity = user1.teachingSkills.some(skill => 
        user2.teachingSkills.includes(skill)
    ) ? 1.0 : 0.0;

    // Skill rating similarity
    let ratingSimilarity = 0;
    let commonSkillsCount = 0;
    for (const skill of skillIntersection) {
        if (user1.skillRatings[skill] && user2.skillRatings[skill]) {
            ratingSimilarity += 1 - Math.abs(user1.skillRatings[skill] - user2.skillRatings[skill]) / 5;
            commonSkillsCount++;
        }
    }
    ratingSimilarity = commonSkillsCount > 0 ? ratingSimilarity / commonSkillsCount : 0;

    // Weighted combination
    return (
        0.3 * careerSimilarity +
        0.3 * skillSimilarity +
        0.2 * teachingSimilarity +
        0.2 * ratingSimilarity
    );
};

// Get skill recommendations for a user
const getRecommendations = async (userId) => {
    try {
        // Get the target user - try both by _id and email
        let targetUser = await User.findById(userId);
        
        // If not found by ID, try by email
        if (!targetUser) {
            targetUser = await User.findOne({ email: userId });
        }
        
        if (!targetUser) {
            throw new Error('User not found');
        }

        // Generate synthetic data
        const syntheticUsers = generateSyntheticUsers();
        
        // Add target user to synthetic data
        const userData = {
            id: targetUser._id,
            careerPath: targetUser.major, // Use major as career path
            skills: targetUser.skills_have.map(s => s.name),
            teachingSkills: targetUser.skills_have.filter(s => s.rating >= 4).map(s => s.name),
            skillRatings: targetUser.skills_have.reduce((acc, skill) => {
                acc[skill.name] = skill.rating || 3;
                return acc;
            }, {})
        };
        syntheticUsers.push(userData);

        // Find similar users
        const similarUsers = syntheticUsers
            .filter(user => user.id !== targetUser._id)
            .map(user => ({
                similarity: calculateUserSimilarity(userData, user),
                user
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 10);

        // Generate recommendations
        const recommendations = {
            careerPathSkills: [],
            recommendedSkills: [],
            complementarySkills: [],
            skillPath: []
        };

        // Career path skills
        const careerPath = userData.careerPath;
        if (careerPaths[careerPath]) {
            recommendations.careerPathSkills = [
                ...careerPaths[careerPath].core.filter(skill => !userData.skills.includes(skill)),
                ...careerPaths[careerPath].recommended.filter(skill => !userData.skills.includes(skill))
            ].slice(0, 5);
        }

        // Skills from similar users
        const recommendedSkillsSet = new Set();
        similarUsers.forEach(({ user }) => {
            user.skills.forEach(skill => {
                if (!userData.skills.includes(skill)) {
                    recommendedSkillsSet.add(skill);
                }
            });
        });
        recommendations.recommendedSkills = Array.from(recommendedSkillsSet).slice(0, 5);

        // Complementary skills
        const complementarySkillsSet = new Set();
        userData.skills.forEach(userSkill => {
            similarUsers.forEach(({ user }) => {
                if (user.skills.includes(userSkill)) {
                    user.skills.forEach(skill => {
                        if (skill !== userSkill && 
                            !userData.skills.includes(skill) &&
                            calculateSkillSimilarity(userSkill, skill) > 0.5) {
                            complementarySkillsSet.add(skill);
                        }
                    });
                }
            });
        });
        recommendations.complementarySkills = Array.from(complementarySkillsSet).slice(0, 3);

        // Skill path (prerequisites and next steps)
        const skillPath = new Set();
        userData.skills.forEach(skill => {
            Object.values(skillCategories).forEach(category => {
                if (category.prerequisites.includes(skill)) {
                    category.skills.forEach(nextSkill => {
                        if (!userData.skills.includes(nextSkill)) {
                            skillPath.add(nextSkill);
                        }
                    });
                }
            });
        });
        recommendations.skillPath = Array.from(skillPath).slice(0, 3);

        return recommendations;
    } catch (error) {
        console.error('Error in getRecommendations:', error);
        throw error;
    }
};

module.exports = {
    getRecommendations
}; 