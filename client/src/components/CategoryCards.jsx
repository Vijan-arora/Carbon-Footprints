import { Car, Zap, UtensilsCrossed, ShoppingBag, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api/axios';

const categoryIcons = {
  Transport: Car,
  Energy: Zap,
  Food: UtensilsCrossed,
  Shopping: ShoppingBag,
};

const categoryColors = {
  Transport: 'from-blue to-blue-600',
  Energy: 'from-amber to-amber-600',
  Food: 'from-green-sage to-green-dark',
  Shopping: 'from-purple-500 to-purple-600',
};

const CategoryCards = ({ todayLogs }) => {
  const [yesterdayTotals, setYesterdayTotals] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYesterday = async () => {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split('T')[0];

        const response = await api.get(`/logs?date=${dateStr}`);
        const yesterdayLogs = response.data;

        const totals = {};
        yesterdayLogs.forEach(log => {
          totals[log.category] = (totals[log.category] || 0) + log.total_kg;
        });

        Object.keys(totals).forEach(key => {
          totals[key] = Math.round(totals[key] * 100) / 100;
        });

        setYesterdayTotals(totals);
      } catch (err) {
        console.error('Error fetching yesterday logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchYesterday();
  }, []);

  // Calculate today's totals by category
  const todayTotals = {};
  todayLogs.forEach(log => {
    todayTotals[log.category] = (todayTotals[log.category] || 0) + log.total_kg;
  });

  Object.keys(todayTotals).forEach(key => {
    todayTotals[key] = Math.round(todayTotals[key] * 100) / 100;
  });

  const categories = ['Transport', 'Energy', 'Food', 'Shopping'];

  const getPercentChange = (category) => {
    const today = todayTotals[category] || 0;
    const yesterday = yesterdayTotals[category] || 0;

    if (yesterday === 0) {
      return today > 0 ? { value: 100, isUp: true } : { value: 0, isUp: false };
    }

    const change = ((today - yesterday) / yesterday) * 100;
    return {
      value: Math.abs(Math.round(change)),
      isUp: change > 0
    };
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {categories.map(category => {
        const Icon = categoryIcons[category];
        const total = todayTotals[category] || 0;
        const change = getPercentChange(category);
        const gradient = categoryColors[category];

        return (
          <div key={category} className="card group hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs">
                {change.isUp ? (
                  <TrendingUp className="w-3 h-3 text-red" />
                ) : change.value === 0 ? (
                  <Minus className="w-3 h-3 text-gray-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-green-leaf" />
                )}
                <span className={change.isUp ? 'text-red' : change.value === 0 ? 'text-gray-400' : 'text-green-leaf'}>
                  {change.value}%
                </span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{category}</h3>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {total.toFixed(1)} <span className="text-sm font-normal text-gray-400">kg</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryCards;
