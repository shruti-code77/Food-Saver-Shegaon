/**
 * FoodSaver Shegaon: A Smart Web-Based Platform for Food Waste Reduction
 * and Surplus Food Redistribution in Shegaon, Maharashtra.
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  FoodBusiness, 
  FoodDonation, 
  DonationRequest, 
  HouseholdInventoryItem, 
  NotificationItem, 
  ImpactAnalytics 
} from './types';
import { 
  fetchBusinesses, 
  fetchDonations, 
  fetchRequests, 
  fetchInventory, 
  fetchAnalytics, 
  fetchNotifications, 
  createBusiness, 
  createDonation, 
  requestDonation 
} from './lib/api';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AddBusinessModal } from './components/AddBusinessModal';
import { PostDonationModal } from './components/PostDonationModal';
import { ContactHistoryModal } from './components/ContactHistoryModal';
import { AIFreshnessInspectorModal } from './components/AIFreshnessInspectorModal';

import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { FindFoodPage } from './pages/FindFoodPage';
import { HouseholdPage } from './pages/HouseholdPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { DonorDashboard } from './pages/DonorDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { ImpactPage } from './pages/ImpactPage';
import { ShegaonMap } from './components/ShegaonMap';

import { HeartHandshake, Utensils, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('ADMIN');

  // Application Data State
  const [businesses, setBusinesses] = useState<FoodBusiness[]>([]);
  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [inventory, setInventory] = useState<HouseholdInventoryItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [analytics, setAnalytics] = useState<ImpactAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [addBusinessModalOpen, setAddBusinessModalOpen] = useState(false);
  const [postDonationModalOpen, setPostDonationModalOpen] = useState(false);
  const [statusUpdateBusiness, setStatusUpdateBusiness] = useState<FoodBusiness | null>(null);
  const [aiFreshnessModalOpen, setAiFreshnessModalOpen] = useState(false);
  const [inspectDonationTarget, setInspectDonationTarget] = useState<FoodDonation | null>(null);

  // Request Food Modal State
  const [requestFoodTarget, setRequestFoodTarget] = useState<FoodDonation | null>(null);
  const [ngoNotes, setNgoNotes] = useState('For daily community meal distribution at Station Road shelter.');
  const [requestedQty, setRequestedQty] = useState(20);

  // Load backend data
  const reloadData = async () => {
    try {
      const [bData, dData, rData, iData, aData, nData] = await Promise.all([
        fetchBusinesses(),
        fetchDonations(),
        fetchRequests(),
        fetchInventory(),
        fetchAnalytics(),
        fetchNotifications()
      ]);

      setBusinesses(bData);
      setDonations(dData);
      setRequests(rData);
      setInventory(iData);
      setAnalytics(aData);
      setNotifications(nData);
    } catch (err) {
      console.error('Error fetching Shegaon platform data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Handlers
  const handleCreateBusiness = async (data: Partial<FoodBusiness>) => {
    await createBusiness(data);
    await reloadData();
  };

  const handleCreateDonation = async (data: Partial<FoodDonation>) => {
    await createDonation(data);
    await reloadData();
  };

  const handleSubmitFoodRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestFoodTarget) return;

    await requestDonation(requestFoodTarget.id, {
      ngoId: 'usr-ngo1',
      ngoName: 'Shegaon Annadaata Foundation',
      ngoContact: '+91 97654 32100',
      recipientNotes: ngoNotes,
      requestedQuantity: requestedQty
    });

    setRequestFoodTarget(null);
    await reloadData();
    alert('Food request submitted to donor! View request status in NGO Portal.');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        notifications={notifications}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Initializing FoodSaver Shegaon Engine...</p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomePage
                analytics={analytics}
                businesses={businesses}
                donations={donations}
                activeRole={activeRole}
                setCurrentTab={setCurrentTab}
                onOpenAddBusiness={() => setAddBusinessModalOpen(true)}
                onOpenPostDonation={() => setPostDonationModalOpen(true)}
                onOpenBusinessDetails={(biz) => setStatusUpdateBusiness(biz)}
                onRequestFood={(don) => {
                  setRequestFoodTarget(don);
                  setRequestedQty(don.quantity);
                }}
              />
            )}

            {currentTab === 'directory' && (
              <DirectoryPage
                businesses={businesses}
                activeRole={activeRole}
                onOpenAddBusiness={() => setAddBusinessModalOpen(true)}
                onOpenDetails={(biz) => setStatusUpdateBusiness(biz)}
                onOpenStatusUpdate={(biz) => setStatusUpdateBusiness(biz)}
              />
            )}

            {currentTab === 'find-food' && (
              <FindFoodPage
                donations={donations}
                activeRole={activeRole}
                onRequestFood={(don) => {
                  setRequestFoodTarget(don);
                  setRequestedQty(don.quantity);
                }}
                onOpenPostDonation={() => setPostDonationModalOpen(true)}
                onInspectAI={(don) => {
                  setInspectDonationTarget(don);
                  setAiFreshnessModalOpen(true);
                }}
              />
            )}

            {currentTab === 'map' && (
              <div className="space-y-6 pb-16">
                <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Shegaon GIS Mapping
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold">Geographic Food Distribution Map</h1>
                  <p className="text-xs text-slate-400">
                    Live interactive mapping of verified food businesses, active food offers, and NGO distribution nodes across Shegaon.
                  </p>
                </div>

                <ShegaonMap
                  businesses={businesses}
                  donations={donations}
                  height="600px"
                  onSelectBusiness={(biz) => setStatusUpdateBusiness(biz)}
                  onSelectDonation={(don) => {
                    setRequestFoodTarget(don);
                    setRequestedQty(don.quantity);
                  }}
                />
              </div>
            )}

            {currentTab === 'inventory' && (
              <HouseholdPage
                inventory={inventory}
                onReloadInventory={reloadData}
              />
            )}

            {currentTab === 'impact' && (
              <ImpactPage analytics={analytics} />
            )}

            {currentTab === 'dashboard' && (
              <>
                {activeRole === 'ADMIN' && (
                  <AdminDashboard
                    businesses={businesses}
                    analytics={analytics}
                    requests={requests}
                    onOpenAddBusiness={() => setAddBusinessModalOpen(true)}
                    onOpenStatusUpdate={(biz) => setStatusUpdateBusiness(biz)}
                    onReloadData={reloadData}
                  />
                )}

                {activeRole === 'DONOR' && (
                  <DonorDashboard
                    donations={donations}
                    requests={requests}
                    onOpenPostDonation={() => setPostDonationModalOpen(true)}
                    onReloadData={reloadData}
                  />
                )}

                {activeRole === 'NGO' && (
                  <NgoDashboard
                    requests={requests}
                    donations={donations}
                    setCurrentTab={setCurrentTab}
                    onReloadData={reloadData}
                  />
                )}

                {activeRole === 'USER' && (
                  <HouseholdPage
                    inventory={inventory}
                    onReloadInventory={reloadData}
                  />
                )}
              </>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AddBusinessModal
        isOpen={addBusinessModalOpen}
        onClose={() => setAddBusinessModalOpen(false)}
        onSubmit={handleCreateBusiness}
        isAdminMode={activeRole === 'ADMIN'}
      />

      <PostDonationModal
        isOpen={postDonationModalOpen}
        onClose={() => setPostDonationModalOpen(false)}
        onSubmit={handleCreateDonation}
      />

      <ContactHistoryModal
        isOpen={!!statusUpdateBusiness}
        onClose={() => setStatusUpdateBusiness(null)}
        business={statusUpdateBusiness}
        onBusinessUpdated={reloadData}
      />

      <AIFreshnessInspectorModal
        isOpen={aiFreshnessModalOpen}
        onClose={() => {
          setAiFreshnessModalOpen(false);
          setInspectDonationTarget(null);
        }}
        initialFoodName={inspectDonationTarget?.foodName}
        initialDescription={inspectDonationTarget?.description}
      />

      {/* NGO Request Food Modal */}
      {requestFoodTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-900 dark:text-slate-100">
            <button
              onClick={() => setRequestFoodTarget(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 font-extrabold flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Request Food Redistribution</h3>
                <p className="text-xs text-slate-500">
                  Donor: {requestFoodTarget.donorName} ({requestFoodTarget.donorArea}, Shegaon)
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitFoodRequest} className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <div className="font-extrabold text-base text-slate-900 dark:text-white">
                  {requestFoodTarget.donorName} ({requestFoodTarget.donorType})
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                  <span>Portions Available: {requestFoodTarget.quantity} {requestFoodTarget.unit}</span>
                  {requestFoodTarget.freshnessScore && (
                    <span>Freshness: {requestFoodTarget.freshnessScore}% Verified</span>
                  )}
                </div>
                {requestFoodTarget.freshnessNotes && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 italic pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                    {requestFoodTarget.freshnessNotes}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1">Requested Quantity ({requestFoodTarget.unit})</label>
                <input
                  type="number"
                  min="1"
                  max={requestFoodTarget.quantity}
                  value={requestedQty}
                  onChange={(e) => setRequestedQty(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Recipient & Distribution Notes</label>
                <textarea
                  rows={2}
                  required
                  value={ngoNotes}
                  onChange={(e) => setNgoNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  placeholder="e.g. For distribution among community shelter residents..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRequestFoodTarget(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold shadow"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
