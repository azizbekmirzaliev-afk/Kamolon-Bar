import React, { useMemo, useState } from 'react';
import { X, Search, Star } from 'lucide-react';
import { getIngredientById } from '../game/ingredients';
import {
  DRINK_CATEGORIES,
  PREP_METHOD_LABELS,
  RECIPES,
  VESSEL_LABELS,
} from '../game/recipes';
import { DrinkCategoryId, MasteryMap } from '../game/types';
import { IngredientVisual } from './IngredientVisual';

interface RecipeBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  mastery: MasteryMap;
}

export const RecipeBookModal: React.FC<RecipeBookModalProps> = ({
  isOpen,
  onClose,
  mastery,
}) => {
  const [selectedCat, setSelectedCat] = useState<DrinkCategoryId | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.filter((r) => {
      if (selectedCat !== 'all' && r.category !== selectedCat) return false;
      if (!q) return true;
      if (r.name.toLowerCase().includes(q)) return true;
      return r.ingredients.some((req) =>
        (getIngredientById(req.ingredientId)?.name ?? '')
          .toLowerCase()
          .includes(q),
      );
    });
  }, [selectedCat, query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-book-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80"
    >
      <div className="w-full max-w-5xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-[#6e4c32] bg-[#1e1510] text-[#f7efe4] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#3f2c1f]">
          <div className="min-w-0">
            <h2
              id="recipe-book-title"
              className="font-display text-lg sm:text-2xl font-bold text-[#fef3c7] truncate"
            >
              Kamolon Menyu va Retseptlar Kitobi
            </h2>
            <p className="text-[11px] sm:text-xs text-[#cbb08c] mt-0.5">
              30 ta ichimlik · Single shot = 10 gr · Double shot = 18 gr
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Retsept kitobini yopish"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[#2f2119] hover:bg-[#3d2b20] border border-[#5a3d28] text-[#fef3c7] cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter & Search */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#3f2c1f] flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex md:flex-wrap gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCat('all')}
              className={`min-h-[40px] sm:min-h-0 px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-[#d97706] border-[#f59e0b] text-[#1b1410]'
                  : 'bg-[#241a14] border-[#4a3222] text-[#e7d8c3] hover:border-[#8c623d]'
              }`}
            >
              Barchasi ({RECIPES.length})
            </button>
            {DRINK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`min-h-[40px] sm:min-h-0 px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-[#d97706] border-[#f59e0b] text-[#1b1410]'
                    : 'bg-[#241a14] border-[#4a3222] text-[#e7d8c3] hover:border-[#8c623d]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-60 shrink-0">
            <Search className="w-4 h-4 text-[#a88b68] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ichimlik yoki masalliq..."
              aria-label="Retsept qidirish"
              className="w-full min-h-[40px] sm:min-h-0 pl-9 pr-3 py-1.5 rounded-lg bg-[#241a14] border border-[#4a3222] focus:border-[#f59e0b] focus:outline-none text-sm sm:text-xs text-[#fef3c7] placeholder:text-[#8c7355]"
            />
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#a88b68]">
              Mos retsept topilmadi.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((recipe) => {
                const cat = DRINK_CATEGORIES.find((c) => c.id === recipe.category);
                const m = mastery[recipe.id];
                return (
                  <div
                    key={recipe.id}
                    className="rounded-xl border border-[#4a3222] bg-[#241a14] p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="text-[11px] text-[#f59e0b] font-medium">
                            {cat?.label}
                            {recipe.volumeNote ? ` · ${recipe.volumeNote}` : ''}
                          </div>
                          <h3 className="font-display text-lg font-bold text-[#fef3c7]">
                            {recipe.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-mono-tabular text-[#cbb08c] shrink-0">
                          <Star
                            className={`w-3.5 h-3.5 ${
                              m && m.bestScore === 10
                                ? 'text-[#f59e0b] fill-[#f59e0b]'
                                : 'text-[#6e4c32]'
                            }`}
                          />
                          <span>{m ? `${m.bestScore}/10` : '—'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
                        {recipe.ingredients.map((req) => {
                          const ing = getIngredientById(req.ingredientId);
                          return (
                            <div
                              key={req.ingredientId}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#1b1410] border border-[#3d2b1f] text-xs"
                            >
                              <IngredientVisual id={req.ingredientId} size={22} className="shrink-0" />
                              <div className="min-w-0">
                                <div className="truncate font-medium text-[#f7efe4]">
                                  {ing?.name ?? req.ingredientId}
                                </div>
                                <div className="text-[11px] text-[#cbb08c] tabular-nums">
                                  {req.amount}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {(recipe.requiresSpecialVesselOrPrep || recipe.servingNote) && (
                      <div className="mt-3 pt-2 border-t border-[#3d2b1f] text-[11px] text-[#fde68a]">
                        {PREP_METHOD_LABELS[recipe.prepMethod]} ·{' '}
                        {VESSEL_LABELS[recipe.vessel]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
