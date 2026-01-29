import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Calendar, User, AlertCircle, CheckCircle, Clock, Star } from 'lucide-react';

import { API_URL } from '../../services/api';

interface Complaint {
  id: string;
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
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  } | null;
}

const departments = [
  'Hostel Administration',
  'Academic Affairs',
  'Infrastructure & Maintenance',
  'Student Welfare',
  'Facilities Management',
  'IT Department',
  'Student Council',
];

export function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [assignedTo, setAssignedTo] = useState('');
  const [deadlineType, setDeadlineType] = useState<'today' | 'custom'>('today');
  const [customDate, setCustomDate] = useState('');
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Reset initialization state when ID changes
    isInitialized.current = false;
    setLoading(true);

    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}/complaints/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setComplaint(data);

        // Only initialize form fields on first load for this ID
        if (!isInitialized.current) {
          setAssignedTo(data.assignedTo || "");

          if (data.deadline) {
            setDeadlineType('custom');
            setCustomDate(data.deadline.split('T')[0]);
          }

          isInitialized.current = true;
        }
      } catch (err) {
        console.error("Failed to load complaint details", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [id]);



  const updateComplaint = async () => {
    if (!complaint) return;

    let deadline: string | null = null;

    if (deadlineType === 'today') {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      deadline = today.toISOString();
    } else if (customDate) {
      const d = new Date(customDate);
      d.setHours(23, 59, 59, 999);
      deadline = d.toISOString();
    }

    let status = complaint.status;
    if (assignedTo && status === 'Submitted') status = 'Assigned';

    await fetch(`${API_URL}/complaints/${complaint.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        assignedTo,
        deadline,
        status,
      }),
    });

    // 🔁 Refresh complaint from server
    const refreshed = await fetch(`${API_URL}/complaints/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const updated = await refreshed.json();
    setComplaint(updated);

    alert("Updated successfully");
  };



  const updateStatus = async (newStatus: Complaint['status']) => {
    if (!complaint) return;

    await fetch(`${API_URL}/complaints/${complaint.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        status: newStatus,
        completedAt: newStatus === "Resolved" ? new Date().toISOString() : null,
      }),
    });

    // 🔁 Refresh complaint from server
    const refreshed = await fetch(`${API_URL}/complaints/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const updated = await refreshed.json();
    setComplaint(updated);

    alert("Status updated");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Loading complaint...</span>
      </div>
    );
  }


  if (complaint === null) {
    return (
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-600">Complaint not found</p>
          <Link to="/admin" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isDeadlineMissed = complaint.deadline && new Date(complaint.deadline) < new Date() && complaint.status !== 'Resolved';

  return (
    <div className="max-w-4xl">
      {/* Back Button */}
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Complaint Details</h2>
        <p className="text-slate-600">Assign to department and set deadline</p>
      </div>

      {/* Deadline Alert */}
      {isDeadlineMissed && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">⚠️ Deadline Missed</p>
            <p className="text-sm text-red-800 mt-1">
              This complaint has exceeded its deadline. AI predicts elevated escalation risk. Immediate action recommended.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Complaint Information */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-lg mb-1">{complaint.category}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                  complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                    complaint.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                  }`}>
                  {complaint.status}
                </span>
                {complaint.sentiment && (
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${complaint.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                    complaint.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                    AI: {complaint.sentiment} sentiment
                  </span>
                )}
              </div>
            </div>
            <span className="text-sm text-slate-500">
              ID: {String(complaint.id).slice(-8)}
            </span>

          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-slate-700">Description:</span>
              <p className="text-slate-900 mt-1">{complaint.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
              <div>
                <span className="text-sm font-medium text-slate-700">Submitted:</span>
                <p className="text-slate-900">{new Date(complaint.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Student ID:</span>
                <p className="text-slate-900">{complaint.studentId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Feedback (if provided) */}
        {complaint.feedback && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Student Feedback</h3>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= complaint.feedback!.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300'
                    }`}
                />
              ))}
              <span className="text-sm font-medium text-slate-700 ml-2">
                {complaint.feedback.rating}/5 - {
                  complaint.feedback.rating === 5 ? 'Excellent' :
                    complaint.feedback.rating === 4 ? 'Good' :
                      complaint.feedback.rating === 3 ? 'Average' :
                        complaint.feedback.rating === 2 ? 'Poor' : 'Very Poor'
                }
              </span>
            </div>
            {complaint.feedback.comment && (
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <p className="text-sm text-slate-700">"{complaint.feedback.comment}"</p>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2">
              Submitted {new Date(complaint.feedback.submittedAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Assignment & Deadline Management */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Assignment & Deadline</h3>

          <div className="space-y-5">
            {/* Assign to Department */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Assign to Department
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Set Deadline */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Set Deadline
              </label>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDeadlineType('today')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${deadlineType === 'today'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    <span className="font-medium">Due Today</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeadlineType('custom')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${deadlineType === 'custom'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    <span className="font-medium">Custom Date</span>
                  </button>
                </div>

                {deadlineType === 'custom' && (
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                )}
              </div>
            </div>

            <button
              onClick={updateComplaint}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Save Assignment & Deadline
            </button>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Update Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['Submitted', 'Assigned', 'In Progress', 'Resolved'] as const).map(status => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${complaint.status === status
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
              >
                <span className="font-medium text-sm">{status}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">AI Analysis</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Sentiment:</strong> {complaint.sentiment || 'neutral'} - AI detected {complaint.sentiment === 'negative' ? 'urgent or frustrated' : 'calm'} language</p>
            <p>• <strong>Category:</strong> {complaint.aiCategory || 'General'} - Automatically classified</p>
            {isDeadlineMissed && (
              <p className="text-red-800 font-semibold">• <strong>Escalation Risk:</strong> HIGH - Deadline missed, risk of unrest increased</p>
            )}
            {!isDeadlineMissed && complaint.deadline && (
              <p>• <strong>Escalation Risk:</strong> LOW - On track for resolution</p>
            )}
            {complaint.feedback && (
              <p className="text-green-800 font-semibold">• <strong>Student Satisfaction:</strong> {complaint.feedback.rating}/5 stars - Feedback received</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}