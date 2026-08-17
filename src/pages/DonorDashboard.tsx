import React from 'react';
import { FoodDonation, DonationRequest, UserRole } from '../types';
import { updateRequestStatus } from '../lib/api';
import { Utensils, Plus, CheckCircle2, Clock, AlertCircle, MapPin, HeartHandshake, Check, X } from 'lucide-react';

interface DonorDashboardProps {
  donations: FoodDonation[];
  requests: DonationRequest[];
  onOpenPostDonation: () => void;
  onReloadData: () => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({
  donations,
  requests,
  onOpenPostDonation,
  onReloadData
}) => {
  const myDonations = donations;
  const pendingRequests = requests.filter(r => r.status === 'Pending');

  const handleUpdateRequest = async (id: string, status: 'Accepted' | 'Rejected' | 'Completed') => {
    await updateRequestStatus(id, status);
    onReloadData();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
            <Utensils className="w-3.5 h-3.5" />
            <span>Food Partner Donor Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold">Restaurant & Business Donor Portal</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Post surplus edible food from your kitchen, manage active listings, review incoming NGO collection requests, and track your contribution to Shegaon.
          </p>
        </div>

        <button
          onClick={onOpenPostDonation}
          className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Surplus Food</span>
        </button>
      </div>

      {/* Pending NGO Requests Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-500" />
            <span>Incoming NGO Collection Requests</span>
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {pendingRequests.length} Pending
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No pending collection requests right now.</p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white mb-0.5">
                    {req.ngoName} requested food portions from {req.donorName}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Requested Quantity: <strong>{req.requestedQuantity} {req.unit}</strong> | Contact: {req.ngoContact}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1">
                    Notes: "{req.recipientNotes}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleUpdateRequest(req.id, 'Accepted')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Request</span>
                  </button>
                  <button
                    onClick={() => handleUpdateRequest(req.id, 'Rejected')}
                    className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Listings Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-600" />
          <span>My Posted Surplus Listings ({myDonations.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Food Offer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Expiry Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {myDonations.map((don) => (
                <tr key={don.id}>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{don.foodName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">{don.category}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{don.quantity} {don.unit}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {don.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(don.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
