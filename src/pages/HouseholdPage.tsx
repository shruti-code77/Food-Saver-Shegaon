import React, { useState } from 'react';
import { HouseholdInventoryItem, FoodCategory } from '../types';
import { addInventoryItem, deleteInventoryItem, updateInventoryItem } from '../lib/api';
import { AIRecipeGeneratorModal } from '../components/AIRecipeGeneratorModal';
import { Refrigerator, Plus, Sparkles, AlertTriangle, CheckCircle2, Trash2, Clock, Leaf } from 'lucide-react';

interface HouseholdPageProps {
  inventory: HouseholdInventoryItem[];
  onReloadInventory: () => void;
}

export const HouseholdPage: React.FC<HouseholdPageProps> = ({
  inventory,
  onReloadInventory
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);

  // Form state
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Dairy');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('liters');
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName) return;

    await addInventoryItem({
      userId: 'usr-citizen',
      foodName,
      category,
      quantity,
      unit,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate,
      status: 'FRESH',
      notes
    });

    setFoodName('');
    setAddModalOpen(false);
    onReloadInventory();
  };

  const handleDelete = async (id: string) => {
    await deleteInventoryItem(id);
    onReloadInventory();
  };

  const handleMarkConsumed = async (id: string) => {
    await updateInventoryItem(id, { status: 'CONSUMED' });
    onReloadInventory();
  };

  const expiringItems = inventory.filter(i => i.status === 'EXPIRING_SOON');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700 text-xs font-semibold">
            <Refrigerator className="w-3.5 h-3.5" />
            <span>Household Food Waste Reduction</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold">My Household Pantry & Expiry Tracker</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track household food purchase & expiry dates, receive expiry reminders, and generate zero-waste recipes using Gemini AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setRecipeModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gemini AI Zero-Waste Chef</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pantry Item</span>
          </button>
        </div>
      </div>

      {/* Expiring Soon Alert Banner */}
      {expiringItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{expiringItems.length} pantry items are expiring soon in your kitchen! Use them before they spoil.</span>
          </div>
          <button
            onClick={() => setRecipeModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs shrink-0 shadow"
          >
            Get Recipe Ideas →
          </button>
        </div>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map((item) => {
          const isExpiringSoon = item.status === 'EXPIRING_SOON';
          const isExpired = item.status === 'EXPIRED';
          const isConsumed = item.status === 'CONSUMED';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isExpired
                  ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                  : isExpiringSoon
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                  : isConsumed
                  ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {item.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    isExpired
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : isExpiringSoon
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : isConsumed
                      ? 'bg-slate-200 text-slate-700 border-slate-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                  {item.foodName}
                </h3>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-3">
                  <div>Quantity: <strong className="text-slate-900 dark:text-white">{item.quantity} {item.unit}</strong></div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>Expires: {item.expiryDate}</span>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg mb-3">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                {!isConsumed && (
                  <button
                    onClick={() => handleMarkConsumed(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-200 transition"
                  >
                    Mark Consumed
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Add Pantry Item</h3>
            <form onSubmit={handleAddItem} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Amul Milk / Wheat Bread"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Dairy">Dairy</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Packaged Food">Packaged Food</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold shadow"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      <AIRecipeGeneratorModal
        isOpen={recipeModalOpen}
        onClose={() => setRecipeModalOpen(false)}
        availableIngredients={inventory.map(i => i.foodName)}
      />

    </div>
  );
};
