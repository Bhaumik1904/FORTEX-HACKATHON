import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { FileText, List, LogOut, GraduationCap, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Student');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("currentUser");

    if (!raw || raw === "undefined") {
      localStorage.removeItem("currentUser");
      navigate("/login");
      return;
    }

    let userData;
    try {
      userData = JSON.parse(raw);
    } catch (err) {
      console.error("Invalid currentUser in storage:", raw);
      localStorage.removeItem("currentUser");
      navigate("/login");
      return;
    }

    if (!userData || userData.role !== "student") {
      navigate("/login");
      return;
    }

    setUserName(userData.name || "Student");
  }, [navigate]);



  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleEmergencyContact = () => {
    setShowEmergencyModal(true);
  };

  const isActive = (path: string) => {
    if (path === '/student') {
      return location.pathname === '/student';
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Student Portal</h1>
                <p className="text-xs text-slate-500">Submit and track your complaints</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Emergency Contact Button */}
              <button
                onClick={handleEmergencyContact}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Emergency Contact
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{userName}</p>
                <p className="text-xs text-slate-500">Student</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Navigation */}
        <nav className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/student"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/student')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Submit Complaint</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/student/my-complaints"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/student/my-complaints')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <List className="w-5 h-5" />
                  <span className="font-medium">My Complaints</span>
                </Link>
              </li>
            </ul>

            {/* Emergency Contact in Sidebar */}
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <Phone className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-900">Emergency?</h3>
                  <p className="text-xs text-red-800 mt-1">
                    For urgent situations requiring immediate attention
                  </p>
                </div>
              </div>
              <button
                onClick={handleEmergencyContact}
                className="w-full mt-3 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Contact Now
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

      {/* Emergency Contact Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-1">Emergency Contact</h2>
                <p className="text-sm text-slate-600">For immediate assistance and urgent situations</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-2">Campus Security</h3>
                <a href="tel:911" className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
                  Emergency: 911
                </a>
                <p className="text-sm text-slate-600 mt-1">Available 24/7</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-2">Student Welfare Office</h3>
                <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-700 font-semibold">
                  +1 (234) 567-8900
                </a>
                <p className="text-sm text-slate-600 mt-1">Mon-Fri: 8:00 AM - 6:00 PM</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-2">Dean of Students</h3>
                <a href="tel:+1234567891" className="text-blue-600 hover:text-blue-700 font-semibold">
                  +1 (234) 567-8901
                </a>
                <p className="text-sm text-slate-600 mt-1">Mon-Fri: 9:00 AM - 5:00 PM</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> For non-emergency issues, please use the regular complaint submission form.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowEmergencyModal(false)}
              className="w-full px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}