import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';

const detailedRiskData = [
  { week: 'Week 1', hostel: 22, academic: 18, infrastructure: 15, response: 12, sentiment: 55 },
  { week: 'Week 2', hostel: 25, academic: 21, infrastructure: 18, response: 15, sentiment: 58 },
  { week: 'Week 3', hostel: 28, academic: 24, infrastructure: 20, response: 18, sentiment: 60 },
  { week: 'Week 4', hostel: 32, academic: 24, infrastructure: 18, response: 15, sentiment: 62 },
];

const radarData = [
  { subject: 'Hostel Issues', value: 72, fullMark: 100 },
  { subject: 'Academic Admin', value: 58, fullMark: 100 },
  { subject: 'Infrastructure', value: 48, fullMark: 100 },
  { subject: 'Response Delays', value: 65, fullMark: 100 },
  { subject: 'Student Sentiment', value: 62, fullMark: 100 },
];

const signalExplanations = [
  {
    category: 'Hostel Maintenance',
    signals: 32,
    trend: 'increasing',
    explanation: 'Repeated complaints concentrated in specific blocks (C, D, E). Water supply and electrical issues unresolved for 6+ days. Language analysis shows increasing frustration markers.',
    impact: 'High risk of collective action or social media escalation',
    timeframe: '3-5 days to potential crisis',
  },
  {
    category: 'Academic Delays',
    signals: 24,
    trend: 'increasing',
    explanation: 'Exam results delayed beyond promised dates. Grade submissions pending from 4 departments. Student queries to administration increasing exponentially.',
    impact: 'Medium-high risk of formal complaints or parent intervention',
    timeframe: '5-7 days to escalation',
  },
  {
    category: 'Infrastructure Concerns',
    signals: 18,
    trend: 'stable',
    explanation: 'Library air conditioning, classroom furniture issues. Not urgent but contributing to overall dissatisfaction. Multiple channels reporting same issues.',
    impact: 'Contributing to overall institutional risk score',
    timeframe: 'Gradual accumulation',
  },
];

const predictiveInsights = [
  {
    title: 'Protest Risk Indicator',
    current: 68,
    predicted: 78,
    days: 7,
    factors: ['Hostel issues', 'Academic delays', 'Response time'],
  },
  {
    title: 'Social Media Escalation',
    current: 45,
    predicted: 62,
    days: 5,
    factors: ['Student sentiment', 'Unresolved complaints'],
  },
  {
    title: 'Parent/Media Attention',
    current: 32,
    predicted: 48,
    days: 10,
    factors: ['Academic delays', 'Safety concerns'],
  },
];

export function RiskAnalysis() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Signal Analysis</h2>
        <p className="text-slate-600">Understanding why institutional risk is increasing</p>
      </div>

      {/* Signal Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Warning Signal Trends (4 Weeks)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={detailedRiskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="week" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            <Line type="monotone" dataKey="hostel" stroke="#dc2626" strokeWidth={2} name="Hostel Issues" />
            <Line type="monotone" dataKey="academic" stroke="#f59e0b" strokeWidth={2} name="Academic Delays" />
            <Line type="monotone" dataKey="infrastructure" stroke="#3b82f6" strokeWidth={2} name="Infrastructure" />
            <Line type="monotone" dataKey="response" stroke="#8b5cf6" strokeWidth={2} name="Response Delays" />
            <Line type="monotone" dataKey="sentiment" stroke="#64748b" strokeWidth={2} name="Sentiment Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Current Risk Distribution</h3>
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
        </div>

        {/* Predictive Indicators */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Predictive Risk Indicators</h3>
          <div className="space-y-4">
            {predictiveInsights.map((insight, index) => (
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

      {/* Detailed Signal Explanations */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Why Risk Is Increasing: Detailed Analysis</h3>
        <div className="space-y-4">
          {signalExplanations.map((signal, index) => (
            <div key={index} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-slate-900">{signal.category}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-red-900">{signal.signals} signals</span>
                  <span className="text-xs px-2 py-1 bg-red-200 text-red-900 rounded font-semibold">
                    {signal.trend === 'increasing' ? '↑ INCREASING' : '→ STABLE'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 ml-7">
                <div>
                  <span className="text-sm font-medium text-slate-700">Pattern Detected:</span>
                  <p className="text-sm text-slate-600 mt-1">{signal.explanation}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-slate-700">Potential Impact:</span>
                  <p className="text-sm text-slate-600 mt-1">{signal.impact}</p>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-900">
                    Escalation Window: {signal.timeframe}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-900 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Recommended Preventive Actions</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="font-semibold">1.</span>
                <span>Immediate intervention on hostel maintenance (Blocks C, D, E) - assign dedicated team within 24 hours</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">2.</span>
                <span>Publish clear timeline for pending exam results with daily progress updates</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">3.</span>
                <span>Proactive communication to students addressing identified concerns before they escalate</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">4.</span>
                <span>Establish rapid response protocol for complaints exceeding 48-hour threshold</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
