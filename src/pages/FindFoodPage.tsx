import React, { useState } from 'react';
import { FoodDonation, FoodCategory, UserRole } from '../types';
import { DonationCard } from '../components/DonationCard';
import { Utensils, Search, Filter, Plus, HeartHandshake, Sparkles, Clock, MapPin } from 'lucide-react';

interface FindFoodPageProps {
  donations: FoodDonation[];
  activeRole: UserRole;
  onRequestFood: (donation: FoodDonation) => void;
  onOpenPostDonation: () => void;
  onInspectAI: (donation: FoodDonation) => void;
}

export const FindFoodPage: React.FC<FindFoodPageProps> = ({
  donations,
  activeRole,
  onRequestFood,
  onOpenPostDonation,
  onInspectAI
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories: FoodCategory[] = [
    'Cooked Food',
    'Bakery',
    'Fruits',
    'Vegetables',
    'Dairy',
    'Packaged Food',
    'Other'
  ];

  const filteredDonations = donations.filter((d) => {
    const matchesSearch = 
      d.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorArea.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 border border-emerald-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950 text-orange-300 border border-orange-800 text-xs font-semibold">
            <Utensils className="w-3.5 h-3.5" />
            <span>Surplus Food Redistribution Feed</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold">Available Surplus Food in Shegaon</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            Edible food offers listed by verified Shegaon donors. Verified NGOs, shelters, and community food rescue teams can discover and request food for immediate pickup.
          </p>
        </div>

        {(activeRole === 'DONOR' || activeRole === 'ADMIN') && (
          <button
            onClick={onOpenPostDonation}
            className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post Surplus Food</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by restaurant, canteen, mess, or Shegaon locality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Feed Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
          <span>Showing {filteredDonations.length} food offers</span>
          <span>Redistribution Area: Shegaon, MH</span>
        </div>

        {filteredDonations.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-500 space-y-3">
            <Utensils className="w-10 h-10 mx-auto text-slate-400" />
            <div className="font-extrabold text-base text-slate-800 dark:text-white">No active surplus food offers matching criteria</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Check back soon as verified Shegaon donors list fresh lunch and dinner surplus throughout the day.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((don) => (
              <DonationCard
                key={don.id}
                donation={don}
                activeRole={activeRole}
                onRequestFood={onRequestFood}
                onInspectAI={onInspectAI}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
