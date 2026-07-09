import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import axiosInstance from '../../../services/axiosInstance';
import { ENDPOINT } from '../../../services/httpEndpoint';

export const LeaderTable = ({ title, rows, loading, error }) => {
  if (loading) {
    return (
      <div className="rounded-2xl p-6 flex-1 shadow-sm bg-linear-to-br from-[#f8b095] via-[#f7eeeb] to-[#f7eeeb] flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin text-[#ff6b2d]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 flex-1 shadow-sm bg-linear-to-br from-[#f8b095] via-[#f7eeeb] to-[#f7eeeb]">
        <h3 className="text-xl lg:text-2xl font-semibold text-[#111827] mb-4" style={{ fontFamily: 'var(--font-secondary)' }}>
          {title}
        </h3>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-0 flex-1 shadow-sm bg-linear-to-br from-[#f8b095] via-[#f7eeeb] to-[#f7eeeb]">
      <div className="p-4 rounded-t-2xl">
        <h3 className="text-xl lg:text-2xl font-semibold text-[#111827] mb-0" style={{ fontFamily: 'var(--font-secondary)' }}>
          {title}
        </h3>
      </div>

      <div className="p-4">
        {rows.length > 0 ? (
          <ul className="space-y-3.5">
            {rows.map((r, index) => {
              const initials = (r.name || r.userName || 'U')
                .split(' ')
                .map((word) => word[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);

              return (
                <li key={`${r.name || r.userName}-${index}`} className="bg-white rounded-lg p-3 flex items-center gap-3">
                  <span className="text-sm lg:text-base font-bold text-[#564a45] w-6">#{r.rank || index + 1}</span>
                  <div className="w-9 lg:w-12 lg:h-12 h-9 rounded-full bg-[#ffe4d4] flex items-center justify-center text-xs lg:text-base font-bold text-[#ff6b2d] shrink-0">
                    {initials}
                  </div>
                  <span className="flex-1 text-sm lg:text-base xl:text-lg font-bold text-[#140601]">
                    {r.name || r.userName || 'Unknown'}
                  </span>
                  <span className="text-lg lg:text-xl xl:text-2xl font-medium text-[#ff6b2d]" style={{ fontFamily: 'var(--font-display)' }}>
                    {r.score || r.points || 0}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-8 text-[#111827]">No data available</div>
        )}
      </div>
    </div>
  );
};

const Leadboard = () => {
  const [dailyData, setDailyData] = useState([]);
  const [globalData, setGlobalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch daily leaderboard
      const dailyResponse = await axiosInstance.get(ENDPOINT.LEADERBOARD.DAILY);
      const daily = dailyResponse.data?.data || [];
      setDailyData(daily);

      // Fetch global leaderboard
      const globalResponse = await axiosInstance.get(`${ENDPOINT.LEADERBOARD.GLOBAL}?limit=50`);
      const global = globalResponse.data?.data || [];
      setGlobalData(global);
    } catch (err) {
      console.error('Failed to fetch leaderboard data:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      <h2 className="text-3xl font-bold text-[#111827] mb-1" style={{ fontFamily: 'var(--font-primary)' }}>
        Leaderboard
      </h2>
      <p className="text-base sm:text-lg text-[#6b7280] mb-6">Track today&apos;s best and all-time top players</p>

      <div className="flex flex-col lg:flex-row gap-4 xl:gap-6">
        <LeaderTable title="Daily top scorers" rows={dailyData} loading={loading} error={error} />
        <LeaderTable title="Global top scorers" rows={globalData} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default Leadboard;
