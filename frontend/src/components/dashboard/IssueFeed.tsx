import { AlertCircle, AlertTriangle, Info, Clock } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  category: string;
  timestamp: string;
  source: string;
}

const issues: Issue[] = [
  {
    id: '1',
    title: 'Escalating Pattern: Hostel Maintenance Complaints',
    description: 'AI detected 14 repeated complaints about hostel water supply in Block C over 6 days. Pattern shows increasing frustration in student language. Risk of collective action: High.',
    severity: 'high',
    category: 'Hostel Infrastructure',
    timestamp: '12 minutes ago',
    source: 'AI Pattern Detection',
  },
  {
    id: '2',
    title: 'Academic Delay: Exam Results Overdue',
    description: 'Semester exam results delayed by 18 days beyond announced date. 247 students affected. Social media sentiment turning negative. Predicted escalation window: 3-5 days.',
    severity: 'high',
    category: 'Academic Administration',
    timestamp: '45 minutes ago',
    source: 'Timeline Monitor',
  },
  {
    id: '3',
    title: 'Sentiment Shift: Student Council Elections',
    description: 'Negative sentiment detected in student forums regarding election process transparency. Mentions increased 340% in 48 hours. Recommend proactive communication.',
    severity: 'medium',
    category: 'Student Governance',
    timestamp: '2 hours ago',
    source: 'Sentiment Analysis Engine',
  },
  {
    id: '4',
    title: 'Resolution Delay: Library Infrastructure',
    description: 'Air conditioning issues in main library reported 12 days ago. No visible action. Issue raised in 3 different channels. Student patience threshold approaching.',
    severity: 'medium',
    category: 'Infrastructure',
    timestamp: '3 hours ago',
    source: 'Multi-channel Tracker',
  },
  {
    id: '5',
    title: 'Early Signal: Fee Payment System Complaints',
    description: 'Multiple complaints about online fee portal errors. Not yet escalated but showing early warning indicators. Recommend immediate technical review.',
    severity: 'medium',
    category: 'Administrative Systems',
    timestamp: '5 hours ago',
    source: 'Complaint Aggregator',
  },
  {
    id: '6',
    title: 'Positive Trend: Hostel Food Quality Initiative',
    description: 'Student sentiment improving after mess committee meetings. Positive feedback increased 65%. Intervention effective.',
    severity: 'info',
    category: 'Hostel Services',
    timestamp: '6 hours ago',
    source: 'Sentiment Tracker',
  },
];

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    textColor: 'text-red-900',
    label: 'CRITICAL',
  },
  high: {
    icon: AlertCircle,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600',
    textColor: 'text-orange-900',
    label: 'HIGH RISK',
  },
  medium: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-900',
    label: 'WATCH',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900',
    label: 'POSITIVE',
  },
};

export function IssueFeed() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-base font-semibold text-slate-900">Real-Time Early Warning Signals</h3>
        <p className="text-sm text-slate-500 mt-1">AI-powered detection of emerging institutional risks</p>
      </div>
      <div className="divide-y divide-slate-100">
        {issues.map((issue) => {
          const config = severityConfig[issue.severity];
          const Icon = config.icon;
          
          return (
            <div key={issue.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex gap-4">
                <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 h-fit`}>
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-semibold text-slate-900">{issue.title}</h4>
                    <span className={`${config.bgColor} ${config.textColor} text-xs font-semibold px-2 py-1 rounded whitespace-nowrap`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{issue.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {issue.timestamp}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      {issue.category}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span>{issue.source}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}