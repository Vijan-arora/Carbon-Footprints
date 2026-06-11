import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Target, Check } from 'lucide-react';
import api from '../api/axios';

const GoalSetter = () => {
  const { user, updateUser } = useAuth();
  const [goal, setGoal] = useState(user?.daily_goal_kg || 6);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put('/user/goal', { daily_goal_kg: goal });
      updateUser(response.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error saving goal:', err);
    } finally {
      setSaving(false);
    }
  };

  const getGoalStatus = (value) => {
    if (value <= 4) return { status: 'Ambitious', color: 'text-green-leaf', bgColor: 'bg-green-leaf/10' };
    if (value <= 7) return { status: 'Moderate', color: 'text-blue', bgColor: 'bg-blue/10' };
    return { status: 'Flexible', color: 'text-amber', bgColor: 'bg-amber/10' };
  };

  const goalStatus = getGoalStatus(goal);

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-green-sage" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Goal</h3>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Set your daily carbon budget
            </label>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${goalStatus.color} ${goalStatus.bgColor}`}>
              {goalStatus.status}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={goal}
            onChange={(e) => setGoal(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-sage"
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">1 kg</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {goal} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">kg</span>
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">20 kg</span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {goal <= 4 ? (
              <>An ambitious goal! Great for reducing your footprint significantly. Consider carpooling, renewable energy, and plant-based meals.</>
            ) : goal <= 7 ? (
              <>A balanced goal. The average person emits about 4-6 kg daily. You're setting a realistic target for sustainable living.</>
            ) : (
              <>A flexible goal. This allows for higher-emission activities while still being mindful of your carbon impact.</>
            )}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || goal === user?.daily_goal_kg}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : saving ? (
            'Saving...'
          ) : (
            'Save Goal'
          )}
        </button>
      </div>
    </div>
  );
};

export default GoalSetter;
