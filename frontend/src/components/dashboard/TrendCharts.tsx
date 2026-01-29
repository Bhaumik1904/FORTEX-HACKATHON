import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const riskTrendData = [
  { date: 'Jan 21', risk: 42, signals: 12 },
  { date: 'Jan 22', risk: 45, signals: 14 },
  { date: 'Jan 23', risk: 48, signals: 16 },
  { date: 'Jan 24', risk: 52, signals: 18 },
  { date: 'Jan 25', risk: 58, signals: 20 },
  { date: 'Jan 26', risk: 64, signals: 22 },
  { date: 'Jan 27', risk: 68, signals: 24 },
];

const categoryData = [
  { category: 'Hostel Issues', count: 32 },
  { category: 'Academic Delays', count: 24 },
  { category: 'Infrastructure', count: 18 },
  { category: 'Admin Response', count: 15 },
  { category: 'Student Concerns', count: 11 },
];

export function TrendCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Trend Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Institutional Risk Trend (7 Days)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={riskTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
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
            <Line 
              type="monotone" 
              dataKey="risk" 
              stroke="#dc2626" 
              strokeWidth={2.5}
              name="Risk Score"
              dot={{ fill: '#dc2626', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="signals" 
              stroke="#1e40af" 
              strokeWidth={2.5}
              name="Warning Signals"
              dot={{ fill: '#1e40af', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Warning Signals by Category</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="category" 
              tick={{ fill: '#64748b', fontSize: 11 }}
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
            <Bar 
              dataKey="count" 
              fill="#1e3a8a" 
              name="Signal Count"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}