import React, { useMemo } from 'react';

const SkillPopularityChart = () => {
  // Demo data - replace with actual API data later
  const rawData = {
    labels: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science'],
    datasets: [
      {
        label: 'React',
        data: [65, 45, 30, 20, 25],
        backgroundColor: '#FF772A',
      },
      {
        label: 'Python',
        data: [55, 60, 40, 15, 50],
        backgroundColor: '#8CAB6A',
      },
      {
        label: 'JavaScript',
        data: [70, 35, 25, 10, 20],
        backgroundColor: '#FFC329',
      },
      {
        label: 'SQL',
        data: [40, 30, 45, 20, 35],
        backgroundColor: '#ED563B',
      },
    ],
  };

  // Calculate top skills per major and popular majors
  const { topSkillsPerMajor, popularMajors } = useMemo(() => {
    const majorTotals = rawData.labels.map((major, index) => {
      const total = rawData.datasets.reduce((sum, dataset) => sum + dataset.data[index], 0);
      return { major, total };
    });

    // Sort majors by total skills (popularity)
    const sortedMajors = [...majorTotals].sort((a, b) => b.total - a.total);
    const popularMajors = sortedMajors.slice(0, 3);

    // Calculate top skills for each major
    const topSkillsPerMajor = rawData.labels.map((major, majorIndex) => {
      const skills = rawData.datasets.map(dataset => ({
        skill: dataset.label,
        count: dataset.data[majorIndex]
      }));
      
      // Sort skills by count and get top 2
      const topSkills = skills.sort((a, b) => b.count - a.count).slice(0, 2);
      
      return {
        major,
        topSkills
      };
    });

    return { topSkillsPerMajor, popularMajors };
  }, [rawData]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#FFC329]">
      <h2 className="text-2xl font-extrabold mb-4 text-[#D19827]">📊 Skills by Major</h2>
      
      {/* Top Skills and Popular Majors Summary */}
      <div className="space-y-6">
        {/* Top Skills per Major */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#D19827]">Top Skills</h3>
          <div className="space-y-3">
            {topSkillsPerMajor.slice(0, 3).map(({ major, topSkills }) => (
              <div 
                key={major} 
                className="p-4 bg-gradient-to-r from-[#FFF4D8] to-white rounded-lg shadow-sm"
              >
                <h4 className="font-semibold text-[#2D2D2D] mb-2">{major}</h4>
                <div className="space-y-2">
                  {topSkills.map(({ skill, count }, index) => (
                    <div 
                      key={skill} 
                      className="flex justify-between items-center p-2 rounded-md bg-white/50"
                    >
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm font-bold" 
                              style={{ 
                                backgroundColor: index === 0 ? '#FF772A' : '#8CAB6A',
                                color: 'white'
                              }}>
                          {index + 1}
                        </span>
                        <span className="text-[#2D2D2D]">{skill}</span>
                      </div>
                      <span className="font-medium text-[#FF772A]">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Majors */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#D19827]">Popular Majors</h3>
          <div className="space-y-3">
            {popularMajors.map(({ major, total }, index) => (
              <div 
                key={major} 
                className="p-4 bg-gradient-to-r from-[#FFF4D8] to-white rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <div>
                      <h4 className="font-semibold text-[#2D2D2D]">{major}</h4>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${(total / popularMajors[0].total) * 100}%`,
                            backgroundColor: index === 0 ? '#FF772A' : index === 1 ? '#8CAB6A' : '#FFC329'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#FF772A] text-lg">{total}</span>
                    <p className="text-sm text-gray-500">skills</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillPopularityChart; 