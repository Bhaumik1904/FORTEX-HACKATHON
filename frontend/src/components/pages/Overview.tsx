import { RiskIndicators } from '../dashboard/RiskIndicators';
import { TrendCharts } from '../dashboard/TrendCharts';
import { IssueFeed } from '../dashboard/IssueFeed';

export function Overview() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Early Warning Dashboard</h2>
        <p className="text-slate-600">Predictive monitoring to prevent institutional crises before they escalate</p>
      </div>

      <RiskIndicators />
      <TrendCharts />
      <IssueFeed />
    </div>
  );
}