import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import sodaLogo from '../assets/soda.png';

export default function Header({ userName = 'Learner' }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user data and token
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
    <>
    
    {/* Top Left: Logo + Title */}
    <div className="absolute top-1 left-1 flex items-center gap-3 z-50">
      <img
        src={sodaLogo}
        alt="PeerPop Logo"
        className="w-32 h-auto"
      />
      <h1 className="text-3xl font-bold text-[#ED563B]">PeerPop</h1>
    </div>

    {/* Top Right: Greeting Box with Logout Button */}
    <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
      <div
        className="bg-[#FFC329] px-6 py-3 rounded-lg shadow-lg border border-[#D19827]"
        style={{ boxShadow: '0 4px 12px #D19827' }}
      >
        <p className="font-bold text-lg">👋 Hello, {userName}!</p>
      </div>
      
      <button
        onClick={handleLogout}
        className="bg-[#ED563B] hover:bg-[#D14532] text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300"
      >
        Logout
      </button>
    </div>
    
    </>
    )
}
