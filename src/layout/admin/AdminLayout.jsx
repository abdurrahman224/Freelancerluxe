import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/admin" replace />;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#fff8f5', fontFamily: 'var(--font-primary)' }}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-20 bg-[#f6eeeb] shadow-lg border-b border-gray-100 px-4 py-3 flex items-center">
        {/* Left: hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-[#140601] hover:text-[#ff6b2d] shrink-0"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Center: logo + wordmark */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <img src="/topImage.png" alt="Logo" className="h-7 w-auto" />
          <span className="font-bold text-lg tracking-wide text-[#140601]" style={{ fontFamily: 'var(--font-secondary)' }}>YOUKNOW<span className='text-[#ff6b2d]'>BALL</span></span>
        </div>
      </div>

      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 md:pt-8 md:ml-60 lg:ml-64 xl:ml-80">
       <div className='container mx-auto'>
         <Outlet />
       </div>
      </main>
    </div>
  );
};

export default AdminLayout;