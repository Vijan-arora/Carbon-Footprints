import { useState, useEffect } from 'react';
import { useLogs } from '../context/LogContext';
import { Car, Zap, UtensilsCrossed, ShoppingBag, Plus, Trash2, ChevronDown } from 'lucide-react';
import api from '../api/axios';

const categoryTabs = [
  { id: 'Transport', icon: Car, color: 'text-blue' },
  { id: 'Energy', icon: Zap, color: 'text-amber' },
  { id: 'Food', icon: UtensilsCrossed, color: 'text-green-sage' },
  { id: 'Shopping', icon: ShoppingBag, color: 'text-purple-500' },
];

const ActivityLogger = () => {
  const { todayLogs, addLog, deleteLog, fetchTodayLogs } = useLogs();
  const [activeTab, setActiveTab] = useState('Transport');
  const [factors, setFactors] = useState({});
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [factorsLoading, setFactorsLoading] = useState(true);

  useEffect(() => {
    fetchTodayLogs();
  }, [fetchTodayLogs]);

  useEffect(() => {
    const fetchFactors = async () => {
      try {
        const response = await api.get('/factors');
        setFactors(response.data);
      } catch (err) {
        console.error('Error fetching factors:', err);
      } finally {
        setFactorsLoading(false);
      }
    };
    fetchFactors();
  }, []);

  const currentFactors = factors[activeTab] || [];

  const handleLog = async () => {
    if (!selectedActivity || !quantity) return;

    setLoading(true);
    try {
      await addLog({
        category: activeTab,
        activity_name: selectedActivity.name,
        quantity: parseFloat(quantity),
        emission_factor: selectedActivity.factor_per_unit
      });
      setSelectedActivity(null);
      setQuantity('');
    } catch (err) {
      console.error('Error logging activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (logId) => {
    try {
      await deleteLog(logId);
    } catch (err) {
      console.error('Error deleting log:', err);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Log Activity</h3>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categoryTabs.map(({ id, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              setSelectedActivity(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === id
                ? 'bg-green-sage text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Icon className={`w-4 h-4 ${activeTab === id ? 'text-white' : color}`} />
            {id}
          </button>
        ))}
      </div>

      {/* Activity Selection */}
      <div className="space-y-4">
        <div className="relative">
          <select
            value={selectedActivity?.id || ''}
            onChange={(e) => {
              const activity = currentFactors.find(f => f.id === parseInt(e.target.value));
              setSelectedActivity(activity || null);
            }}
            className="input appearance-none pr-10"
            disabled={factorsLoading}
          >
            <option value="">Select activity...</option>
            {currentFactors.map(factor => (
              <option key={factor.id} value={factor.id}>
                {factor.name} ({factor.factor_per_unit} kg/{factor.unit})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {selectedActivity && (
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Enter ${selectedActivity.unit}`}
                className="input"
                min="0"
                step={
                  selectedActivity.unit === 'unit' ||
                  selectedActivity.unit === 'item' ||
                  selectedActivity.unit === 'device' ||
                  selectedActivity.unit === 'package' ||
                  selectedActivity.unit === 'bag' ||
                  selectedActivity.unit === 'meal' ? '1' : '0.1'
                }
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Unit: {selectedActivity.unit}
              </p>
            </div>
            <button
              onClick={handleLog}
              disabled={loading || !quantity}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Log
            </button>
          </div>
        )}

        {selectedActivity && quantity && (
          <div className="p-3 bg-green-sage/10 dark:bg-green-sage/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Estimated impact: <span className="font-bold text-green-sage">
                {(parseFloat(quantity) * selectedActivity.factor_per_unit).toFixed(2)} kg CO2
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Today's Activity Feed */}
      {todayLogs.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Today's Activities</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {todayLogs.map(log => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{log.activity_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {log.quantity} {log.unit || ''} · {formatTime(log.logged_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-green-sage text-sm">
                    {log.total_kg.toFixed(2)} kg
                  </span>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-red hover:bg-red/10 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogger;
