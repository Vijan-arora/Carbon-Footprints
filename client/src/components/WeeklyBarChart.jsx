import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const WeeklyBarChart = ({ compact = false }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const goal = user?.daily_goal_kg || 6;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats/weekly');
        const chartData = response.data.days.map(day => ({
          date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
          total: day.total,
          fullDate: day.date
        }));
        setData(chartData);
      } catch (err) {
        console.error('Error fetching weekly stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getBarColor = (value) => {
    if (value < goal * 0.6) return '#639922';
    if (value < goal * 0.85) return '#EF9F27';
    return '#E24B4A';
  };

  const CustomBar = (props) => {
    const { x, y, width, height, value } = props;
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={getBarColor(value)}
        rx={4}
        ry={4}
      />
    );
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
          <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className={compact ? 'text-base font-semibold text-gray-900 dark:text-white mb-4' : 'text-lg font-semibold text-gray-900 dark:text-white mb-6'}>
        This Week
      </h3>
      <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
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
            y={goal}
            stroke="#EF9F27"
            strokeDasharray="5 5"
            label={{ value: 'Goal', position: 'right', fill: '#EF9F27', fontSize: 12 }}
          />
          <Bar
            dataKey="total"
            shape={<CustomBar />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyBarChart;
