const axios = require('axios');

const testRecommendationSystem = async () => {
    try {
        // Test with a sample user ID
        const userId = 'user1'; // Using one of the synthetic user IDs
        console.log(`Testing recommendations for user: ${userId}`);
        
        const response = await axios.get(`http://localhost:3000/recommendations/skills/${userId}`);
        
        console.log('\nRecommendation Results:');
        console.log('=====================');
        
        // Display recommendations based on similar users
        console.log('\n1. Recommendations based on similar users:');
        response.data.basedOnSimilarUsers.forEach((rec, index) => {
            console.log(`\nSimilar User ${index + 1}:`);
            console.log(`User: ${rec.user}`);
            console.log(`Similarity Score: ${rec.similarity}`);
            if (rec.skills && rec.skills.length > 0) {
                console.log('Recommended Skills:', rec.skills.join(', '));
            } else {
                console.log('No specific skills recommended');
            }
        });
        
        // Display popular skills in major
        console.log('\n2. Popular Skills in Your Major:');
        if (response.data.popularInYourMajor && response.data.popularInYourMajor.length > 0) {
            response.data.popularInYourMajor.forEach((skill, index) => {
                console.log(`${index + 1}. ${skill.skill} (Count: ${skill.count})`);
            });
        } else {
            console.log('No popular skills found in your major');
        }
        
        // Display complementary skills
        console.log('\n3. Complementary Skills:');
        if (response.data.complementarySkills && response.data.complementarySkills.length > 0) {
            response.data.complementarySkills.forEach((skill, index) => {
                console.log(`${index + 1}. ${skill.skill} (Count: ${skill.count})`);
            });
        } else {
            console.log('No complementary skills found');
        }
        
        // Display raw response for debugging
        console.log('\nRaw Response Data:');
        console.log(JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.error('Error testing recommendation system:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
};

// Run the test
testRecommendationSystem(); 