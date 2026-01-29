import { useState, useEffect } from 'react';
import { Bell, Settings, Download, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Complaint {
  id: string;
  category: string;
  description: string;
  status: 'Submitted' | 'In Review' | 'Action Taken' | 'Resolved';
  timestamp: string;
  studentId: string;
}

export function ControlPanel() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [alertThreshold, setAlertThreshold] = useState(60);
  const [autoNotifications, setAutoNotifications] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const stored = localStorage.getItem('complaints');
      if (stored) {
        setComplaints(JSON.parse(stored));
      }
    };

    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateComplaintStatus = (complaintId: string, newStatus: Complaint['status']) => {
    const updated = complaints.map(c => 
      c.id === complaintId ? { ...c, status: newStatus } : c
    );
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
  };

  const handleExportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      totalComplaints: complaints.length,
      pending: complaints.filter(c => c.status !== 'Resolved').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
      complaints: complaints,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `early-warning-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

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

  const urgentComplaints = complaints.filter(c => {
    const hoursSinceSubmission = (Date.now() - new Date(c.timestamp).getTime()) / 3600000;
    return c.status !== 'Resolved' && hoursSinceSubmission > 24;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Control Panel</h2>
        <p className="text-slate-600">Manage complaints and system configuration</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={handleExportReport}
          className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-left shadow-sm"
        >
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center mb-3">
            <Download className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Export Report</h3>
          <p className="text-sm text-slate-600">Download data</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-left shadow-sm">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center mb-3">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">View Analytics</h3>
          <p className="text-sm text-slate-600">Detailed insights</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-left shadow-sm">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center mb-3">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Send Alert</h3>
          <p className="text-sm text-slate-600">Notify staff</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-left shadow-sm">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center mb-3">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">System Config</h3>
          <p className="text-sm text-slate-600">Settings</p>
        </button>
      </div>

      {/* Urgent Complaints */}
      {urgentComplaints.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Urgent: Delayed Complaints</h3>
              <p className="text-sm text-red-800 mt-1">
                {urgentComplaints.length} complaint{urgentComplaints.length > 1 ? 's' : ''} pending for more than 24 hours
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Management */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Complaint Management</h3>
          <p className="text-sm text-slate-500 mt-1">Update status and take action</p>
        </div>
        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {complaints.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-600">No complaints to manage</p>
            </div>
          ) : (
            complaints.slice().reverse().map((complaint) => (
              <div key={complaint.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    complaint.status === 'Resolved' 
                      ? 'bg-green-100' 
                      : complaint.status === 'Action Taken' || complaint.status === 'In Review'
                      ? 'bg-blue-100'
                      : 'bg-slate-100'
                  }`}>
                    {complaint.status === 'Resolved' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {(complaint.status === 'In Review' || complaint.status === 'Action Taken') && (
                      <Eye className="w-5 h-5 text-blue-600" />
                    )}
                    {complaint.status === 'Submitted' && (
                      <Clock className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{complaint.category}</h4>
                        <p className="text-sm text-slate-600 mt-1">{complaint.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span>ID: {complaint.id.slice(-6)}</span>
                      <span>•</span>
                      <span>{getTimeAgo(complaint.timestamp)}</span>
                      <span>•</span>
                      <span>Student: {complaint.studentId}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Status:</span>
                      <select
                        value={complaint.status}
                        onChange={(e) => updateComplaintStatus(complaint.id, e.target.value as Complaint['status'])}
                        className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="In Review">In Review</option>
                        <option value="Action Taken">Action Taken</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alert Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Alert Configuration</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-900">Risk Score Alert Threshold</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{alertThreshold}/100</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
            />
            <p className="text-sm text-slate-600 mt-2">Send alerts when risk score exceeds this threshold</p>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="font-medium text-slate-900">Real-Time Notifications</div>
                  <p className="text-sm text-slate-600">Get notified when new complaints arrive</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoNotifications}
                  onChange={(e) => setAutoNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">System Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">AI Detection</span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Sentiment Analysis</span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Running
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Last Update</span>
                <span className="text-sm font-medium text-slate-900">Real-time</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Active Admins</span>
                <span className="text-sm font-medium text-slate-900">1 online</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Total Complaints</span>
                <span className="text-sm font-medium text-slate-900">{complaints.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Resolution Rate</span>
                <span className="text-sm font-medium text-slate-900">
                  {complaints.length > 0 ? Math.round((complaints.filter(c => c.status === 'Resolved').length / complaints.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
