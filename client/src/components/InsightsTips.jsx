import { useState } from 'react';
import { Lightbulb, Car, Zap, UtensilsCrossed, ShoppingBag, ChevronRight, X } from 'lucide-react';

const categoryIcons = {
  Transport: Car,
  Energy: Zap,
  Food: UtensilsCrossed,
  Shopping: ShoppingBag,
};

const tips = {
  Transport: [
    { title: 'Use public transport', savings: 0.12, description: 'Taking the bus instead of driving saves 0.12 kg/km on emissions.' },
    { title: 'Carpool when possible', savings: 0.105, description: 'Sharing rides cuts your footprint in half per person.' },
    { title: 'Walk or bike short trips', savings: 0.21, description: 'Zero-emission transport for trips under 2km.' },
    { title: 'Combine errands', savings: 0.5, description: 'Plan your route to avoid multiple trips and save fuel.' },
  ],
  Energy: [
    { title: 'Turn off unused lights', savings: 0.02, description: 'Each bulb saves about 0.02 kg per hour of use avoided.' },
    { title: 'Set AC to 24°C', savings: 0.3, description: 'Each degree higher saves about 5% on cooling emissions.' },
    { title: 'Unplug standby devices', savings: 0.05, description: 'Standby power can account for 5% of household energy.' },
    { title: 'Use natural light', savings: 0.1, description: 'Open curtains during the day instead of artificial lighting.' },
  ],
  Food: [
    { title: 'Try meatless Mondays', savings: 1.0, description: 'One vegetarian day saves about 1 kg vs a beef meal.' },
    { title: 'Reduce food waste', savings: 0.5, description: 'Planning meals reduces waste by up to 25%.' },
    { title: 'Eat locally grown', savings: 0.2, description: 'Local produce has lower transport emissions.' },
    { title: 'Choose chicken over beef', savings: 4.2, description: 'Chicken emits about 70% less than beef per meal.' },
  ],
  Shopping: [
    { title: 'Buy secondhand clothing', savings: 13.5, description: 'Pre-loved clothes save nearly the full production footprint.' },
    { title: 'Bring reusable bags', savings: 0.08, description: 'Each plastic bag avoided saves its full weight in emissions.' },
    { title: 'Repair instead of replace', savings: 350, description: 'Extending device life avoids manufacturing emissions.' },
    { title: 'Choose minimal packaging', savings: 0.3, description: 'Less packaging means less waste and transport weight.' },
  ],
};

const InsightsTips = ({ todayLogs }) => {
  const [expandedTip, setExpandedTip] = useState(null);
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  // Find highest category
  const categoryTotals = {};
  todayLogs.forEach(log => {
    categoryTotals[log.category] = (categoryTotals[log.category] || 0) + log.total_kg;
  });

  const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  if (!highestCategory) {
    return (
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-amber">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Daily Tips</h3>
          </div>
          <button onClick={() => setClosed(true)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Start logging activities to receive personalized tips for reducing your carbon footprint.
        </p>
      </div>
    );
  }

  const [category, total] = highestCategory;
  const Icon = categoryIcons[category];
  const categoryTips = tips[category] || [];

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Tips to Improve</h3>
        </div>
        <button onClick={() => setClosed(true)} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Your highest impact today is <span className="font-medium">{category}</span> at {total.toFixed(1)} kg.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {categoryTips.slice(0, 3).map((tip, idx) => (
          <div
            key={idx}
            onClick={() => setExpandedTip(expandedTip === idx ? null : idx)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              expandedTip === idx
                ? 'bg-green-sage/10 dark:bg-green-sage/20'
                : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                expandedTip === idx ? 'text-green-sage' : 'text-gray-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{tip.title}</p>
                  <span className="text-xs font-medium text-green-sage whitespace-nowrap">
                    -{tip.savings} kg
                  </span>
                </div>
                {expandedTip === idx && (
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    {tip.description}
                  </p>
                )}
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                expandedTip === idx ? 'rotate-90' : ''
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsTips;
