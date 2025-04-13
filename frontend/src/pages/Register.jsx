import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    major: '',
    year: '',
    skills_have: [],
    skills_want: []
  });

  const [selectedSkillsHave, setSelectedSkillsHave] = useState({});
  const [selectedSkillsWant, setSelectedSkillsWant] = useState({});

  function handleChange(e) {
    e.preventDefault();
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  }

  function handleSkillHaveChange(skill) {
    const newSelectedSkills = {
      ...selectedSkillsHave,
      [skill]: !selectedSkillsHave[skill]
    };
    setSelectedSkillsHave(newSelectedSkills);

    if (!selectedSkillsHave[skill]) {
      setData({
        ...data,
        skills_have: [...data.skills_have, { name: skill, rating: 0 }]
      });
    } else {
      setData({
        ...data,
        skills_have: data.skills_have.filter(s => s.name !== skill)
      });
    }
  }

  function handleSkillWantChange(skill) {
    const newSelectedSkills = {
      ...selectedSkillsWant,
      [skill]: !selectedSkillsWant[skill]
    };
    setSelectedSkillsWant(newSelectedSkills);

    if (!selectedSkillsWant[skill]) {
      setData({
        ...data,
        skills_want: [...data.skills_want, { name: skill }]
      });
    } else {
      setData({
        ...data,
        skills_want: data.skills_want.filter(s => s.name !== skill)
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast.success('Registration successful!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    }
  }

  const [skills] = useState(['React', 'JavaScript', 'Python', 'SQL', 'MongoDB', 'Java']);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-[#FFF0B3] via-[#FFD580] to-[#FFAD60]">
      <h2 className="text-4xl font-bold text-[#ED563B] mb-8">📝 Register for PeerPop</h2>

      <form className="bg-[#FFF4D8] p-8 rounded-xl shadow-lg w-full max-w-2xl space-y-6 border border-[#FFC329]">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              name="name"
              value={data.name}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-2 border border-[#FFD580] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              name="email"
              value={data.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-2 border border-[#FFD580] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              name="password"
              value={data.password}
              onChange={handleChange}
              type="password"
              className="w-full px-4 py-2 border border-[#FFD580] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Major</label>
            <input
              name="major"
              value={data.major}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-2 border border-[#FFD580] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Year of Study</label>
            <input
              name="year"
              value={data.year}
              onChange={handleChange}
              type="number"
              min="1"
              max="4"
              className="w-full px-4 py-2 border border-[#FFD580] rounded-lg"
            />
          </div>
        </div>

        {/* Skills Have */}
        <div>
          <label className="block text-sm font-semibold mb-2">Select skills you have</label>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                onClick={() => handleSkillHaveChange(skill)}
                key={skill}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition ${selectedSkillsHave[skill]
                  ? 'bg-[#ED563B] text-white'
                  : 'bg-[#FFE5B4] text-[#2D2D2D] hover:bg-[#ED563B] hover:text-white'
                  }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Want */}
        <div>
          <label className="block text-sm font-semibold mb-2">Select skills you want to learn</label>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                onClick={() => handleSkillWantChange(skill)}
                key={skill}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition ${selectedSkillsWant[skill]
                  ? 'bg-[#ED563B] text-white'
                  : 'bg-[#FFE5B4] text-[#2D2D2D] hover:bg-[#ED563B] hover:text-white'
                  }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-[#FF772A] hover:bg-[#ED563B] text-white font-bold py-3 rounded-lg transition duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
