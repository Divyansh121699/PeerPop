import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { toast } from 'react-toastify';
import Map from '../components/map';
import TopContributors from '../components/TopContributors';
import SkillPopularityChart from '../components/SkillPopularityChart';
import SkillRecommendations from '../components/SkillRecommendations';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { size: 14 } }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: false },
      ticks: { font: { size: 12 } }
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 12 } }
    },
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [requests, setRequests] = useState([]);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const skills = ['React', 'JavaScript', 'Python', 'SQL', 'MongoDB', 'Java'];

  const { skillsData } = useMemo(() => ({
    skillsData: {
      labels: ['React', 'Python', 'JavaScript', 'SQL', 'Machine Learning'],
      datasets: [
        { label: 'Learning Requests', data: [45, 38, 42, 35, 30], backgroundColor: '#FF772A' },
        { label: 'Teaching Offers', data: [35, 42, 38, 40, 25], backgroundColor: '#8CAB6A' }
      ]
    }
  }), []);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return redirectToLogin();
      const user = JSON.parse(userStr);
      if (!user?.name || !user?.id) return redirectToLogin();

      setUserName(user.name.split(' ')[0]);
      setUserId(user.id); // ✅ Set userId here
      fetchRequests();
    } catch (err) {
      console.error(err);
      redirectToLogin();
    }
  }, [navigate]);

  const redirectToLogin = () => {
    toast.error('Please login first');
    navigate('/login');
  };

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return redirectToLogin();

      const response = await fetch('http://localhost:3000/api/requests/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        localStorage.clear();
        return redirectToLogin();
      }

      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Error loading requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    const skill = customSkill || selectedSkill;
    if (!skill) return toast.error('Please select or enter a skill');

    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!userStr || !token) return redirectToLogin();

      const user = JSON.parse(userStr);
      const requestData = {
        learnSubject: skill,
        userId: user.id,
        skills: [{ name: skill, rating: [] }]
      };

      const response = await fetch('http://localhost:3000/api/requests/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        toast.success('Request created successfully!');
        setIsModalOpen(false);
        setSelectedSkill('');
        setCustomSkill('');
        fetchRequests();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create request');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create request');
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowMap(true);
  };

  return (
    <div className="relative min-h-screen p-6 text-[#2D2D2D] font-sans bg-gradient-to-br from-[#FFF0B3] via-[#FFD580] to-[#FFAD60]">
      <Header userName={userName} />

      {showMap ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-6xl">
            <button
              onClick={() => {
                setShowMap(false);
                setSelectedRequest(null);
              }}
              className="my-30 mb-4 bg-[#FF772A] hover:bg-[#ED563B] text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              ← Back to Dashboard
            </button>
            <div className="mt-4 w-full h-[80vh] rounded-xl overflow-hidden shadow-lg border-4 border-[#FFC329]">
              <Map selectedRequest={selectedRequest} />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Create Study Request Button */}
          <div className="flex justify-center mb-10 mt-40">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF772A] hover:bg-[#ED563B] text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300"
            >
              ➕ Create Study Request
            </button>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <h3 className="text-2xl font-bold text-[#ED563B] mb-6">Create Study Request</h3>
                
                {/* Predefined Skills */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Select a skill:</label>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => setSelectedSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          selectedSkill === skill
                            ? 'bg-[#ED563B] text-white'
                            : 'bg-[#FFE5B4] text-[#2D2D2D] hover:bg-[#ED563B] hover:text-white'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Skill Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Or enter a custom skill:</label>
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Enter skill name"
                    className="w-full px-4 py-2 border border-[#FFD580] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF772A]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedSkill('');
                      setCustomSkill('');
                    }}
                    className="px-4 py-2 rounded-lg text-[#2D2D2D] hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateRequest}
                    className="px-4 py-2 rounded-lg bg-[#FF772A] text-white hover:bg-[#ED563B] transition"
                  >
                    Create Request
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-[#FFC329]">
                <h2 className="text-2xl font-extrabold mb-4 text-[#D19827]">📚 Requests</h2>
                <div className="space-y-5">
                  {isLoading ? (
                    <div className="text-center">Loading requests...</div>
                  ) : requests.length === 0 ? (
                    <div className="text-center">No requests found</div>
                  ) : (
                    requests.map((request, index) => (
                      <div
                        key={request._id || index}
                        onClick={() => handleRequestClick(request)}
                        className="p-4 rounded-xl text-white font-medium transition-transform transform hover:scale-105 cursor-pointer shadow-md"
                        style={{ backgroundColor: '#FF772A' }}
                      >
                        <div className="flex justify-between items-center">
                          <span>{request.learnSubject}</span>
                          <span className="text-sm">by {(request.userId?.name) || 'Unknown'}</span>
                        </div>
                        <div className="text-sm mt-2">
                          Skills: {request.skills?.map(skill => skill.name).join(', ') || 'None'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ✅ Skill Recommendations Component */}
              {userId && (
                <SkillRecommendations userId={userId} />
              )}
            </div>

            {/* Middle Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-[#FFC329]">
                <h2 className="text-2xl font-extrabold mb-4 text-[#D19827]">📊 Skills Analytics</h2>
                <div className="h-[300px]">
                  <Bar data={skillsData} options={barChartOptions} />
                </div>
              </div>
              <TopContributors />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-3 space-y-6">
              <SkillPopularityChart />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
