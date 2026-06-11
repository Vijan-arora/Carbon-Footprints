import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CarbonDial = ({ totalKg, animated = true }) => {
  const { user } = useAuth();
  const [animatedValue, setAnimatedValue] = useState(0);
  const [mounted, setMounted] = useState(false);

  const goal = user?.daily_goal_kg || 6;

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setAnimatedValue(totalKg);
    }, 100);
    return () => clearTimeout(timer);
  }, [totalKg]);

  const displayValue = animated ? animatedValue : totalKg;
  const percentage = Math.min((displayValue / goal) * 100, 100);

  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 60) return { stroke: '#639922', badge: 'Excellent', bg: 'bg-green-leaf' };
    if (percentage < 85) return { stroke: '#EF9F27', badge: 'On Track', bg: 'bg-amber' };
    return { stroke: '#E24B4A', badge: 'High', bg: 'bg-red' };
  };

  const { stroke, badge, bg } = getColor();

  // SVG arc calculation
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;

  // Arc goes from 135deg to 45deg (270 degree sweep)
  const arcLength = circumference * 0.75;
  const offset = arcLength - (arcLength * (animatedValue / goal > 1 ? 1 : animatedValue / goal));

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        {/* Background arc */}
        <svg className="w-full h-full transform -rotate-[150deg]" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className="text-gray-200 dark:text-gray-700"
            strokeDasharray={`${arcLength} ${circumference}`}
          />
          {/* Progress arc */}
          {mounted && (
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={stroke}
              strokeWidth="12"
              strokeLinecap="round"
              className="dial-arc"
              strokeDasharray={arcLength}
              strokeDashoffset={offset}
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {displayValue.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">kg CO2</span>
          <span className="mt-2 text-xs text-gray-400 dark:text-gray-500">Goal: {goal} kg</span>
        </div>
      </div>

      {/* Badge */}
      <div className={`mt-4 px-4 py-1.5 rounded-full ${bg} text-white font-medium text-sm`}>
        {badge}
      </div>
    </div>
  );
};

export default CarbonDial;
