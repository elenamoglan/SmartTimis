import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Map as MapIcon, Bell, User, LogOut, Check } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

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

  // Fetch notifications
  useEffect(() => {
    if (user) {
        fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
        const res = await axios.get('/api/notifications');
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.is_read).length);
    } catch (err) {
        console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
        await axios.patch(`/api/notifications/${id}/read`);
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
        console.error("Failed to mark notification as read", err);
    }
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
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/2 -translate-y-1/2"></span>
                    )}
                </button>

                {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50 max-h-96 overflow-y-auto">
                        <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Notifications</span>
                            {unreadCount > 0 && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{unreadCount} new</span>}
                        </div>

                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-sm text-gray-500 text-center flex flex-col items-center">
                                <Bell size={24} className="mb-2 text-gray-300" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-3 hover:bg-gray-50 transition-colors flex gap-3 ${!notification.is_read ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className="flex-1">
                                            <p className={`text-sm ${!notification.is_read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {!notification.is_read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-blue-600 hover:text-blue-800 p-1 self-start"
                                                title="Mark as read"
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
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
