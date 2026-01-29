import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Activity, BarChart3, LogOut, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Administrator');

  useEffect(() => {
    const token = localStorage.getItem("token");
if (!token) {
  navigate("/login");
  return;
}

// Optional: decode JWT payload to get role/name
try {
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.role !== "admin") {
    navigate("/login");
    return;
  }
  setUserName(payload.name || "Administrator");
} catch {
  navigate("/login");
}

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Administrator Dashboard</h1>
                <p className="text-xs text-slate-500">Early Warning System - Predictive Risk Monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{userName}</p>
                <p className="text-xs text-slate-500">Administrator</p>
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
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/admin"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive('/admin') && location.pathname === '/admin'
                      ? 'bg-blue-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/signal-analysis"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive('/admin/signal-analysis')
                      ? 'bg-blue-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Signal Analysis</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}