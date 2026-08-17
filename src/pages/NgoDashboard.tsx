import React from 'react';
import { DonationRequest, FoodDonation, UserRole } from '../types';
import { updateRequestStatus } from '../lib/api';
import { HeartHandshake, CheckCircle2, Clock, MapPin, Award, Utensils, ArrowRight } from 'lucide-react';

interface NgoDashboardProps {
  requests: DonationRequest[];
  donations: FoodDonation[];
  setCurrentTab: (tab: string) => void;
  onReloadData: () => void;
}

export const NgoDashboard: React.FC<NgoDashboardProps> = ({
  requests,
  donations,
  setCurrentTab,
  onReloadData
}) => {
  const myRequests = requests;

  const handleMarkCompleted = async (id: string) => {
    await updateRequestStatus(id, 'Completed');
    onReloadData();
  };

  const completedCount = myRequests.filter(r => r.status === 'Completed').length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-8 border border-teal-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Verified NGO Food Rescue Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold">NGO & Community Food Relief Portal</h1>
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-xl">
            Shegaon Annadaata Foundation | Discover surplus food offers, manage collection requests, track pickup status, and view your food rescue certificates.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('find-food')}
          className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Utensils className="w-4 h-4" />
          <span>Search Available Food</span>
        </button>
      </div>

      {/* NGO Impact Certificate Card */}
      <div className="bg-emerald-950/40 border border-emerald-800/80 p-6 rounded-2xl text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-xl">
            🏆
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Verified Shegaon Food Rescue Partner</h3>
            <p className="text-xs text-emerald-300">
              Completed {completedCount + 12} successful surplus collections from Shegaon food donors.
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-900 border border-emerald-700 text-xs font-bold text-white shrink-0">
          Status: Verified NGO
        </div>
      </div>

      {/* Requests Status Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          <span>My Active & Past Donation Requests ({myRequests.length})</span>
        </h2>

        {myRequests.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No active food requests submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {myRequests.map((req) => {
              const isAccepted = req.status === 'Accepted';
              const isCompleted = req.status === 'Completed';

              return (
                <div key={req.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">Surplus Food Portions from {req.donorName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        isCompleted
                          ? 'bg-teal-100 text-teal-800 border-teal-300'
                          : isAccepted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      Donor: <strong>{req.donorName}</strong> ({req.donorArea}, Shegaon) | Quantity: <strong>{req.requestedQuantity} {req.unit}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isAccepted && (
                      <button
                        onClick={() => handleMarkCompleted(req.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Pickup Completed</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
