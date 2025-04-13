import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import L from 'leaflet';
import './Map.css';
import { toast } from 'react-toastify';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Set up default icon for markers
const defaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const Map = ({ selectedRequest }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please login again');
                    return;
                }

                const response = await fetch('http://localhost:3000/api/users/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Filter users who have the requested skill
                    const filteredUsers = data.filter(user => {
                        if (!user.skills_have || !selectedRequest?.skills) return false;
                        
                        // Get the requested skill name
                        const requestedSkill = selectedRequest.skills[0]?.name;
                        if (!requestedSkill) return false;

                        // Check if user has the requested skill
                        return user.skills_have.some(skill => {
                            // If skill is an object with a name property
                            if (typeof skill === 'object' && skill.name) {
                                return skill.name.toLowerCase() === requestedSkill.toLowerCase();
                            }
                            // If skill is a string
                            return skill.toLowerCase() === requestedSkill.toLowerCase();
                        });
                    });
                    
                    setUsers(filteredUsers);
                    toast.success(`Found ${filteredUsers.length} users with matching skills`);
                } else {
                    toast.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Error loading users');
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedRequest) {
            fetchUsers();
        }
    }, [selectedRequest]);

    const handleConnect = async (user) => {
        console.log('Connecting to user:', user);
        //fetching to email
        const response = await fetch('http://localhost:3000/api/email/fetch-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user._id })
        });
        const data = await response.json();
        const toEmail = data.email;

        //email of current user
        const userData = JSON.parse(localStorage.getItem('user'));
        const fromEmail = userData.email;
        console.log('From Email:', fromEmail);
        console.log('To Email:', toEmail);

        //send emails to both users
        try {
            // Send email to the user being connected with
            const sendToResponse = await fetch('http://localhost:3000/api/email/send-test-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: toEmail, connectedUserEmail: fromEmail })
            });
            
            // Send email to the current user
            const sendFromResponse = await fetch('http://localhost:3000/api/email/send-test-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: fromEmail, connectedUserEmail: toEmail })
            });
            
            if (sendToResponse.ok && sendFromResponse.ok) {
                toast.success('Connection emails sent successfully!');
            } else {
                toast.error('Failed to send connection emails');
            }
        } catch (error) {
            console.error('Error sending connection emails:', error);
            toast.error('Error sending connection emails');
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#FFF0B3] via-[#FFD580] to-[#FFAD60]">
            {/* Fixed Header Area */}
            {/* <div className="h-48 bg-transparent">
                <Header showLogo={false} />
            </div> */}

            {/* Main Map Container */}
            <div className="px-4 pb-4" style={{ height: 'calc(100vh - 14rem)' }}>
                <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border-4 border-[#FFC329]">
                    <MapContainer
                        center={[38.8315, -77.3089]}
                        zoom={16}
                        style={{ height: '100%', width: '100%' }}
                        className="z-0"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                                
                        {isLoading ? (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
                                Loading users...
                            </div>
                        ) : users.length === 0 ? (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
                                No users found with matching skills
                            </div>
                        ) : (
                            users.map((user, index) => (
                                <Marker
                                    key={user._id || index}
                                    position={[
                                        user.coordinates?.[1] || 38.8315 + (Math.random() * 0.01 - 0.005),
                                        user.coordinates?.[0] || -77.3089 + (Math.random() * 0.01 - 0.005)
                                    ]}
                                    icon={defaultIcon}
                                >
                                    <Popup>
                                        <div className="card-container bg-white p-4 rounded-lg shadow-lg min-w-[250px]">
                                            <div className="card-header border-b border-gray-200 pb-2 mb-2">
                                                <h3 className="text-xl font-bold text-[#FF772A]">{user.name}</h3>
                                                <p className="text-sm text-gray-500">{user.major || 'No major specified'}</p>
                                            </div>
                                            <div className="card-body space-y-2">
                                                <div className="flex items-start">
                                                    <span className="font-semibold text-gray-700 w-24">Skills:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.skills_have?.map((skill, idx) => (
                                                            <span 
                                                                key={idx} 
                                                                className={`bg-[#FFE5B4] text-[#2D2D2D] px-2 py-1 rounded-full text-sm ${
                                                                    (typeof skill === 'object' ? skill.name : skill).toLowerCase() === selectedRequest?.skills[0]?.name?.toLowerCase()
                                                                        ? 'border-2 border-[#FF772A]'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {typeof skill === 'object' ? skill.name : skill}
                                                            </span>
                                                        )) || 'No skills listed'}
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-semibold text-gray-700 w-24">Year:</span>
                                                    <span className="text-gray-600">{user.year || 'Not specified'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-semibold text-gray-700 w-24">Graduation:</span>
                                                    <span className="text-gray-600">{user.graduationYear || 'Not specified'}</span>
                                                </div>
                                            </div>
                                            <div className="card-footer mt-4 pt-2 border-t border-gray-200">
                                                <button onClick={() => handleConnect(user)} className="w-full bg-[#FF772A] hover:bg-[#ED563B] text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                                                    Connect
                                                </button>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default Map;             