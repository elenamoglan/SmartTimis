import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Map as MapIcon, Bell, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-gray-100 text-gray-900 font-medium"
      : "text-gray-500 hover:text-gray-900 font-medium";
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
                <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className={`text-gray-400 hover:text-gray-600 relative p-1 rounded-full hover:bg-gray-100 transition-colors ${isNotificationsOpen ? 'bg-gray-100 text-gray-600' : ''}`}
                >
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/2 -translate-y-1/2"></span>
                </button>

                {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                        <div className="px-4 py-2 border-b border-gray-50 text-xs font-semibold text-gray-500 uppercase">
                            Notifications
                        </div>
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No new notifications
                        </div>
                    </div>
                )}
            </div>

            {/* User Menu Dropdown */}
            <div className="relative" ref={userMenuRef}>
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-3 border border-gray-200 rounded-full pl-1 pr-4 py-1 hover:bg-gray-50 cursor-pointer transition-all ${isUserMenuOpen ? 'ring-2 ring-blue-100 border-blue-200' : ''}`}
                >
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <User size={16} />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-gray-700">{user.email}</span>
                    </div>
                </button>

                {/* Dropdown for Logout */}
                {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            Sign out
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
