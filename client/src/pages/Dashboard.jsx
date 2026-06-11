import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLogs } from '../context/LogContext';
import { RefreshCw } from 'lucide-react';
import CarbonDial from '../components/CarbonDial';
import CategoryCards from '../components/CategoryCards';
import ActivityLogger from '../components/ActivityLogger';
import InsightsTips from '../components/InsightsTips';
import StreakBadge from '../components/StreakBadge';
import WeeklyBarChart from '../components/WeeklyBarChart';

const Dashboard = () => {
  const { user } = useAuth();
  const { todayLogs, todayTotal, loading, fetchTodayLogs } = useLogs();

  useEffect(() => {
    fetchTodayLogs();
  }, [fetchTodayLogs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and reduce your carbon footprint
          </p>
        </div>
        <StreakBadge />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Dial and Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carbon Dial Section */}
          <div className="card">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0">
                <CarbonDial totalKg={todayTotal} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Today's Carbon Footprint
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {todayTotal <= (user?.daily_goal_kg || 6) ? (
                    <>Great job! You're within your daily goal.</>
                  ) : (
                    <>You've exceeded your daily goal. Try to reduce your impact.</>
                  )}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-gray-900 dark:text-white">{todayLogs.length}</p>
                    <p className="text-gray-500 dark:text-gray-400">Activities</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                  <div className="text-center">
                    <p className="font-bold text-gray-900 dark:text-white">{user?.daily_goal_kg || 6} kg</p>
                    <p className="text-gray-500 dark:text-gray-400">Daily Goal</p>
                  </div>
                  {todayTotal > 0 && (
                    <>
                      <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                      <div className="text-center">
                        <p className="font-bold text-amber">{(user?.daily_goal_kg || 6) - todayTotal > 0 ? Math.round(((user?.daily_goal_kg || 6) - todayTotal) * 100) / 100 : 0} kg</p>
                        <p className="text-gray-500 dark:text-gray-400">Remaining</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <CategoryCards todayLogs={todayLogs} />

          {/* Weekly Chart (Desktop) */}
          <div className="hidden lg:block">
            <WeeklyBarChart compact />
          </div>
        </div>

        {/* Right Column - Activity Logger */}
        <div className="space-y-6">
          <ActivityLogger />
          <InsightsTips todayLogs={todayLogs} />
        </div>
      </div>

      {/* Weekly Chart (Mobile) */}
      <div className="lg:hidden mt-6">
        <WeeklyBarChart compact />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-50">
          <div className="flex items-center gap-2 text-green-sage">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="font-medium">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
