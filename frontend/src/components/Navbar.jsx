import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, PlusCircle, Map as MapIcon, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <MapIcon /> SmartTimis
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-200 flex items-center gap-1">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          {user.role === 'CITIZEN' && (
            <Link to="/report" className="hover:text-blue-200 flex items-center gap-1">
              <PlusCircle size={18} /> Report Issue
            </Link>
          )}
          {user.role === 'ADMIN' && (
             <Link to="/admin" className="hover:text-blue-200 flex items-center gap-1">
                <Shield size={18} /> Admin
             </Link>
          )}
          <div className="flex items-center gap-4 border-l border-blue-500 pl-4">
            <span className="text-sm font-medium">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
