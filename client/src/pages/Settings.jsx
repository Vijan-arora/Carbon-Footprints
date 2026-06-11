import { useAuth } from '../context/AuthContext';
import { Mail, Calendar, Flame, Leaf, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GoalSetter from '../components/GoalSetter';
import StreakBadge from '../components/StreakBadge';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your profile and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-sage to-green-leaf flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
              </div>
              <StreakBadge />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-sage/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-sage" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Daily Goal</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.daily_goal_kg} kg</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current Streak</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.streak_days || 0} days</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Goal Setter */}
          <GoalSetter />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full p-4 flex items-center justify-between bg-red/5 hover:bg-red/10 rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red" />
              <span className="font-medium text-red">Sign Out</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Facts</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">World Average</p>
                <p className="font-bold text-gray-900 dark:text-white">4.0 kg/day</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">US Average</p>
                <p className="font-bold text-gray-900 dark:text-white">16.1 kg/day</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Sustainable Target</p>
                <p className="font-bold text-gray-900 dark:text-white">2.0 kg/day</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-sage/20 to-green-leaf/10 rounded-xl border border-green-sage/20">
            <div className="flex items-start gap-3">
              <Leaf className="w-6 h-6 text-green-sage flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Making an Impact</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Every kilogram counts. By tracking your emissions, you're taking the first step toward a more sustainable lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
