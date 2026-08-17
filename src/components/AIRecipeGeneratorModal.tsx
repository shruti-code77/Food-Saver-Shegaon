import React, { useState } from 'react';
import { generateRecipesWithAI } from '../lib/api';
import { X, Utensils, Sparkles, Loader2, ChefHat, Clock, Leaf } from 'lucide-react';

interface AIRecipeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableIngredients?: string[];
}

export const AIRecipeGeneratorModal: React.FC<AIRecipeGeneratorModalProps> = ({
  isOpen,
  onClose,
  availableIngredients = ['Amul Milk', 'Whole Wheat Bread Loaf', 'Fresh Tomatoes', 'Curd']
}) => {
  if (!isOpen) return null;

  const [ingredientsInput, setIngredientsInput] = useState(availableIngredients.join(', '));
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<{
    recipeTitle: string;
    prepTimeMinutes: number;
    keyIngredientsUsed: string[];
    cookingSteps: string[];
    zeroWasteTip: string;
  }[] | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const list = ingredientsInput.split(',').map(s => s.trim()).filter(Boolean);
    try {
      const data = await generateRecipesWithAI(list);
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setRecipes([
        {
          recipeTitle: 'Quick Vegetable Roti Roll & Masala Tea',
          prepTimeMinutes: 15,
          keyIngredientsUsed: list,
          cookingSteps: [
            'Sauté chopped tomatoes and capscicum with cumin powder in mustard oil.',
            'Spread mint chutney on chapati or bread slices and roll tightly.',
            'Serve warm for a quick nutritious zero-waste breakfast.'
          ],
          zeroWasteTip: 'Store vegetable skins in freezer to make homemade soup broth.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Gemini AI Zero-Waste Household Chef
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Input expiring pantry ingredients to generate quick zero-waste Maharashtrian & fusion recipes!
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Expiring Household Ingredients (Comma Separated)
            </label>
            <input
              type="text"
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-medium"
              placeholder="e.g. Milk, Bread Loaf, Tomatoes, Potatoes"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !ingredientsInput}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate Zero-Waste Recipes</span>
          </button>

          {recipes && (
            <div className="space-y-4 mt-6">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <ChefHat className="w-4 h-4" /> AI Recipe Recommendations
              </h3>

              {recipes.map((r, index) => (
                <div key={index} className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-900">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {r.recipeTitle}
                    </h4>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-600 text-white flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {r.prepTimeMinutes} mins
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Ingredients Used:</span>
                    <div className="flex flex-wrap gap-1">
                      {r.keyIngredientsUsed.map((ing, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 font-medium text-[11px] border border-amber-200 dark:border-amber-900">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Preparation Steps:</span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {r.cookingSteps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {r.zeroWasteTip && (
                    <div className="p-2.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-300 dark:border-emerald-800">
                      <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Zero-Waste Tip:</strong> {r.zeroWasteTip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
