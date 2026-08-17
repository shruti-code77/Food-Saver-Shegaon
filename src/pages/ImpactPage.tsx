import React from 'react';
import { ImpactAnalytics } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, Leaf, Utensils, HeartHandshake, ShieldCheck, Globe, CheckCircle2, Award } from 'lucide-react';

interface ImpactPageProps {
  analytics: ImpactAnalytics | null;
}

export const ImpactPage: React.FC<ImpactPageProps> = ({ analytics }) => {
  const trendData = [
    { month: 'Mar', foodSavedKg: 120, meals: 380 },
    { month: 'Apr', foodSavedKg: 210, meals: 650 },
    { month: 'May', foodSavedKg: 340, meals: 1050 },
    { month: 'Jun', foodSavedKg: 520, meals: 1600 },
    { month: 'Jul', foodSavedKg: 710, meals: 2200 },
    { month: 'Aug', foodSavedKg: analytics?.foodSavedKg || 850, meals: analytics?.mealsProvided || 2700 }
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-8 border border-emerald-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-600 text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Shegaon Civic Impact & SDG Report</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold">Food Rescue & Sustainability Impact</h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
          Measuring the ecological and humanitarian achievements of FoodSaver Shegaon in reducing commercial food waste and strengthening local food security.
        </p>
      </div>

      {/* High-level Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <Utensils className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Rescued</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.foodSavedKg || 850} <span className="text-lg">kg</span>
          </div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Surplus Edible Food Saved</p>
          <p className="text-[10px] text-slate-400">Diverted from landfills in Shegaon</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-teal-600">
            <HeartHandshake className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Nutritional</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.mealsProvided || 2720}
          </div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Nourishing Meals Provided</p>
          <p className="text-[10px] text-slate-400">Distributed to community shelters</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-teal-500">
            <Leaf className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Ecological</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.co2SavedKg || 2125} <span className="text-lg">kg</span>
          </div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">CO₂ Equivalent Prevented</p>
          <p className="text-[10px] text-slate-400">Greenhouse emissions avoided</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <Award className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Network</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.activeDonors || 4}
          </div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Active Donating Partners</p>
          <p className="text-[10px] text-slate-400">Restaurants, Canteens & Bakeries</p>
        </div>

      </div>

      {/* Rescue Growth Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <span>Monthly Food Rescue Trajectory (Kg Food Saved)</span>
        </h3>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Line type="monotone" dataKey="foodSavedKg" stroke="#059669" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* UN Sustainable Development Goals Alignment */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Global Agenda
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            UN Sustainable Development Goals (SDGs) Alignment
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              SDG 2
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Zero Hunger</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Redirecting edible commercial surplus meals from Shegaon restaurants directly to local shelters, preventing nutritional loss and supporting food security.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
              SDG 12
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Responsible Consumption</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Fostering a circular food economy by converting organic business waste risks into structured community donations and household inventory tracking.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-sm">
              SDG 13
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Climate Action</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Avoiding methane emissions generated when decomposing food enters municipal waste streams, contributing to local climate resilience.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
