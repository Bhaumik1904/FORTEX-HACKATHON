import { Link } from 'react-router';
import { GraduationCap, Shield, AlertTriangle } from 'lucide-react';

export function RoleSelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-xl mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Institutional Early Warning System
          </h1>
          <p className="text-slate-600">
            AI-Powered Predictive Risk Monitoring for Educational Institutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Access */}
          <Link
            to="/student"
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 group"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
              <GraduationCap className="w-7 h-7 text-blue-900 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Student Access</h2>
            <p className="text-slate-600 mb-4">
              Submit and track complaints related to hostel, academics, infrastructure, and facilities.
            </p>
            <div className="text-blue-900 font-medium group-hover:text-blue-600">
              Continue as Student →
            </div>
          </Link>

          {/* Administrator Access */}
          <Link
            to="/admin"
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 group"
          >
            <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-800 transition-colors">
              <Shield className="w-7 h-7 text-slate-700 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Administrator Access</h2>
            <p className="text-slate-600 mb-4">
              Monitor institutional risk, analyze early warning signals, and manage interventions.
            </p>
            <div className="text-blue-900 font-medium group-hover:text-blue-600">
              Continue as Admin →
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Predictive and preventive system for institutional crisis management</p>
        </div>
      </div>
    </div>
  );
}
