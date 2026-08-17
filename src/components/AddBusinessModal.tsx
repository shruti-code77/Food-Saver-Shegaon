import React, { useState } from 'react';
import { FoodBusiness, BusinessType, FoodCategory, DonationFrequency, ParticipationStatus } from '../types';
import { SHEGAON_AREAS } from '../data/shegaonData';
import { X, Building2, MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (biz: Partial<FoodBusiness>) => void;
  isAdminMode?: boolean;
}

export const AddBusinessModal: React.FC<AddBusinessModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isAdminMode = false
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [type, setType] = useState<BusinessType>('Restaurant');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState(SHEGAON_AREAS[0]);
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [openingHours, setOpeningHours] = useState('09:00 AM - 10:00 PM');
  const [selectedCategories, setSelectedCategories] = useState<FoodCategory[]>(['Cooked Food']);
  const [potentialSurplus, setPotentialSurplus] = useState('10-15 kg cooked meal surplus');
  const [donationFrequency, setDonationFrequency] = useState<DonationFrequency>('Daily');
  const [participationStatus, setParticipationStatus] = useState<ParticipationStatus>(isAdminMode ? 'IDENTIFIED' : 'REGISTERED');
  const [notes, setNotes] = useState('');

  const categoriesList: FoodCategory[] = [
    'Cooked Food',
    'Bakery',
    'Fruits',
    'Vegetables',
    'Dairy',
    'Packaged Food',
    'Other'
  ];

  const handleToggleCategory = (cat: FoodCategory) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !phone) return;

    onSubmit({
      name,
      type,
      address,
      area,
      city: 'Shegaon',
      contactPerson: contactPerson || name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@shegaonbusiness.com`,
      openingHours,
      foodCategories: selectedCategories,
      potentialSurplus,
      donationFrequency,
      participationStatus,
      isVerified: participationStatus === 'VERIFIED' || participationStatus === 'ACTIVE_DONOR',
      dataSource: isAdminMode ? 'RESEARCH' : 'VOLUNTARY_REGISTRATION',
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {isAdminMode ? 'Add Shegaon Food Business (Admin Directory)' : 'Become a FoodSaver Partner in Shegaon'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAdminMode 
                ? 'Record researched or contacted food business in Shegaon database.' 
                : 'Register your restaurant, hotel, or canteen to participate in surplus food rescue.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Anand Bhojanalaya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as BusinessType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Hotel">Hotel</option>
                <option value="Canteen">Canteen</option>
                <option value="Bakery">Bakery</option>
                <option value="Supermarket">Supermarket</option>
                <option value="Catering Service">Catering Service</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Shegaon Locality / Area *</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                {SHEGAON_AREAS.map((a, i) => (
                  <option key={i} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Street Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. Plot 12, Station Road, Shegaon"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="Owner / Manager name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                placeholder="+91 98220 XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Opening Hours</label>
              <input
                type="text"
                placeholder="09:00 AM - 10:00 PM"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Food Categories Checkboxes */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Food Categories Handled</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Estimated Daily/Weekly Surplus</label>
              <input
                type="text"
                placeholder="e.g. 15-20 kg cooked thali food"
                value={potentialSurplus}
                onChange={(e) => setPotentialSurplus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Donation Frequency</label>
              <select
                value={donationFrequency}
                onChange={(e) => setDonationFrequency(e.target.value as DonationFrequency)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          {isAdminMode && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Research / Participation Status</label>
              <select
                value={participationStatus}
                onChange={(e) => setParticipationStatus(e.target.value as ParticipationStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="IDENTIFIED">🔵 IDENTIFIED (Initial Research)</option>
                <option value="CONTACTED">🟡 CONTACTED (Outreach Initiated)</option>
                <option value="INTERESTED">🟠 INTERESTED (Expressed Interest)</option>
                <option value="REGISTERED">🟢 REGISTERED (Form Submitted)</option>
                <option value="VERIFIED">✅ VERIFIED (Audit Passed)</option>
                <option value="ACTIVE_DONOR">🍱 ACTIVE_DONOR (Posting Surplus)</option>
                <option value="NOT_INTERESTED">❌ NOT_INTERESTED (Declined)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Notes / Internal Observations</label>
            <textarea
              rows={2}
              placeholder="e.g. Hygiene standards checked, food storage facilities available..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md transition-all"
            >
              {isAdminMode ? 'Save Business to Directory' : 'Submit Partner Registration'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
