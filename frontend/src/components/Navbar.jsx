import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Map as MapIcon, Bell, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-gray-100 text-gray-900 font-medium"
      : "text-gray-500 hover:text-gray-900 font-medium";
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                 <MapIcon size={20} />
              </div>
              <span className="font-bold text-xl text-gray-900">SmartCity</span>
            </Link>
          </div>

          {/* Centered Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-full text-sm transition-colors ${isActive('/dashboard')}`}
            >
                View Map
            </Link>

            {user.role === 'CITIZEN' && (
                <Link
                    to="/report"
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${isActive('/report')}`}
                >
                    Report Issue
                </Link>
            )}

            {user.role === 'ADMIN' && (
                <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${isActive('/admin')}`}
                >
                    Admin Dashboard
                </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/2 -translate-y-1/2"></span>
            </button>

            <div className="flex items-center gap-3 border border-gray-200 rounded-full pl-1 pr-4 py-1 hover:bg-gray-50 cursor-pointer group relative">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <User size={16} />
                </div>
                <div className="flex flex-col">
                     <span className="text-sm font-medium text-gray-700">{user.email}</span>
                </div>

                {/* Dropdown for Logout (Simple implementation) */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 hidden group-hover:block">
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Sign out
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
