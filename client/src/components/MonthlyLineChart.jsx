import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MonthlyLineChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const { user } = useAuth();
  const goal = user?.daily_goal_kg || 6;
  const worldAvg = 4.0;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats/monthly');
        const chartData = response.data.days.map(day => ({
          date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          total: day.total,
          fullDate: day.date
        }));
        setData(chartData);
        setStats({
          monthTotal: response.data.monthTotal,
          savedVsWorldAvg: response.data.savedVsWorldAvg
        });
      } catch (err) {
        console.error('Error fetching monthly stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Overview</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 days emissions</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.monthTotal} kg</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Total</p>
          </div>
          {stats.savedVsWorldAvg > 0 && (
            <div className="text-center px-3 py-1 bg-green-sage/10 rounded-lg">
              <p className="text-lg font-bold text-green-sage">{stats.savedVsWorldAvg} kg</p>
              <p className="text-xs text-green-sage/80">Saved vs World Avg</p>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A7C59" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4A7C59" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value) => [`${value} kg CO2`, 'Emissions']}
          />
          <ReferenceLine
            y={worldAvg}
            stroke="#378ADD"
            strokeDasharray="5 5"
            label={{ value: 'World Avg', position: 'right', fill: '#378ADD', fontSize: 11 }}
          />
          <ReferenceLine
            y={goal}
            stroke="#EF9F27"
            strokeDasharray="5 5"
            label={{ value: 'Your Goal', position: 'right', fill: '#EF9F27', fontSize: 11 }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#4A7C59"
            strokeWidth={2}
            fill="url(#colorTotal)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-green-sage"></div>
          <span className="text-gray-600 dark:text-gray-400">Your Emissions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-amber border-dashed"></div>
          <span className="text-gray-600 dark:text-gray-400">Your Goal ({goal} kg)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue border-dashed"></div>
          <span className="text-gray-600 dark:text-gray-400">World Avg ({worldAvg} kg)</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyLineChart;
