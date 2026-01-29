import { Outlet, Link, useLocation } from 'react-router';
import { AlertTriangle, BarChart3, Settings, Activity } from 'lucide-react';

export function DashboardLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Overview', icon: Activity },
    { path: '/risk-analysis', label: 'Signal Analysis', icon: BarChart3 },
    { path: '/admin', label: 'Admin Panel', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Institutional Early Warning System</h1>
                <p className="text-xs text-slate-500">Predictive Risk Monitoring for Educational Institutions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Administrator</p>
                <p className="text-xs text-slate-500">Last updated: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-900 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
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