import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, TrendingUp, Clock, ExternalLink, AlertCircle } from 'lucide-react';

import { API_URL } from '../../services/api';

interface Complaint {
  id: number;
  category: string;
  description: string;
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';
  timestamp: string;
  studentId: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  aiCategory?: string;
  assignedTo?: string | null;
  deadline?: string | null;
  completedAt?: string | null;
}

export function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [riskScore, setRiskScore] = useState(45);
  const [unrestAlerts, setUnrestAlerts] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}/complaints`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data: Complaint[] = await res.json();
        setComplaints(data);

        const baseScore = 40;
        const complaintCount = data.length;
        const unresolvedCount = data.filter(c => c.status !== 'Resolved').length;
        const negativeCount = data.filter(c => c.sentiment === 'negative').length;

        const now = new Date();
        const missedDeadlines = data.filter(c => {
          if (!c.deadline || c.status === 'Resolved') return false;
          return new Date(c.deadline) < now;
        });

        const alerts = missedDeadlines.map(c => ({
          id: c.id,
          title: `Deadline Missed: ${c.category}`,
          description: `Complaint ID ${String(c.id).slice(-6)} has exceeded its deadline. Escalation risk is increasing.`,

          complaint: c,
          severity: 'high',
        }));

        setUnrestAlerts(alerts);

        const complaintFactor = Math.min(complaintCount * 2, 25);
        const unresolvedFactor = Math.min(unresolvedCount * 3, 20);
        const sentimentFactor = Math.min(negativeCount * 2, 15);
        const deadlineFactor = Math.min(missedDeadlines.length * 8, 20);

        const calculatedRisk =
          baseScore +
          complaintFactor +
          unresolvedFactor +
          sentimentFactor +
          deadlineFactor;

        setRiskScore(Math.min(calculatedRisk, 100));
      } catch (err) {
        console.error("Failed to load admin data", err);
      }
    };

    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);


  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: 'HIGH', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-500' };
    if (score >= 50) return { label: 'MEDIUM', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500' };
    return { label: 'LOW', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-500' };
  };

  const riskLevel = getRiskLevel(riskScore);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-600">Real-time monitoring and AI-powered risk analysis</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Risk Score */}
        <div className={`bg-white border-l-4 ${riskLevel.borderColor} ${riskLevel.bgColor} rounded-lg p-6 shadow-sm`}>
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-600">Institutional Risk Score</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-semibold ${riskLevel.color}`}>{riskScore}</span>
            <span className="text-sm text-slate-500">/100</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${riskLevel.bgColor} ${riskLevel.color}`}>
              {riskLevel.label} RISK
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">AI-calculated from multiple factors</p>
        </div>

        {/* Unrest Alerts */}
        <div className={`bg-white border-l-4 rounded-lg p-6 shadow-sm ${unrestAlerts.length > 0 ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
          }`}>
          <h3 className="text-sm font-medium text-slate-600 mb-3">Active Unrest Alerts</h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-semibold ${unrestAlerts.length > 0 ? 'text-red-900' : 'text-green-900'}`}>
              {unrestAlerts.length}
            </span>
            <span className="text-sm text-slate-500">active</span>
          </div>
          {unrestAlerts.length > 0 ? (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="w-3.5 h-3.5" />
              Missed deadlines detected
            </div>
          ) : (
            <div className="text-xs text-green-600">All on track</div>
          )}
        </div>

        {/* Unresolved Complaints */}
        <div className="bg-white border-l-4 border-orange-500 rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-600 mb-3">Unresolved Complaints</h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-semibold text-orange-900">
              {complaints.filter(c => c.status !== 'Resolved').length}
            </span>
            <span className="text-sm text-slate-500">pending</span>
          </div>
          <div className="text-xs text-slate-500">
            {complaints.length > 0 && `${complaints.length} total complaints`}
          </div>
        </div>
      </div>

      {/* Unrest Alerts Section */}
      {unrestAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">⚠️ Unrest Alerts - Immediate Attention Required</h3>
              <p className="text-sm text-red-800">
                AI has detected {unrestAlerts.length} complaint{unrestAlerts.length > 1 ? 's' : ''} with missed deadlines. Escalation risk is elevated.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {unrestAlerts.map(alert => (
              <Link
                key={alert.id}
                to={`/admin/complaint/${alert.id}`}
                className="block bg-white border border-red-300 rounded-lg p-4 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 ml-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Real-Time Complaint Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Real-Time Complaint Feed</h3>
          <p className="text-sm text-slate-500 mt-1">Live updates as students submit complaints</p>
        </div>
        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {complaints.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600">No complaints submitted yet</p>
              <p className="text-sm text-slate-500 mt-1">Complaints will appear here in real-time</p>
            </div>
          ) : (
            complaints.slice().reverse().map((complaint) => (
              <Link
                key={complaint.id}
                to={`/admin/complaint/${complaint.id}`}
                className="block p-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{complaint.category}</h4>
                      {complaint.sentiment === 'negative' && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded font-semibold">
                          AI: Negative Sentiment
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{complaint.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                        complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                          complaint.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                      }`}>
                      {complaint.status}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {getTimeAgo(complaint.timestamp)}
                  </span>
                  <span>•</span>
                  <span>ID: {String(complaint.id).slice(-6)}</span>

                  {complaint.assignedTo && (
                    <>
                      <span>•</span>
                      <span>Assigned: {complaint.assignedTo}</span>
                    </>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
