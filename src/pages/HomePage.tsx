import React from 'react';
import { ImpactAnalytics, FoodBusiness, FoodDonation, UserRole } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { BusinessCard } from '../components/BusinessCard';
import { DonationCard } from '../components/DonationCard';
import { ShegaonMap } from '../components/ShegaonMap';
import { 
  Building2, 
  Utensils, 
  HeartHandshake, 
  MapPin, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Leaf, 
  Search,
  Plus
} from 'lucide-react';

interface HomePageProps {
  analytics: ImpactAnalytics | null;
  businesses: FoodBusiness[];
  donations: FoodDonation[];
  activeRole: UserRole;
  setCurrentTab: (tab: string) => void;
  onOpenAddBusiness: () => void;
  onOpenPostDonation: () => void;
  onOpenBusinessDetails: (biz: FoodBusiness) => void;
  onRequestFood: (don: FoodDonation) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  analytics,
  businesses,
  donations,
  activeRole,
  setCurrentTab,
  onOpenAddBusiness,
  onOpenPostDonation,
  onOpenBusinessDetails,
  onRequestFood
}) => {
  const verifiedPartners = businesses.filter(b => b.isVerified);
  const activeDonations = donations.filter(d => d.status === 'Available');

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 sm:p-12 lg:p-16 border border-emerald-800 shadow-2xl">
        
        {/* Background Decorative Pattern */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-10 top-10 w-64 h-64 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs font-semibold backdrop-blur">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Shegaon Civic Sustainability Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Saving Surplus Food. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
              Strengthening Our Community.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            A centralized web platform collecting, verifying, and mapping Shegaon’s food businesses to connect verified surplus donors with local NGOs and community food relief teams.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAddBusiness()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Become a Food Partner</span>
            </button>

            <button
              onClick={() => setCurrentTab('find-food')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm border border-white/20 backdrop-blur transition-all flex items-center gap-2"
            >
              <Utensils className="w-4 h-4 text-amber-300" />
              <span>Find Available Food</span>
            </button>

            <button
              onClick={() => setCurrentTab('directory')}
              className="px-5 py-3.5 rounded-2xl bg-emerald-800/60 hover:bg-emerald-800 text-emerald-200 font-bold text-xs sm:text-sm border border-emerald-700/60 transition-all flex items-center gap-1.5"
            >
              <span>Explore Shegaon Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Impact Statistics Counter Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <Building2 className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Directory</span>
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.registeredBusinesses || businesses.length}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Identified Food Businesses
          </div>
          <p className="text-[10px] text-slate-400">Restaurants, hotels & canteens in Shegaon</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Audited</span>
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.verifiedPartners || verifiedPartners.length}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Verified FoodSaver Partners
          </div>
          <p className="text-[10px] text-slate-400">Inspected & authorized food donors</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <Utensils className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Rescued</span>
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.foodSavedKg || 850} kg
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Surplus Food Saved
          </div>
          <p className="text-[10px] text-slate-400">Prevented from going to waste</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <HeartHandshake className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Completed</span>
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.successfulDonations || 356}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Redistribution Pickups
          </div>
          <p className="text-[10px] text-slate-400">Coordinated with verified NGOs</p>
        </div>

      </section>

      {/* How FoodSaver Shegaon Works Process Workflow */}
      <section className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Structured Civic Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How FoodSaver Shegaon Works
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            From initial business research to verified NGO pickup and impact tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
          
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 relative">
            <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-extrabold flex items-center justify-center text-xs">
              01
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Identify</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Food businesses in Shegaon are identified through local research.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 font-extrabold flex items-center justify-center text-xs">
              02
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Contact & Register</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Outreach is conducted and interested businesses submit registration details.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-extrabold flex items-center justify-center text-xs">
              03
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Admin Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Admin audits premises and grants <strong className="text-emerald-600">✓ Verified Partner</strong> badge.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-extrabold flex items-center justify-center text-xs">
              04
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">List Surplus</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Active donors list edible surplus food with quantity & expiry window.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center text-xs">
              05
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">NGO Collection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verified NGOs request, collect, and redistribute food to community kitchens.
            </p>
          </div>

        </div>
      </section>

      {/* Shegaon GIS Map Interactive Preview */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Shegaon Food Business & Surplus Map
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive geographic distribution of verified food partners, available meals, and local NGOs.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('map')}
            className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-200 transition self-start sm:self-auto"
          >
            Full Screen GIS Map →
          </button>
        </div>

        <ShegaonMap
          businesses={businesses}
          donations={donations}
          height="420px"
          onSelectBusiness={onOpenBusinessDetails}
          onSelectDonation={onRequestFood}
        />
      </section>

      {/* Active Food Offers Ticker Deck */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-500" />
              Available Surplus Food Offers in Shegaon
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Freshly listed edible meals ready for verified NGO collection.
            </p>
          </div>
          {activeRole === 'DONOR' || activeRole === 'ADMIN' ? (
            <button
              onClick={onOpenPostDonation}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Post Surplus Offer</span>
            </button>
          ) : null}
        </div>

        {activeDonations.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs">
            No active surplus offers listed right now. Check back soon or view registered food partners!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeDonations.slice(0, 3).map((don) => (
              <DonationCard
                key={don.id}
                donation={don}
                activeRole={activeRole}
                onRequestFood={onRequestFood}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Shegaon Directory Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Featured Shegaon Food Partners
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Directory of restaurants, hotels, and canteens categorized by participation status.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('directory')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
          >
            <span>View All Directory ({businesses.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.slice(0, 3).map((biz) => (
            <BusinessCard
              key={biz.id}
              business={biz}
              activeRole={activeRole}
              onOpenDetails={onOpenBusinessDetails}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
