import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkillRecommendations = ({ userId }) => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                console.log(`Fetching recommendations for user: ${userId}`);
                const response = await axios.get(`http://localhost:3000/recommendations/skills/${userId}`);
                console.log('Recommendations received:', response.data);
                setRecommendations(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError(`Failed to load recommendations: ${err.message || 'Unknown error'}`);
                setLoading(false);
            }
        };

        if (userId) {
            fetchRecommendations();
        } else {
            setError('User ID is required to load recommendations');
            setLoading(false);
        }
    }, [userId]);

    if (loading) return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-[#FFC329] animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-red-500">
            <h2 className="text-2xl font-extrabold mb-4 text-red-500">⚠️ Error</h2>
            <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-medium">{error}</p>
                <p className="text-sm mt-2">Please try again later or contact support if the issue persists.</p>
            </div>
        </div>
    );
    
    if (!recommendations) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-[#FFC329]">
            <h2 className="text-2xl font-extrabold mb-4 text-[#D19827]">🎯 Skill Recommendations</h2>
            
            {/* Recommended Skills Section */}
            <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-[#D19827]">Based on Similar Users</h3>
                <div className="grid grid-cols-2 gap-4">
                    {recommendations.recommendedSkills && recommendations.recommendedSkills.length > 0 ? (
                        recommendations.recommendedSkills.map((skill, index) => (
                            <div key={index} className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-lg hover:shadow-md transition-all duration-300 border border-orange-200">
                                <p className="font-medium text-gray-800">{skill}</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                            <p className="text-gray-500">No specific skills recommended at this time</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Complementary Skills Section */}
            <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-[#D19827]">Complementary Skills</h3>
                <div className="grid grid-cols-2 gap-4">
                    {recommendations.complementarySkills && recommendations.complementarySkills.length > 0 ? (
                        recommendations.complementarySkills.map((skill, index) => (
                            <div key={index} className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-200">
                                <p className="font-medium text-gray-800">{skill}</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                            <p className="text-gray-500">No complementary skills found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Skill Path Section */}
            <div>
                <h3 className="text-lg font-bold mb-3 text-[#D19827]">Skill Path</h3>
                <div className="grid grid-cols-2 gap-4">
                    {recommendations.skillPath && recommendations.skillPath.length > 0 ? (
                        recommendations.skillPath.map((skill, index) => (
                            <div key={index} className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg hover:shadow-md transition-all duration-300 border border-green-200">
                                <p className="font-medium text-gray-800">{skill}</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                            <p className="text-gray-500">No skill path found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillRecommendations; 