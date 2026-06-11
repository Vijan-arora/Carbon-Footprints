import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Target, Flame, Activity } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import WeeklyBarChart from '../components/WeeklyBarChart';
import MonthlyLineChart from '../components/MonthlyLineChart';

const Reports = () => {
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [weeklyRes, monthlyRes] = await Promise.all([
          api.get('/stats/weekly'),
          api.get('/stats/monthly')
        ]);
        setWeeklyStats(weeklyRes.data);
        setMonthlyStats(monthlyRes.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  const getWeeklyPercentChange = () => {
    if (!weeklyStats || weeklyStats.weekTotal === 0) return { value: 0, isUp: false };
    const avg = weeklyStats.weekTotal / 7;
    const prevAvg = weeklyStats.goal;
    const change = ((avg - prevAvg) / prevAvg) * 100;
    return {
      value: Math.abs(Math.round(change)),
      isUp: change > 0
    };
  };

  const dailyAvg = weeklyStats ? Math.round((weeklyStats.weekTotal / 7) * 100) / 100 : 0;
  const weeklyChange = getWeeklyPercentChange();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your carbon footprint trends over time
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue" />
            </div>
            {weeklyChange.value > 0 && (
              <div className="flex items-center gap-1 text-xs">
                {weeklyChange.isUp ? (
                  <TrendingUp className="w-3 h-3 text-red" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-green-leaf" />
                )}
                <span className={weeklyChange.isUp ? 'text-red' : 'text-green-leaf'}>
                  {weeklyChange.value}%
                </span>
              </div>
            )}
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Daily Average</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {dailyAvg} <span className="text-sm font-normal text-gray-400">kg</span>
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-green-sage/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-sage" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Daily Goal</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.daily_goal_kg || 6} <span className="text-sm font-normal text-gray-400">kg</span>
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.streak_days || 0} <span className="text-sm font-normal text-gray-400">days</span>
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Total</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {monthlyStats?.monthTotal || 0} <span className="text-sm font-normal text-gray-400">kg</span>
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyBarChart />
        <MonthlyLineChart />
      </div>

      {/* Insights */}
      {weeklyStats && (
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-green-sage/10 dark:bg-green-sage/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Day</p>
              <p className="text-lg font-bold text-green-sage mt-1">
                {weeklyStats.bestDay?.date ? new Date(weeklyStats.bestDay.date).toLocaleDateString('en-US', { weekday: 'long' }) : 'N/A'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {weeklyStats.bestDay?.total} kg CO2
              </p>
            </div>
            <div className="p-4 bg-red/10 dark:bg-red/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Highest Impact Day</p>
              <p className="text-lg font-bold text-red mt-1">
                {weeklyStats.worstDay?.date ? new Date(weeklyStats.worstDay.date).toLocaleDateString('en-US', { weekday: 'long' }) : 'N/A'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {weeklyStats.worstDay?.total} kg CO2
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
