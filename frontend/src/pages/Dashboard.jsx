import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IssueItem = ({ issue, getStatusColor }) => {
  const [showImage, setShowImage] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 text-lg">{issue.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${getStatusColor(issue.status)}`}>
          {issue.status}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>
      
      {issue.image_url && (
        <div className="mb-3">
          <button 
            onClick={() => setShowImage(!showImage)}
            className="text-blue-600 text-xs font-medium hover:underline focus:outline-none"
          >
            {showImage ? 'Hide Image' : 'View Image'}
          </button>
          {showImage && (
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                <img 
                src={issue.image_url} 
                alt={issue.title} 
                className="w-full h-48 object-cover"
                />
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-xs text-gray-400">
        <span>By {issue.reporter_name}</span>
        <span>{new Date(issue.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get('/api/issues');
        setIssues(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'text-red-700 bg-red-100 border border-red-200';
      case 'IN_PROGRESS': return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
      case 'RESOLVED': return 'text-green-700 bg-green-100 border border-green-200';
      default: return 'text-gray-700 bg-gray-100 border border-gray-200';
    }
  };

  const getMarkerIcon = (status) => {
    // Define colors matching your Tailwind theme
    const colors = {
      OPEN: '#ef4444',       // red-500
      IN_PROGRESS: '#f59e0b', // amber-500
      RESOLVED: '#10b981',   // emerald-500
      DEFAULT: '#3b82f6'     // blue-500
    };

    const color = colors[status] || colors.DEFAULT;

    return divIcon({
      className: 'bg-transparent', // Removes the default white square background
      html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full filter drop-shadow-md">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="white"></circle>
      </svg>
    `,
      iconSize: [35, 35],    // Size of the icon
      iconAnchor: [17, 35],  // The point of the icon which corresponds to marker's location (bottom-center)
      popupAnchor: [0, -35]  // The point from which the popup should open relative to the iconAnchor
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] relative">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">City Issues Map</h1>
            <p className="text-gray-500 mt-1">Overview of reported incidents across the city</p>
        </div>
        {/* Desktop Report Button */}
        {user.role === 'CITIZEN' && (
             <Link 
                to="/report" 
                className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium items-center gap-2 transition-colors shadow-sm"
             >
                <Plus size={20} />
                Report Issue
             </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-80px)]">
        {/* Map View */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white relative z-0">
          <MapContainer center={[45.7489, 21.2087]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {issues.map((issue) => (
              <Marker 
                key={issue.id} 
                position={[issue.latitude, issue.longitude]}
                icon={getMarkerIcon(issue.status)}
              >
                <Popup>
                  <div className="w-56">
                    <h3 className="font-bold text-base mb-1">{issue.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{issue.description.substring(0, 60)}...</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* List View - Scrollable Sidebar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Recent Reports</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {issues.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>No issues reported yet.</p>
              </div>
            ) : (
              <div>
                {issues.map((issue) => (
                  <IssueItem key={issue.id} issue={issue} getStatusColor={getStatusColor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      {user.role === 'CITIZEN' && (
        <Link 
            to="/report"
            className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all z-50"
        >
            <Plus size={28} />
        </Link>
      )}
    </div>
  );
};

export default Dashboard;
