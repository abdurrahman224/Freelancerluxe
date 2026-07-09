import { useState, useEffect } from 'react';
import { Loader, X } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import { ENDPOINT } from '../services/httpEndpoint';

export default function LeaderboardModal({ onClose }) {
  const [tab, setTab] = useState('daily');
  const [dailyData, setDailyData] = useState([]);
  const [globalData, setGlobalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboardData(tab);
  }, [tab]);

  const fetchLeaderboardData = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = type === 'daily' ? ENDPOINT.LEADERBOARD.DAILY : ENDPOINT.LEADERBOARD.GLOBAL;
      const url = type === 'global' ? `${endpoint}?limit=50` : endpoint;
      const response = await axiosInstance.get(url);
      
      const data = response.data?.data || [];
      
      if (type === 'daily') {
        setDailyData(data);
      } else {
        setGlobalData(data);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type} leaderboard:`, err);
      setError(`Failed to load ${type} leaderboard`);
    } finally {
      setLoading(false);
    }
  };

  const leaderboardList = tab === 'daily' ? dailyData : globalData;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/35 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-2xl bg-[#F6EEEB] dark:bg-[#140601] rounded-2xl p-6 shadow-2xl animate-[lb-pop_0.25s_ease-out] border border-gray-200 dark:border-white/10"
       
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-xl lg:text-2xl font-normal text-[#140601] dark:text-[#FFF8F5]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Leaderboard
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-(--hero-muted) dark:text-[#FFF8F5] hover:bg-black/6 transition-colors text-base border-none bg-transparent cursor-pointer"
          >
            <X />
          </button>
        </div>


        <div className="flex gap-4 mb-5">
          <button
            onClick={() => setTab('daily')}
            className={`flex-1 py-2.5 text-xs sm:text-sm lg:text-base font-bold rounded-lg border-2 border-[#ff6b2d] transition-all duration-200 cursor-pointer ${
              tab === 'daily'
                ? 'bg-[#ff6b2d] text-white'
                : 'bg-transparent text-[#ff6b2d] hover:bg-[#ff6b2d]/10'
            }`}
            style={{ fontFamily: 'var(--font-primary)' }}
          >
            Daily top scorers
          </button>
          <button
            onClick={() => setTab('global')}
            className={`flex-1 py-2.5 text-xs sm:text-sm lg:text-base font-bold rounded-lg border-2 border-[#ff6b2d] transition-all duration-200 cursor-pointer ${
              tab === 'global'
                ? 'bg-[#ff6b2d] text-white'
                : 'bg-transparent text-[#ff6b2d] hover:bg-[#ff6b2d]/10'
            }`}
            style={{ fontFamily: 'var(--font-primary)' }}
          >
            Global top scorers
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2 h-96">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader size={40} className="animate-spin text-[#ff6b2d]" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          ) : leaderboardList.length > 0 ? (
            leaderboardList.map((item, index) => (
              <div
                key={`${item.name || item.userName}-${index}`}
                className="flex items-center justify-between px-4 py-3 bg-[#FFF8F5] dark:bg-[rgba(255,255,255,0.02)] rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm sm:text-base lg:text-xl font-bold text-[#140601] dark:text-[#FFF8F5] min-w-9" style={{ fontFamily: 'var(--font-primary)' }}>
                    #{item.rank || index + 1}
                  </span>
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-xl" style={{ background: 'var(--hero-overlay)' }}>
                    {item.avatar || '👤'}
                  </span>
                  <span className="text-sm sm:text-base lg:text-xl font-semibold text-[#140601] dark:text-[#FFF8F5] truncate" style={{ fontFamily: 'var(--font-primary)' }}>
                    {item.name || item.userName || 'Unknown'}
                  </span>
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#ff6b2d] ml-4" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.score || item.points || 0}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#140601] dark:text-[#FFF8F5]">
              No leaderboard data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
