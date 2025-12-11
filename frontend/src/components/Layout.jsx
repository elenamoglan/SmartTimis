import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // If not logged in, just render children
    if (!user) {
        return <div className="min-h-screen bg-gray-50">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

            {/* Mobile Header - Only visible on small screens */}
            <div className="md:hidden bg-blue-600 text-white p-4 flex items-center justify-between shadow-md z-[9997] sticky top-0">
                <span className="font-bold text-lg">SmartCity</span>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-1 hover:bg-blue-700 rounded focus:outline-none"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Overlay - Only visible on mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-[9998] md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            {/* - md:ml-64: On desktop, push content 64 units to right (width of sidebar)
         - ml-0: On mobile, no margin (sidebar covers content)
      */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;