import React, { useState } from 'react';
import { FoodBusiness, ParticipationStatus, BusinessType, UserRole } from '../types';
import { SHEGAON_AREAS } from '../data/shegaonData';
import { BusinessCard } from '../components/BusinessCard';
import { Search, Filter, Plus, Building2, ShieldCheck, MapPin, SlidersHorizontal } from 'lucide-react';

interface DirectoryPageProps {
  businesses: FoodBusiness[];
  activeRole: UserRole;
  onOpenAddBusiness: () => void;
  onOpenDetails: (biz: FoodBusiness) => void;
  onOpenStatusUpdate: (biz: FoodBusiness) => void;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  businesses,
  activeRole,
  onOpenAddBusiness,
  onOpenDetails,
  onOpenStatusUpdate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const statusOptions: { key: string; label: string }[] = [
    { key: 'ALL', label: 'All Statuses' },
    { key: 'VERIFIED', label: '✅ Verified Partners' },
    { key: 'ACTIVE_DONOR', label: '🍱 Active Donors' },
    { key: 'REGISTERED', label: '🟢 Registered' },
    { key: 'INTERESTED', label: '🟠 Interested' },
    { key: 'CONTACTED', label: '🟡 Contacted' },
    { key: 'IDENTIFIED', label: '🔵 Identified' },
    { key: 'NOT_INTERESTED', label: '❌ Not Interested' }
  ];

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || b.participationStatus === selectedStatus;
    const matchesArea = selectedArea === 'ALL' || b.area === selectedArea;
    const matchesType = selectedType === 'ALL' || b.type === selectedType;

    return matchesSearch && matchesStatus && matchesArea && matchesType;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Shegaon Food Business Directory</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold">Food Partners in Shegaon</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Centralized directory tracking identified food businesses, outreach status, audit verification, and active surplus donor participation in Shegaon, Maharashtra.
          </p>
        </div>

        <button
          onClick={onOpenAddBusiness}
          className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{activeRole === 'ADMIN' ? 'Add Business to Directory' : 'Become a Food Partner'}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by restaurant name, area, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Area Filter */}
          <div>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Shegaon Localities</option>
              {SHEGAON_AREAS.map((area, i) => (
                <option key={i} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Business Types</option>
              <option value="Restaurant">Restaurants</option>
              <option value="Hotel">Hotels</option>
              <option value="Canteen">Canteens</option>
              <option value="Bakery">Bakeries</option>
              <option value="Supermarket">Supermarkets</option>
              <option value="Catering Service">Catering Services</option>
            </select>
          </div>

        </div>

        {/* Status Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 border-t border-slate-100 dark:border-slate-700/60 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 mr-2 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Status Filter:
          </span>
          {statusOptions.map((st) => {
            const isSelected = selectedStatus === st.key;
            return (
              <button
                key={st.key}
                onClick={() => setSelectedStatus(st.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Directory Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
          <span>Showing {filteredBusinesses.length} of {businesses.length} Food Businesses</span>
          <span>Pilot City: Shegaon, Maharashtra</span>
        </div>

        {filteredBusinesses.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-500 space-y-3">
            <Building2 className="w-10 h-10 mx-auto text-slate-400" />
            <div className="font-extrabold text-base text-slate-800 dark:text-white">No businesses found matching filters</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search keywords, locality area, or participation status filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((biz) => (
              <BusinessCard
                key={biz.id}
                business={biz}
                activeRole={activeRole}
                onOpenDetails={onOpenDetails}
                onOpenStatusUpdate={onOpenStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
