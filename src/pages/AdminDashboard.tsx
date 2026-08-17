import React, { useState } from 'react';
import { FoodBusiness, ImpactAnalytics, DonationRequest, ParticipationStatus } from '../types';
import { resetDemoData } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  ShieldCheck, 
  Building2, 
  Utensils, 
  RefreshCw, 
  Edit3, 
  CheckCircle2, 
  Search, 
  Users, 
  BarChart3, 
  Plus,
  Send
} from 'lucide-react';

interface AdminDashboardProps {
  businesses: FoodBusiness[];
  analytics: ImpactAnalytics | null;
  requests: DonationRequest[];
  onOpenAddBusiness: () => void;
  onOpenStatusUpdate: (biz: FoodBusiness) => void;
  onReloadData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  businesses,
  analytics,
  requests,
  onOpenAddBusiness,
  onOpenStatusUpdate,
  onReloadData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (confirm('Re-seed Shegaon demo data to initial state?')) {
      setResetting(true);
      await resetDemoData();
      onReloadData();
      setResetting(false);
    }
  };

  // Recharts Data Prep
  const statusChartData = analytics?.statusBreakdown 
    ? Object.entries(analytics.statusBreakdown).map(([status, count]) => ({ status, count }))
    : [];

  const COLORS = ['#0284c7', '#eab308', '#d97706', '#16a34a', '#0d9488', '#059669', '#64748b'];

  const filtered = businesses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Shegaon Administrative Control Suite</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold">FoodSaver Shegaon Control Cell</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Manage Shegaon Food Business Directory research, conduct verification audits, oversee donation requests, and analyze local impact statistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddBusiness}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Business</span>
          </button>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm border border-slate-700 transition flex items-center gap-1.5"
            title="Reset Demo Data"
          >
            <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>Participation Status Breakdown in Shegaon</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{businesses.length} Total Registered</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData}>
                <XAxis dataKey="status" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <span>Verification Ratio</span>
          </h3>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Verified Partners', value: analytics?.verifiedPartners || 2 },
                    { name: 'Pending Verification', value: (businesses.length - (analytics?.verifiedPartners || 2)) }
                  ]}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#059669" />
                  <Cell fill="#64748b" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                Verified FoodSaver Partners
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{analytics?.verifiedPartners || 2}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-full bg-slate-500 inline-block" />
                Under Outreach / Audit
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{businesses.length - (analytics?.verifiedPartners || 2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Directory Outreach Control Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden space-y-4 p-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Shegaon Directory Outreach & Audit Table
            </h3>
            <p className="text-xs text-slate-500">
              Update participation status, verify audit credentials, and log agent notes.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filter table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Business Name & Locality</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Contact Person & Phone</th>
                <th className="py-3 px-4">Participation Status</th>
                <th className="py-3 px-4">Data Source</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map((biz) => (
                <tr key={biz.id} className="hover:bg-slate-50 dark:hover:bg-slate-750/50 transition">
                  <td className="py-3 px-4">
                    <div className="font-extrabold text-slate-900 dark:text-white">{biz.name}</div>
                    <div className="text-[11px] text-slate-500">📍 {biz.area}, Shegaon</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{biz.type}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{biz.contactPerson}</div>
                    <div className="text-[11px] text-slate-500">{biz.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={biz.participationStatus} isVerified={biz.isVerified} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-500 uppercase text-[10px]">{biz.dataSource}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenStatusUpdate(biz)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Audit / Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
