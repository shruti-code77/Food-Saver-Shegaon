import React from 'react';
import { FoodBusiness, UserRole } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Phone, Mail, Clock, Utensils, History, Edit3, ShieldAlert } from 'lucide-react';

interface BusinessCardProps {
  business: FoodBusiness;
  activeRole: UserRole;
  onOpenDetails: (biz: FoodBusiness) => void;
  onOpenStatusUpdate?: (biz: FoodBusiness) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  activeRole,
  onOpenDetails,
  onOpenStatusUpdate
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      
      <div>
        {/* Header: Name & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mb-1">
              {business.type}
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {business.name}
            </h3>
          </div>
          <StatusBadge status={business.participationStatus} isVerified={business.isVerified} />
        </div>

        {/* Location & Contact Info */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{business.area}, Shegaon</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Hours: {business.openingHours}</span>
          </div>

          {/* Contact info visible if authorized or user is admin */}
          {(activeRole === 'ADMIN' || business.isVerified) && (
            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {business.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                {business.contactPerson}
              </span>
            </div>
          )}
        </div>

        {/* Categories & Surplus Info */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mb-4 space-y-2">
          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Potential Surplus Offer</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{business.donationFrequency}</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
            "{business.potentialSurplus}"
          </p>
          
          <div className="flex flex-wrap gap-1 pt-1">
            {business.foodCategories.map((cat, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetails(business)}
          className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-800 dark:text-white transition-colors text-center"
        >
          View Profile & History
        </button>

        {activeRole === 'ADMIN' && onOpenStatusUpdate && (
          <button
            onClick={() => onOpenStatusUpdate(business)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1"
            title="Update Research Status / Audit"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Status</span>
          </button>
        )}
      </div>

    </div>
  );
};
