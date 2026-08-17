import React, { useState } from 'react';
import { UserRole, NotificationItem } from '../types';
import { 
  HeartHandshake, 
  Building2, 
  Utensils, 
  MapPin, 
  Home, 
  BarChart3, 
  Refrigerator, 
  ShieldCheck, 
  Bell, 
  User, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  notifications: NotificationItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeRole,
  setActiveRole,
  notifications
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const rolesList: { role: UserRole; label: string; desc: string; icon: any }[] = [
    { role: 'ADMIN', label: 'Admin Cell', desc: 'Directory management & verifications', icon: ShieldCheck },
    { role: 'DONOR', label: 'Food Donor', desc: 'Restaurants, Hotels & Canteens', icon: Utensils },
    { role: 'NGO', label: 'NGO / Food Bank', desc: 'Search & request surplus food', icon: HeartHandshake },
    { role: 'USER', label: 'Household User', desc: 'Track pantry & AI zero-waste recipes', icon: Refrigerator }
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'directory', label: 'Food Partners', icon: Building2 },
    { id: 'find-food', label: 'Find Available Food', icon: Utensils },
    { id: 'map', label: 'Shegaon Map', icon: MapPin },
    { id: 'inventory', label: 'Household Inventory', icon: Refrigerator },
    { id: 'impact', label: 'Impact', icon: BarChart3 },
    { 
      id: 'dashboard', 
      label: activeRole === 'ADMIN' ? 'Admin Suite' : activeRole === 'DONOR' ? 'Donor Portal' : activeRole === 'NGO' ? 'NGO Portal' : 'My Dashboard', 
      icon: ShieldCheck 
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-emerald-900/95 text-white backdrop-blur-md border-b border-emerald-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 text-emerald-950 flex items-center justify-center shadow-md font-bold text-xl">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">FoodSaver</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 font-medium border border-emerald-600/50">
                  Shegaon
                </span>
              </div>
              <p className="text-[10px] text-emerald-200 hidden sm:block">
                Surplus Food Redistribution Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-700/90 text-white shadow-inner border border-emerald-600/50'
                      : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Role Switcher & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-750 text-emerald-100 text-xs sm:text-sm font-medium border border-emerald-700/70 transition-all"
                title="Switch Role for Testing"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline text-emerald-300 text-[11px] uppercase tracking-wider font-semibold">Mode:</span>
                <span className="font-semibold text-white">
                  {rolesList.find(r => r.role === activeRole)?.label}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-slate-100"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 mb-1">
                    Switch Active User Role (Demo)
                  </div>
                  {rolesList.map(r => {
                    const Icon = r.icon;
                    const isSelected = activeRole === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          setActiveRole(r.role);
                          setCurrentTab('dashboard');
                        }}
                        className={`w-full text-left flex items-start gap-2.5 p-2 rounded-lg transition-all ${
                          isSelected ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold">{r.label}</div>
                          <div className="text-[10px] text-slate-400">{r.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification Drawer */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-slate-100 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5" /> Shegaon Updates
                    </span>
                    <span className="text-[10px] text-slate-400">{notifications.length} alerts</span>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No notifications</p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map(n => (
                        <div key={n.id} className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
                          <div className="font-semibold text-emerald-300 mb-0.5">{n.title}</div>
                          <p className="text-slate-300 text-[11px] leading-snug">{n.message}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-emerald-800 text-emerald-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-b border-emerald-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
