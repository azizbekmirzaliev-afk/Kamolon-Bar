import React, { useMemo, useState } from 'react';
import { Search, Check } from 'lucide-react';
import { INGREDIENT_CATEGORIES, INGREDIENTS } from '../game/ingredients';
import { IngredientCategoryId } from '../game/types';
import { IngredientVisual } from './IngredientVisual';

interface IngredientPantryProps {
  activeCategory: IngredientCategoryId;
  onSelectCategory: (cat: IngredientCategoryId) => void;
  selectedIngredientIds: string[];
  onToggleIngredient: (ingredientId: string) => void;
  disabled?: boolean;
}

export const IngredientPantry: React.FC<IngredientPantryProps> = ({
  activeCategory,
  onSelectCategory,
  selectedIngredientIds,
  onToggleIngredient,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIngredients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return INGREDIENTS.filter(
        (ing) =>
          ing.name.toLowerCase().includes(q) ||
          ing.shortName.toLowerCase().includes(q),
      );
    }
    return INGREDIENTS.filter((ing) => ing.category === activeCategory);
  }, [activeCategory, searchQuery]);

  return (
    <section
      aria-label="Masalliqlar javoni"
      className="border border-[#5a3d28] bg-[#241a14] rounded-xl p-3 sm:p-4"
    >
      {/* Category Tabs (Horizontal thumb-swipe on mobile, wrap on desktop) + Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3 mb-3">
        <div
          role="tablist"
          aria-label="Masalliq kategoriyalari"
          className="flex lg:flex-wrap gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0 -mx-1 px-1"
        >
          {INGREDIENT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id && !searchQuery.trim();
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setSearchQuery('');
                  onSelectCategory(cat.id);
                }}
                className={`min-h-[44px] lg:min-h-0 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-[#d97706] border-[#f59e0b] text-[#1b1410]'
                    : 'bg-[#1c140f] border-[#422f22] text-[#e7d8c3] hover:border-[#8c623d]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-60 shrink-0">
          <Search className="w-4 h-4 text-[#a88b68] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Masalliq qidirish..."
            aria-label="Masalliq qidirish"
            className="w-full min-h-[42px] lg:min-h-0 pl-9 pr-3 py-2 rounded-lg bg-[#1c140f] border border-[#4a3222] focus:border-[#f59e0b] focus:outline-none text-sm sm:text-xs text-[#fef3c7] placeholder:text-[#8c7355]"
          />
        </div>
      </div>

      {/* Visual Ingredient Grid: 3 compact thumb-friendly columns on mobile, 5-7 on tablet/desktop */}
      {filteredIngredients.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#a88b68]">
          "{searchQuery}" bo‘yicha masalliq topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-2.5">
          {filteredIngredients.map((ing) => {
            const isSelected = selectedIngredientIds.includes(ing.id);
            return (
              <button
                key={ing.id}
                type="button"
                disabled={disabled}
                onClick={() => onToggleIngredient(ing.id)}
                className={`relative flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-xl border text-center transition-transform active:scale-95 min-h-[88px] sm:min-h-[104px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-[#163826] border-[#10b981] text-[#ecfdf5]'
                    : 'bg-[#1c140f] border-[#422f22] hover:border-[#d97706] text-[#f7efe4]'
                }`}
              >
                {isSelected && (
                  <span
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#10b981] text-[#052e16] flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
                <IngredientVisual id={ing.id} size={40} className="sm:w-[46px] sm:h-[46px] my-0.5" />
                <div className="w-full mt-1">
                  <div className="text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2">
                    {ing.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
