import { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { TrendingUp, AlertTriangle, AlertCircle, BarChart3 } from 'lucide-react';

import { API_URL } from '../../services/api';

interface Complaint {
  id: number;
  category: string;
  description: string;
  status: string;
  timestamp: string;
  user_id: number;
  deadline?: string;
}

export function SignalAnalysis() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(`${API_URL}/complaints`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setComplaints(data);
    };

    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);


  // Analyze patterns
  const analyzePatterns = () => {
    // Only analyze active (unresolved) complaints for risk patterns
    const activeComplaints = complaints.filter(c => c.status !== 'Resolved');

    if (activeComplaints.length === 0) return [];

    const categoryCount: Record<string, number> = {};
    const categoryDescriptions: Record<string, string[]> = {};

    const now = new Date();
    const missedDeadlines = complaints.filter(c =>
      c.deadline && new Date(c.deadline) < now && c.status !== 'Resolved'
    );

    activeComplaints.forEach(c => {
      const mainCat = c.category.split(' - ')[0];
      categoryCount[mainCat] = (categoryCount[mainCat] || 0) + 1;
      if (!categoryDescriptions[mainCat]) categoryDescriptions[mainCat] = [];
      categoryDescriptions[mainCat].push(c.description.substring(0, 100));
    });

    const results = Object.entries(categoryCount)
      .filter(([, count]) => count >= 2)
      .map(([category, count]) => ({
        category,
        count,
        trend: 'increasing',
        explanation: `${count} active complaints in ${category.toLowerCase()} category.`,
        impact: count >= 4 ? 'High risk of collective action' : 'Medium risk - requires monitoring',
        timeframe: count >= 4 ? '2-4 days to potential escalation' : '5-7 days monitoring period',
      }));

    if (missedDeadlines.length > 0) {
      results.unshift({
        category: 'Urgent: Missed Deadlines',
        count: missedDeadlines.length,
        trend: 'critical',
        explanation: `${missedDeadlines.length} complaints have exceeded their resolution deadline.`,
        impact: 'Very High risk of immediate escalation and trust loss',
        timeframe: 'Immediate intervention required',
      });
    }

    return results;
  };

  const patterns = analyzePatterns();

  // Generate radar data
  const getRadarData = () => {
    const categoryCount: Record<string, number> = {};
    // Only count unresolved complaints for the risk radar
    const activeComplaints = complaints.filter(c => c.status !== 'Resolved');

    activeComplaints.forEach(c => {
      const cat = c.category.split(' - ')[0];
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const categories = ['Hostel', 'Academic', 'Infrastructure', 'Administrative'];
    return categories.map(cat => ({
      subject: cat,
      value: Math.min((categoryCount[cat] || 0) * 15, 100),
      fullMark: 100,
    }));
  };

  const radarData = getRadarData();

  // Predictive insights
  const getPredictions = () => {
    const totalComplaints = complaints.length;
    const unresolvedCount = complaints.filter(c => c.status !== 'Resolved').length;

    const now = new Date();
    const missedCount = complaints.filter(c =>
      c.deadline && new Date(c.deadline) < now && c.status !== 'Resolved'
    ).length;

    // Dynamic Risk Calculation
    const baseRisk = Math.min(totalComplaints * 5, 50);
    const deadlinePenalty = missedCount * 15; // Significant penalty for missed deadlines
    const currentRisk = Math.min(baseRisk + deadlinePenalty, 98);

    return [
      {
        title: 'Student Unrest Risk',
        current: currentRisk,
        predicted: Math.min(currentRisk + 15, 100),
        days: 7,
        factors: ['Unresolved complaints', 'Missed Deadlines', 'Response delays'],
      },
      {
        title: 'Social Media Escalation',
        current: Math.min(unresolvedCount * 6 + (missedCount * 10), 85),
        predicted: Math.min(unresolvedCount * 10 + (missedCount * 12), 95),
        days: 5,
        factors: ['Student sentiment', 'Complaint volume', 'Delayed Resolutions'],
      },
    ];
  };

  const predictions = getPredictions();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Signal Analysis</h2>
        <p className="text-slate-600">Understanding patterns and escalation risks</p>
      </div>

      {/* Current Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Risk Distribution by Category</h3>
          {complaints.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Radar
                  name="Risk Level"
                  dataKey="value"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-slate-500">
              No data available yet
            </div>
          )}
        </div>

        {/* Predictive Indicators */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Predictive Risk Indicators</h3>
          <div className="space-y-4">
            {predictions.map((insight, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-slate-900">{insight.title}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                    <TrendingUp className="w-3 h-3" />
                    {insight.days}d forecast
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-slate-500">Current</span>
                    <div className="text-xl font-semibold text-slate-900 mt-1">{insight.current}%</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Predicted</span>
                    <div className="text-xl font-semibold text-red-600 mt-1">{insight.predicted}%</div>
                  </div>
                </div>
                <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${insight.predicted}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-medium">Key factors: </span>
                  {insight.factors.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern Analysis */}
      {patterns.length > 0 ? (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Why Risk Is Increasing: Pattern Analysis</h3>
          <div className="space-y-4">
            {patterns.map((pattern, index) => (
              <div key={index} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold text-slate-900">{pattern.category} Issues</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-red-900">{pattern.count} complaints</span>
                    <span className="text-xs px-2 py-1 bg-red-200 text-red-900 rounded font-semibold">
                      ↑ {pattern.trend.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 ml-7">
                  <div>
                    <span className="text-sm font-medium text-slate-700">Pattern Detected:</span>
                    <p className="text-sm text-slate-600 mt-1">{pattern.explanation}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-slate-700">Potential Impact:</span>
                    <p className="text-sm text-slate-600 mt-1">{pattern.impact}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-900">
                      Escalation Window: {pattern.timeframe}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-12 shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-medium text-slate-900 mb-2">No patterns detected yet</h3>
          <p className="text-slate-600">AI will analyze complaints as they are submitted</p>
        </div>
      )}

      {/* Recommended Actions */}
      {patterns.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-900 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Recommended Preventive Actions</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span className="font-semibold">1.</span>
                  <span>Assign dedicated team to address {patterns[0].category.toLowerCase()} complaints within 24 hours</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">2.</span>
                  <span>Publish status updates and action timeline to prevent student frustration</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Proactive communication to students acknowledging concerns</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">4.</span>
                  <span>Monitor social media and student forums for escalation signals</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}