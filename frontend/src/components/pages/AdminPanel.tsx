import { useState } from 'react';
import { Bell, Settings, Download, Users, MessageSquare, AlertTriangle, CheckCircle, Eye } from 'lucide-react';

export function AdminPanel() {
  const [alertThreshold, setAlertThreshold] = useState(60);
  const [autoNotifications, setAutoNotifications] = useState(true);
  const [escalationAlerts, setEscalationAlerts] = useState(true);

  const recentActions = [
    { id: 1, action: 'Hostel Block C water supply - Maintenance team assigned', user: 'Admin', time: '2 hours ago', status: 'resolved' },
    { id: 2, action: 'Exam results timeline published on student portal', user: 'Dean Academic', time: '4 hours ago', status: 'completed' },
    { id: 3, action: 'Student council meeting scheduled for election concerns', user: 'Admin', time: '1 day ago', status: 'scheduled' },
    { id: 4, action: 'Library AC repair contractor assigned', user: 'Facilities', time: '1 day ago', status: 'in-progress' },
  ];

  const watchList = [
    { issue: 'Hostel Block D electrical issues', days: 4, signals: 8, risk: 'high' },
    { issue: 'Department of CS grade submission delay', days: 12, signals: 15, risk: 'high' },
    { issue: 'Sports ground renovation timeline unclear', days: 6, signals: 5, risk: 'medium' },
    { issue: 'Canteen pricing concerns', days: 3, signals: 4, risk: 'medium' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Admin Control Panel</h2>
        <p className="text-slate-600">Monitoring and intervention tools for institutional risk management</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-left shadow-sm">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center mb-3">
            <Download className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Export Risk Report</h3>
          <p className="text-sm text-slate-600">Generate weekly summary</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-left shadow-sm">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Send Communication</h3>
          <p className="text-sm text-slate-600">Proactive messaging</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-left shadow-sm">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center mb-3">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">View All Complaints</h3>
          <p className="text-sm text-slate-600">Complaint dashboard</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-left shadow-sm">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Assign Task</h3>
          <p className="text-sm text-slate-600">Delegate to departments</p>
        </button>
      </div>

      {/* Active Watch List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Active Watch List - Requires Attention</h3>
          <p className="text-sm text-slate-500 mt-1">Issues approaching escalation threshold</p>
        </div>
        <div className="divide-y divide-slate-100">
          {watchList.map((item) => (
            <div key={item.issue} className="p-5 hover:bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`w-4 h-4 ${item.risk === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                    <h4 className="font-semibold text-slate-900">{item.issue}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      item.risk === 'high' ? 'bg-red-100 text-red-900' : 'bg-yellow-100 text-yellow-900'
                    }`}>
                      {item.risk.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-6 text-sm text-slate-600">
                    <span>{item.days} days unresolved</span>
                    <span>•</span>
                    <span>{item.signals} warning signals</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200">
                    Assign Team
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Alert Configuration</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Alert Threshold */}
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
            <p className="text-sm text-slate-600 mt-2">Send immediate alerts when institutional risk score exceeds this threshold</p>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="font-medium text-slate-900">Automatic Escalation Alerts</div>
                  <p className="text-sm text-slate-600">Notify administrators when issues show escalation patterns</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={escalationAlerts}
                  onChange={(e) => setEscalationAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
              </label>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="font-medium text-slate-900">Daily Summary Notifications</div>
                  <p className="text-sm text-slate-600">Receive daily digest of new warning signals and trends</p>
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

      {/* Recent Administrative Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Recent Interventions & Actions</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActions.map((item) => (
            <div key={item.id} className="p-5 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                item.status === 'resolved' || item.status === 'completed' 
                  ? 'bg-green-100' 
                  : item.status === 'in-progress'
                  ? 'bg-blue-100'
                  : 'bg-slate-100'
              }`}>
                {(item.status === 'resolved' || item.status === 'completed') && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {item.status === 'in-progress' && (
                  <Settings className="w-5 h-5 text-blue-600" />
                )}
                {item.status === 'scheduled' && (
                  <Bell className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 mb-1">{item.action}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{item.user}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                  <span>•</span>
                  <span className={`font-semibold ${
                    item.status === 'resolved' || item.status === 'completed'
                      ? 'text-green-600'
                      : item.status === 'in-progress'
                      ? 'text-blue-600'
                      : 'text-slate-600'
                  }`}>
                    {item.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">System Health</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">AI Detection Engine</span>
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
                <span className="text-sm text-slate-600">Data Sources Connected</span>
                <span className="text-sm font-medium text-slate-900">8/8</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Last Data Refresh</span>
                <span className="text-sm font-medium text-slate-900">3 min ago</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Active Administrators</span>
                <span className="text-sm font-medium text-slate-900">4 online</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Monitoring Since</span>
                <span className="text-sm font-medium text-slate-900">Sep 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
