import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RiskIndicator {
  id: string;
  title: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  value: number;
  change: number;
  unit: string;
}

const indicators: RiskIndicator[] = [
  {
    id: '1',
    title: 'Institutional Risk Score',
    level: 'high',
    value: 68,
    change: 12,
    unit: '/100',
  },
  {
    id: '2',
    title: 'Active Warning Signals',
    level: 'high',
    value: 24,
    change: 8,
    unit: 'signals',
  },
  {
    id: '3',
    title: 'Average Resolution Time',
    level: 'medium',
    value: 8.4,
    change: 2.1,
    unit: 'days',
  },
  {
    id: '4',
    title: 'Student Sentiment Index',
    level: 'medium',
    value: 62,
    change: -5,
    unit: '/100',
  },
];

const levelColors = {
  critical: 'border-red-600 bg-red-50',
  high: 'border-orange-500 bg-orange-50',
  medium: 'border-yellow-500 bg-yellow-50',
  low: 'border-blue-500 bg-blue-50',
};

const levelTextColors = {
  critical: 'text-red-900',
  high: 'text-orange-900',
  medium: 'text-yellow-900',
  low: 'text-blue-900',
};

export function RiskIndicators() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {indicators.map((indicator) => (
        <div
          key={indicator.id}
          className={`bg-white border-l-4 ${levelColors[indicator.level]} rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-600">{indicator.title}</h3>
            {(indicator.level === 'critical' || indicator.level === 'high') && (
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            )}
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-semibold ${levelTextColors[indicator.level]}`}>
              {indicator.value}
            </span>
            <span className="text-sm text-slate-500">{indicator.unit}</span>
          </div>
          <div className="flex items-center gap-1">
            {indicator.change > 0 && (
              <>
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-600">+{indicator.change}</span>
              </>
            )}
            {indicator.change < 0 && (
              <>
                <TrendingDown className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">{indicator.change}</span>
              </>
            )}
            {indicator.change === 0 && (
              <>
                <Minus className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500">No change</span>
              </>
            )}
            <span className="text-xs text-slate-400 ml-1">vs. last week</span>
          </div>
        </div>
      ))}
    </div>
  );
}