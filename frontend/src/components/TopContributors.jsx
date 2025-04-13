import React from 'react';

const TopContributors = () => {
  // Demo data - replace with actual API data later
  const contributors = [
    {
      name: "Sarah Chen",
      avatar: "👩‍💻",
      skillsTaught: 12,
      skillsLearned: 8,
      totalScore: 20,
      topSkill: "React"
    },
    {
      name: "Mike Johnson",
      avatar: "👨‍💻",
      skillsTaught: 10,
      skillsLearned: 9,
      totalScore: 19,
      topSkill: "Python"
    },
    {
      name: "Emma Davis",
      avatar: "👩‍🎓",
      skillsTaught: 8,
      skillsLearned: 10,
      totalScore: 18,
      topSkill: "JavaScript"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#FFC329]">
      <h2 className="text-2xl font-extrabold mb-4 text-[#D19827]">🌟 Top Contributors</h2>
      <div className="space-y-4">
        {contributors.map((contributor, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFF4D8] to-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{contributor.avatar}</div>
              <div>
                <h3 className="font-semibold text-[#2D2D2D]">{contributor.name}</h3>
                <p className="text-sm text-[#666]">Top Skill: {contributor.topSkill}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[#FF772A]">{contributor.totalScore}</div>
              <div className="text-xs text-[#666]">
                {contributor.skillsTaught} taught • {contributor.skillsLearned} learned
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopContributors; 