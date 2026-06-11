import { Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StreakBadge = () => {
  const { user } = useAuth();
  const streak = user?.streak_days || 0;

  if (streak < 1) return null;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber rounded-full shadow-sm">
      <Flame className="w-5 h-5 text-white" />
      <span className="font-semibold text-white">
        {streak}-day streak
      </span>
    </div>
  );
};

export default StreakBadge;
