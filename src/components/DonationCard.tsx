import React, { useState } from 'react';
import { FoodDonation, UserRole } from '../types';
import { Clock, MapPin, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';

interface DonationCardProps {
  donation: FoodDonation;
  activeRole: UserRole;
  onRequestFood: (donation: FoodDonation) => void;
  onInspectAI?: (donation: FoodDonation) => void;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  activeRole,
  onRequestFood,
  onInspectAI
}) => {
  const isAvailable = donation.status === 'Available';
  const isRequested = donation.status === 'Requested';
  const isAccepted = donation.status === 'Accepted';
  const isCompleted = donation.status === 'Completed';

  // Calculate hours left before expiry
  const expiryDate = new Date(donation.expiryTime);
  const now = new Date();
  const hoursLeft = Math.max(0, Math.round((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      
      <div>
        {/* Card Image Banner */}
        <div className="relative h-44 bg-slate-100 dark:bg-slate-900 overflow-hidden">
          {donation.imageUrl ? (
            <img 
              src={donation.imageUrl} 
              alt={donation.foodName} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-800 to-teal-900 text-white font-bold text-lg">
              🍱 {donation.category}
            </div>
          )}

          {/* Status Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-md ${
              isAvailable 
                ? 'bg-emerald-500 text-white border-emerald-400' 
                : isRequested 
                ? 'bg-amber-500 text-slate-950 border-amber-400' 
                : isCompleted 
                ? 'bg-teal-600 text-white border-teal-500'
                : 'bg-slate-600 text-white border-slate-500'
            }`}>
              {donation.status}
            </span>

            {donation.freshnessScore && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-emerald-300 border border-emerald-500/50 backdrop-blur flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{donation.freshnessScore}% Fresh</span>
              </span>
            )}
          </div>

          {/* Expiry Pill */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-semibold backdrop-blur flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{hoursLeft > 0 ? `${hoursLeft} hrs left` : 'Expiring Soon'}</span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">
              <span>{donation.category} Surplus</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">📍 {donation.donorArea}, Shegaon</span>
            </div>
            {/* Restaurant / Canteen / Mess / Hotel Name as Main Title */}
            <h3 className="font-black text-lg text-slate-900 dark:text-white leading-snug">
              {donation.donorName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {donation.donorType} Food Partner
            </p>
          </div>

          {/* Portion Quantity & Freshness Bar */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Quantity Available</span>
              <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                {donation.quantity} {donation.unit}
              </span>
            </div>
            {donation.freshnessScore && (
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Freshness</span>
                <span className="text-sm font-extrabold text-teal-600 dark:text-teal-300 flex items-center gap-1 justify-end">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  {donation.freshnessScore}% Verified
                </span>
              </div>
            )}
          </div>

          {donation.freshnessNotes && (
            <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 leading-relaxed">
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Freshness Audit: </strong>
              {donation.freshnessNotes}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
        {isAvailable ? (
          <button
            onClick={() => onRequestFood(donation)}
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Request Food (NGO / Rescue)</span>
          </button>
        ) : (
          <div className="w-full text-center text-xs font-bold text-slate-500 py-1">
            Status: {donation.status}
          </div>
        )}

        {onInspectAI && (
          <button
            onClick={() => onInspectAI(donation)}
            className="p-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition"
            title="AI Freshness Audit"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </button>
        )}
      </div>

    </div>
  );
};
