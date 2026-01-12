import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    LogOut,
    PlusCircle,
    Map as MapIcon,
    Shield,
    Settings,
    User,
    X // Import X icon for closing menu
} from 'lucide-react';
import NotificationList from './NotificationList';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700 hover:text-white";
    };

    if (!user) return null;

    return (
        <>
            {/* Sidebar Container */}
            <div className={`
        fixed top-0 left-0 h-screen w-64 bg-blue-600 text-white shadow-xl z-[9999] flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:fixed
      `}>

                {/* Logo Area */}
                <div className="p-6 flex items-center justify-between border-b border-blue-500">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-blue-600">
                            <MapIcon size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-wide">SmartCity</span>
                    </div>

                    {/* Close Button - Visible only on Mobile */}
                    <button
                        onClick={onClose}
                        className="md:hidden text-blue-200 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    <Link
                        to="/dashboard"
                        onClick={onClose} // Close menu when clicked on mobile
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/dashboard')}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    {user.role === 'CITIZEN' && (
                        <Link
                            to="/report"
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/report')}`}
                        >
                            <PlusCircle size={20} />
                            <span className="font-medium">Report Issue</span>
                        </Link>
                    )}

                    {user.role === 'ADMIN' && (
                        <Link
                            to="/admin"
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/admin')}`}
                        >
                            <Shield size={20} />
                            <span className="font-medium">Admin Panel</span>
                        </Link>
                    )}

                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 hover:text-white transition-colors duration-200 text-left">
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </button>
                </nav>

                {/* Notifications */}
                <div className="px-4 py-2">
                    <div className="flex items-center gap-3 text-blue-100 mb-2 px-2">
                        <span className="text-xs uppercase font-bold tracking-wider opacity-70">Notifications</span>
                    </div>
                    <div className="flex items-center px-2">
                        <NotificationList />
                        <span className="ml-2 text-sm text-blue-200">Alerts</span>
                    </div>
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-blue-500 bg-blue-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <User size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-semibold text-sm truncate">{user.name}</p>
                            <p className="text-xs text-blue-300 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-blue-900 hover:bg-blue-950 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;