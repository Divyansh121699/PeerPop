import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission
    
    if (!data.email || !data.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(responseData));
        localStorage.setItem('token', responseData.token);
        toast.success('Login successful');
        
        // Add a small delay before navigation to ensure localStorage is set
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      } else {
        toast.error(responseData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-[#FFF0B3] via-[#FFD580] to-[#FFAD60]">
      <h2 className="text-4xl font-bold text-[#ED563B] mb-8">🔐 Login to PeerPop</h2>

      <form onSubmit={handleSubmit} className="bg-[#FFF4D8] p-8 rounded-xl shadow-lg w-full max-w-md space-y-6 border border-[#FFC329]">
        <div>
          <label className="block text-sm font-semibold text-[#2D2D2D] mb-1">Email</label>
          <input
            name="email"
            value={data.email}
            onChange={handleChange}
            type="email"
            required
            className="w-full px-4 py-2 border border-[#FFD580] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF772A]"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2D2D2D] mb-1">Password</label>
          <input
            name="password"
            value={data.password}
            onChange={handleChange}
            type="password"
            required
            className="w-full px-4 py-2 border border-[#FFD580] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF772A]"
            placeholder="Enter your password"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#FF772A] hover:bg-[#ED563B] text-white font-bold py-3 rounded-lg transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
  