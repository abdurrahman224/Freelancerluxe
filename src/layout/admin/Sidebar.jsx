import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Grid, Users, BarChart2, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const items = [
  { key: 'overview', label: 'Overview', to: '/admin/overview', icon: <Grid size={18} /> },
  { key: 'players', label: 'Player Manage', to: '/admin/players', icon: <Users size={18} /> },
  { key: 'leaderboard', label: 'Leaderboard', to: '/admin/leaderboard', icon: <BarChart2 size={18} /> },
  { key: 'settings', label: 'System Settings', to: '/admin/settings', icon: <Settings size={18} /> },
];

const Sidebar = ({ open, onClose }) => {
  const loc = useLocation();
  const navigate = useNavigate();
  const { logout, profile, profileLoading } = useAuth();

  const handleLogout = () => {
    // Directly log out without browser confirm dialog
    logout();
    navigate('/admin');
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-60 lg:w-64 xl:w-80 h-screen fixed left-0 top-0 bottom-0 bg-[#f6eeeb] border-r border-gray-100 flex flex-col justify-between text-sm z-40 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        style={{ fontFamily: 'var(--font-primary)' }}
      >
        <div>
          <div className="px-6 py-6 flex items-center justify-center relative border-b border-[#14060129] mb-5">
            <img src="/topImage.png" alt="Logo" className="w-20 h-auto" />
            <button
              onClick={onClose}
              className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-[#140601] hover:text-[#ff6b2d]"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="px-3">
            <ul className="space-y-1">
              {items.map((it) => {
                const active = loc.pathname === it.to;
                return (
                  <li key={it.key}>
                    <Link
                      to={it.to}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${active
                        ? 'bg-[#ff6b2d] text-white'
                        : 'text-[#140601] hover:bg-gray-100'
                        }`}
                    >
                      <span className={active ? 'text-white' : 'text-[#140601]'}>{it.icon}</span>
                      <span className="font-medium text-base">{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Admin profile + logout */}
        <div className="px-5 py-5 border-t border-[#14060129]">
          {profileLoading ? (
            <div className="text-center text-sm text-[#9ca3af] py-2">Loading...</div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3 lg:mb-4">
                <img
                  src={profile?.avatar || '/players/Kobe Bryant.avif'}
                  alt="Admin"
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <div className="text-base lg:text-lg font-semibold text-[#111827]">
                    {profile?.firstName && profile?.lastName
                      ? `${profile.firstName} ${profile.lastName}`
                      : profile?.username || 'Admin'}
                  </div>
                  <div className="text-xs sm:text-sm text-[#9ca3af]">{profile?.email || ''}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleLogout}
                  aria-label="Sign out"
                  className="w-full flex items-center justify-center gap-2 bg-white border border-[#ff6b2d] text-[#ff6b2d] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ff6b2d] hover:text-white transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;