import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Eye, AlertCircle, User, Star, MessageSquare } from 'lucide-react';

import { API_URL } from '../../services/api';

interface Complaint {
  id: string;
  category: string;
  description: string;
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';
  timestamp: string;
  studentId: string;
  assignedTo?: string | null;
  deadline?: string | null;
  completedAt?: string | null;
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  } | null;
}

const statusConfig = {
  'Submitted': {
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
    iconColor: 'text-slate-600',
  },
  'Assigned': {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: User,
    iconColor: 'text-blue-600',
  },
  'In Progress': {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: AlertCircle,
    iconColor: 'text-yellow-600',
  },
  'Resolved': {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
};

export function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [feedbackComplaintId, setFeedbackComplaintId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/complaints/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Auth error", await res.text());
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Invalid complaints payload:", data);
          return;
        }

        setComplaints(data);
      } catch (e) {
        console.error("Failed to load complaints", e);
      }
    };

    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);




  const submitFeedback = (complaintId: string) => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const formatDeadline = (deadline: string | null | undefined) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">My Complaints</h2>
          <p className="text-slate-600">Track the status of your submitted complaints</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-medium text-slate-900 mb-2">No complaints yet</h3>
          <p className="text-slate-600 mb-4">You haven't submitted any complaints.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => {
            const config = statusConfig[complaint.status];
            const Icon = config.icon;
            const isResolved = complaint.status === 'Resolved';
            const hasFeedback = complaint.feedback !== null && complaint.feedback !== undefined;
            const showFeedbackForm = isResolved && !hasFeedback && feedbackComplaintId === complaint.id;

            return (
              <div
                key={complaint.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{complaint.category}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                        <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{complaint.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {getTimeAgo(complaint.timestamp)}
                      </span>
                      {complaint.assignedTo && (
                        <>
                          <span>•</span>
                          <span>Assigned to: {complaint.assignedTo}</span>
                        </>
                      )}
                      {complaint.deadline && (
                        <>
                          <span>•</span>
                          <span>Due: {formatDeadline(complaint.deadline)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {Object.keys(statusConfig).map((status, index) => {
                      const isActive = Object.keys(statusConfig).indexOf(complaint.status) >= index;
                      return (
                        <div key={status} className="flex items-center flex-1">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${isActive ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'
                            }`}>
                            {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          {index < Object.keys(statusConfig).length - 1 && (
                            <div className={`flex-1 h-0.5 ${isActive ? 'bg-blue-600' : 'bg-slate-300'
                              }`}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex mt-2">
                    {Object.keys(statusConfig).map((status) => (
                      <div key={status} className="flex-1 text-xs text-slate-600">
                        {status}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback Section */}
                {isResolved && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    {hasFeedback ? (
                      // Display submitted feedback
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <h4 className="font-semibold text-green-900">Your Feedback</h4>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= (complaint.feedback?.rating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-300'
                                }`}
                            />
                          ))}
                          <span className="text-sm text-slate-600 ml-2">
                            ({complaint.feedback?.rating}/5)
                          </span>
                        </div>
                        {complaint.feedback?.comment && (
                          <p className="text-sm text-slate-700 mt-2">"{complaint.feedback.comment}"</p>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                          Submitted {getTimeAgo(complaint.feedback?.submittedAt || '')}
                        </p>
                      </div>
                    ) : showFeedbackForm ? (
                      // Feedback form
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-3">Rate Your Experience</h4>

                        {/* Star Rating */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            How satisfied are you with the resolution?
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-8 h-8 ${star <= rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-slate-300 hover:text-yellow-200'
                                    }`}
                                />
                              </button>
                            ))}
                            {rating > 0 && (
                              <span className="text-sm font-medium text-slate-700 ml-2">
                                {rating === 5 ? 'Excellent' :
                                  rating === 4 ? 'Good' :
                                    rating === 3 ? 'Average' :
                                      rating === 2 ? 'Poor' : 'Very Poor'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Comment */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Additional Comments (Optional)
                          </label>
                          <textarea
                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
                            placeholder="Tell us about your experience..."
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => submitFeedback(complaint.id)}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                          >
                            Submit Feedback
                          </button>
                          <button
                            onClick={() => {
                              setFeedbackComplaintId(null);
                              setRating(0);
                              setFeedbackComment('');
                            }}
                            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Show feedback button
                      <button
                        onClick={() => setFeedbackComplaintId(complaint.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Provide Feedback
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}