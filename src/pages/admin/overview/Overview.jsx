import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import StatCard from './components/StatCard';
import { LeaderTable } from '../leaderboard/Leadboard';
import axiosInstance from '../../../services/axiosInstance';
import { ENDPOINT } from '../../../services/httpEndpoint';

const Overview = () => {
  const [metrics, setMetrics] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [globalData, setGlobalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(ENDPOINT.ANALYTICS.OVERVIEW);
      const data = response.data?.data;

      setMetrics(data?.metrics || null);
      setDailyData(data?.leaderboards?.daily?.data || []);
      setGlobalData(data?.leaderboards?.global?.data || []);
    } catch (err) {
      console.error('Failed to fetch analytics overview:', err);
      setError('Failed to load overview data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      <h2
        className="mb-1 text-3xl font-bold text-[#111827]"
        style={{ fontFamily: 'var(--font-primary)' }}
      >
        Overview
      </h2>
      <p className="mb-6 text-base text-[#6b7280] sm:text-lg">
        Real-time performance metrics and game health.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label={metrics?.activePlayers?.label || 'Active Players'}
          value={metrics ? `${metrics.activePlayers.total.toLocaleString()}+` : '—'}
          subLabel={metrics ? `Total: ${metrics.activePlayers.total.toLocaleString()}` : null}
          imgSrc="/adminStats/Active_Player.png"
        />
        <StatCard
          label={metrics?.activeUsers?.label || 'Active Users'}
          value={metrics ? `${metrics.activeUsers.total.toLocaleString()}+` : '—'}
          subLabel={metrics ? `Total: ${metrics.activeUsers.total.toLocaleString()}` : null}
          imgSrc="/adminStats/Active_User.png"
        />
        <StatCard
          label={metrics?.totalSessions?.label || 'Total Sessions'}
          value={metrics ? `${metrics.totalSessions.count.toLocaleString()}+` : '—'}
          subLabel={metrics ? `Today: ${metrics.totalSessions.today.toLocaleString()}` : null}
          imgSrc="/adminStats/Total_Sessions.png"
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row xl:gap-6">
        <LeaderTable title="Daily top scorers" rows={dailyData} loading={loading} error={error} />
        <LeaderTable title="Global top scorers" rows={globalData} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default Overview;
