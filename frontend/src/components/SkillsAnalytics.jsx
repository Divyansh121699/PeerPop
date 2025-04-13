import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SkillsAnalytics = () => {
  const [skillsHaveData, setSkillsHaveData] = useState({ labels: [], datasets: [] });
  const [skillsWantData, setSkillsWantData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users/skills-analytics');
        const data = response.data;
        
        // Process skills_have data
        const skillsHaveCounter = {};
        data.forEach(user => {
          user.skills_have.forEach(skill => {
            if (skill.name) {
              skillsHaveCounter[skill.name] = (skillsHaveCounter[skill.name] || 0) + 1;
            }
          });
        });

        // Process skills_want data
        const skillsWantCounter = {};
        data.forEach(user => {
          user.skills_want.forEach(skill => {
            if (skill.name) {
              skillsWantCounter[skill.name] = (skillsWantCounter[skill.name] || 0) + 1;
            }
          });
        });

        // Get top 5 skills for each category
        const topSkillsHave = Object.entries(skillsHaveCounter)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5);

        const topSkillsWant = Object.entries(skillsWantCounter)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5);

        // Prepare chart data for skills_have
        const haveChartData = {
          labels: topSkillsHave.map(([skill]) => skill),
          datasets: [
            {
              label: 'Number of Users',
              data: topSkillsHave.map(([, count]) => count),
              backgroundColor: [
                '#FF772A',
                '#ED563B',
                '#8CAB6A',
                '#FFC329',
                '#D19827'
              ],
              borderColor: [
                '#FF772A',
                '#ED563B',
                '#8CAB6A',
                '#FFC329',
                '#D19827'
              ],
              borderWidth: 1,
            },
          ],
        };

        // Prepare chart data for skills_want
        const wantChartData = {
          labels: topSkillsWant.map(([skill]) => skill),
          datasets: [
            {
              label: 'Number of Users',
              data: topSkillsWant.map(([, count]) => count),
              backgroundColor: [
                '#FF772A',
                '#ED563B',
                '#8CAB6A',
                '#FFC329',
                '#D19827'
              ],
              borderColor: [
                '#FF772A',
                '#ED563B',
                '#8CAB6A',
                '#FFC329',
                '#D19827'
              ],
              borderWidth: 1,
            },
          ],
        };

        setSkillsHaveData(haveChartData);
        setSkillsWantData(wantChartData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch skills data');
        setLoading(false);
      }
    };

    fetchSkillsData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
      <h2 className="text-2xl font-extrabold mb-4 text-[#D19827]">📊 Skills Analytics</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2 text-[#FF772A]">Top Skills Users Have</h3>
          <div className="h-64">
            <Bar data={skillsHaveData} options={{...options, plugins: {...options.plugins, title: {display: true, text: 'Most Common Skills Users Have'}}}} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2 text-[#FF772A]">Top Skills Users Want to Learn</h3>
          <div className="h-64">
            <Bar data={skillsWantData} options={{...options, plugins: {...options.plugins, title: {display: true, text: 'Most Desired Skills'}}}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsAnalytics; 