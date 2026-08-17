import React from 'react';
import { Heart, MapPin, ShieldCheck, ExternalLink, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center">
                🌱
              </div>
              <span className="font-bold text-lg text-white">FoodSaver Shegaon</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A smart web-based civic platform for food waste reduction, restaurant surplus mapping, and food redistribution in Shegaon, Maharashtra.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Pilot Region: Shegaon, Dist. Buldhana (MH)</span>
            </div>
          </div>

          {/* SDG Goals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">UN Sustainable Development Goals</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">SDG2</span>
                <span className="text-slate-200 font-medium">Zero Hunger</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">SDG12</span>
                <span className="text-slate-200 font-medium">Responsible Consumption</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-teal-600 text-white font-bold flex items-center justify-center text-[10px]">SDG13</span>
                <span className="text-slate-200 font-medium">Climate Action</span>
              </div>
            </div>
          </div>

          {/* Shegaon Directory Key Localities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Shegaon Target Localities</h4>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li>• Station Road & Railway Flyover</li>
              <li>• Gajanan Maharaj Temple Complex Area</li>
              <li>• Anand Sagar Road & Gate Junction</li>
              <li>• Main Market & Old Bus Stand</li>
              <li>• Khamgaon Highway Border Area</li>
              <li>• College Road & Academic Zone</li>
            </ul>
          </div>

          {/* Verification & Data Policy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Data & Ethics Principle</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Business information is collected via direct research, physical visits, or voluntary registration. Only verified partners display the verified badge. Private contact details are protected.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Admin Controlled Verification & Quality Standards</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} FoodSaver Shegaon Project. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Computer Science & Engineering Civic Tech Project</span>
            <span className="text-emerald-500 font-medium flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Shegaon
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
