import React, { useState, useEffect } from 'react';
import { FoodBusiness, ContactHistory, ParticipationStatus } from '../types';
import { fetchBusinessHistory, updateBusinessStatus } from '../lib/api';
import { StatusBadge } from './StatusBadge';
import { X, History, PhoneCall, Clock, CheckCircle2, FileText, Send, UserCheck } from 'lucide-react';

interface ContactHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: FoodBusiness | null;
  onBusinessUpdated: () => void;
}

export const ContactHistoryModal: React.FC<ContactHistoryModalProps> = ({
  isOpen,
  onClose,
  business,
  onBusinessUpdated
}) => {
  if (!isOpen || !business) return null;

  const [history, setHistory] = useState<ContactHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // New Status Form state
  const [newStatus, setNewStatus] = useState<ParticipationStatus>(business.participationStatus);
  const [isVerified, setIsVerified] = useState<boolean>(business.isVerified);
  const [newNotes, setNewNotes] = useState('');
  const [agentName, setAgentName] = useState('Officer Deshmukh');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!business) return;
      setLoadingHistory(true);
      try {
        const data = await fetchBusinessHistory(business.id);
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }
    }
    load();
  }, [business]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setSubmitting(true);
    try {
      await updateBusinessStatus(
        business.id,
        newStatus,
        isVerified || newStatus === 'VERIFIED' || newStatus === 'ACTIVE_DONOR',
        newNotes,
        agentName
      );
      onBusinessUpdated();
      onClose();
    } catch (err) {
      alert('Failed to update business status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Shegaon Research Directory Audit
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{business.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            📍 {business.area}, Shegaon | Contact: {business.phone} ({business.contactPerson})
          </p>
          <div className="mt-3">
            <StatusBadge status={business.participationStatus} isVerified={business.isVerified} />
          </div>
        </div>

        {/* Status Update Form */}
        <form onSubmit={handleUpdateStatus} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 mb-6 space-y-4 text-xs sm:text-sm">
          <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span>Update Participation Status & Verification Audit</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Participation Status</label>
              <select
                value={newStatus}
                onChange={(e) => {
                  const st = e.target.value as ParticipationStatus;
                  setNewStatus(st);
                  if (st === 'VERIFIED' || st === 'ACTIVE_DONOR') {
                    setIsVerified(true);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="IDENTIFIED">🔵 IDENTIFIED (Researched)</option>
                <option value="CONTACTED">🟡 CONTACTED (Outreach Initiated)</option>
                <option value="INTERESTED">🟠 INTERESTED (Agreed in principle)</option>
                <option value="REGISTERED">🟢 REGISTERED (Web Form Submission)</option>
                <option value="VERIFIED">✅ VERIFIED (Passed Shegaon Audit)</option>
                <option value="ACTIVE_DONOR">🍱 ACTIVE_DONOR (Posting Surplus)</option>
                <option value="NOT_INTERESTED">❌ NOT_INTERESTED (Declined)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Auditor / Agent Name</label>
              <input
                type="text"
                required
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVerifiedCheck"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="isVerifiedCheck" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Grant "✓ Verified FoodSaver Partner" Badge
            </label>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Audit Log / Contact Notes</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Conducted phone follow-up with manager. Confirmed willingness to donate weekend surplus."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record Audit Log & Save</span>
            </button>
          </div>
        </form>

        {/* Existing Contact History Log */}
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-500" />
            <span>Contact & Outreach Log History</span>
          </h3>

          {loadingHistory ? (
            <p className="text-xs text-slate-500 py-4">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No contact history logged yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.agentName}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {new Date(item.contactDate).toLocaleDateString()} {new Date(item.contactDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="mb-1">
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    "{item.notes}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
