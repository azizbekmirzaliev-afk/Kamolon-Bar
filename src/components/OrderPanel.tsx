import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Trash2,
  Send,
  ArrowRight,
  Eye,
  EyeOff,
  Star,
} from 'lucide-react';
import { getIngredientById } from '../game/ingredients';
import {
  DRINK_CATEGORIES,
  PREP_METHOD_LABELS,
  VESSEL_LABELS,
} from '../game/recipes';
import {
  GameMode,
  OrderEvaluation,
  PrepMethodId,
  ShiftOrder,
  VesselId,
} from '../game/types';
import { IngredientVisual, PrepVisual, VesselVisual } from './IngredientVisual';

interface OrderPanelProps {
  order: ShiftOrder;
  mode: GameMode;
  selectedIngredientIds: string[];
  onRemoveIngredient: (id: string) => void;
  onClearCup: () => void;
  selectedVessel: VesselId;
  onSelectVessel: (v: VesselId) => void;
  selectedPrep: PrepMethodId;
  onSelectPrep: (p: PrepMethodId) => void;
  onServe: () => void;
  evaluation: OrderEvaluation | null;
  onNextOrder: () => void;
  isLastOrder: boolean;
}

const VESSELS: VesselId[] = ['standart', 'ayirish', 'xaybol', 'xarikey'];
const PREPS: PrepMethodId[] = ['oddiy', 'sheyker', 'blender'];

export const OrderPanel: React.FC<OrderPanelProps> = ({
  order,
  mode,
  selectedIngredientIds,
  onRemoveIngredient,
  onClearCup,
  selectedVessel,
  onSelectVessel,
  selectedPrep,
  onSelectPrep,
  onServe,
  evaluation,
  onNextOrder,
  isLastOrder,
}) => {
  const [showHint, setShowHint] = useState(mode === 'training');
  useEffect(() => {
    setShowHint(mode === 'training');
  }, [mode, order.orderIndex]);
  const { recipe, customer, portionLabel } = order;
  const catMeta = DRINK_CATEGORIES.find((c) => c.id === recipe.category);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left: Customer Order & Optional Hint */}
      <div className="lg:col-span-5 border border-[#5a3d28] bg-[#241a14] rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#3d2b1f]">
            <div>
              <div className="text-xs text-[#cbb08c]">
                <span>{customer.name}</span>
                <span aria-hidden="true"> · </span>
                <span>{customer.role}</span>
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-[#fef3c7] mt-0.5">
                {recipe.name}
              </h2>
              <div className="text-xs text-[#f59e0b] font-medium mt-0.5">
                {catMeta?.label}
                {portionLabel ? ` · ${portionLabel}` : ''}
                {recipe.volumeNote ? ` · ${recipe.volumeNote}` : ''}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHint((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2f2119] hover:bg-[#3d2b20] border border-[#5a3d28] text-xs font-medium text-[#e7d8c3] whitespace-nowrap shrink-0 cursor-pointer"
              aria-label={showHint ? "Retsept yordamini yashirish" : "Retsept yordamini ko'rsatish"}
            >
              {showHint ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Yashirish</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Retsept ko‘rish</span>
                </>
              )}
            </button>
          </div>

          {recipe.servingNote && (
            <div className="mt-2.5 text-xs text-[#fde68a] bg-[#362519] border border-[#6e4c32] rounded-lg px-3 py-2">
              Eslatma: {recipe.servingNote}
            </div>
          )}

          {/* Recipe Checklist Hint */}
          {showHint ? (
            <div className="mt-3">
              <div className="text-xs font-semibold text-[#cbb08c] mb-2">
                Kerakli masalliqlar ({recipe.ingredients.length} ta):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
                {recipe.ingredients.map((req) => {
                  const ing = getIngredientById(req.ingredientId);
                  const isAdded = selectedIngredientIds.includes(req.ingredientId);
                  return (
                    <div
                      key={req.ingredientId}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-xs ${
                        isAdded
                          ? 'bg-[#133322] border-[#10b981]/60 text-[#d1fae5]'
                          : 'bg-[#1c140f] border-[#422f22] text-[#e7d8c3]'
                      }`}
                    >
                      <IngredientVisual id={req.ingredientId} size={22} className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">
                          {ing?.shortName ?? req.ingredientId}
                        </div>
                        <div className="text-[11px] text-[#cbb08c] tabular-nums">
                          {req.amount}
                        </div>
                      </div>
                      {isAdded && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-4 py-6 px-3 rounded-lg bg-[#1c140f] border border-[#3d2b1f] text-center">
              <p className="text-xs text-[#cbb08c]">
                {mode === 'shift'
                  ? 'Smena rejimi: Xotirangizga tayanib masalliqlarni tanlang yoki yuqoridan yordamni oching.'
                  : 'Retsept yashirilgan. Xohlasangiz "Retsept ko‘rish" tugmasini bosing.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Mixing Cup / Vessel / Serving & Evaluation */}
      <div className="lg:col-span-7 border border-[#5a3d28] bg-[#241a14] rounded-xl p-4 flex flex-col justify-between">
        {evaluation ? (
          /* Evaluation Score Card out of 10 */
          <div data-testid="evaluation-card" className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#3d2b1f]">
                <div>
                  <div className="text-xs text-[#cbb08c]">
                    {customer.name} bahosi
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#fef3c7]">
                    {evaluation.feedbackTitle}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <div
                    data-testid="score-out-of-10"
                    className={`font-mono-tabular text-3xl font-bold ${
                      evaluation.score === 10
                        ? 'text-[#10b981]'
                        : evaluation.score >= 7
                          ? 'text-[#f59e0b]'
                          : 'text-[#ef4444]'
                    }`}
                  >
                    {evaluation.score} / 10
                  </div>
                  <div className="text-xs text-[#cbb08c] tabular-nums">
                    +{evaluation.pointsEarned} ball
                  </div>
                </div>
              </div>

              {/* Visual 10-star rating bar */}
              <div className="flex items-center gap-1 my-3" aria-label={`10 dan ${evaluation.score} ball`}>
                {Array.from({ length: 10 }, (_, idx) => {
                  const filled = idx < evaluation.score;
                  return (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        filled
                          ? 'text-[#f59e0b] fill-[#f59e0b]'
                          : 'text-[#4a3527]'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Detailed Uzbek feedback */}
              <ul className="space-y-1.5 text-xs text-[#e7d8c3] mb-3">
                {evaluation.feedbackDetails.map((line, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {evaluation.isPerfect ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                    )}
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {/* Show correct recipe summary if not perfect */}
              {!evaluation.isPerfect && (
                <div className="bg-[#1c140f] border border-[#4a3222] rounded-lg p-2.5 text-xs">
                  <div className="font-semibold text-[#f59e0b] mb-1">
                    To‘g‘ri Kamolon retsepti:
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[#d6b995]">
                    {recipe.ingredients.map((req) => (
                      <span key={req.ingredientId}>
                        {getIngredientById(req.ingredientId)?.shortName} ({req.amount})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onNextOrder}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#f59e0b] text-[#1b1410] font-bold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{isLastOrder ? 'Smena natijasini ko‘rish' : 'Keyingi mijoz'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Mixing Station View */
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="text-xs font-semibold text-[#cbb08c]">
                  Stakandagi masalliqlar ({selectedIngredientIds.length} ta):
                </div>
                {selectedIngredientIds.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearCup}
                    className="inline-flex items-center gap-1 text-xs text-[#fca5a5] hover:text-[#fecaca] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Tozalash</span>
                  </button>
                )}
              </div>

              {selectedIngredientIds.length === 0 ? (
                <div className="min-h-20 flex items-center justify-center rounded-lg border border-dashed border-[#4a3222] bg-[#1c140f] px-4 py-4 text-xs text-[#a88b68] text-center">
                  Pastdagi bo‘limlardan kerakli masalliqlarni tanlang.
                </div>
              ) : (
                <div
                  data-testid="added-ingredients-list"
                  className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-1"
                >
                  {selectedIngredientIds.map((id) => {
                    const ing = getIngredientById(id);
                    const req = recipe.ingredients.find((r) => r.ingredientId === id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onRemoveIngredient(id)}
                        title="Olib tashlash uchun bosing"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2f2119] hover:bg-[#4a2822] border border-[#6e4c32] text-xs text-[#fef3c7] transition-colors cursor-pointer"
                      >
                        <IngredientVisual id={id} size={20} className="shrink-0" />
                        <span className="font-medium">{ing?.shortName ?? id}</span>
                        {mode === 'training' && req && (
                          <span className="text-[11px] text-[#f59e0b] tabular-nums">
                            · {req.amount}
                          </span>
                        )}
                        <span className="text-[#fca5a5] ml-0.5" aria-hidden="true">
                          ×
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Vessel & Prep Method Selector */}
              <div className="mt-3 pt-3 border-t border-[#3d2b1f] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] font-medium text-[#cbb08c] mb-1.5">
                    Berish idishi:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {VESSELS.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => onSelectVessel(v)}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer text-left ${
                          selectedVessel === v
                            ? 'bg-[#362519] border-[#f59e0b] text-[#fef3c7]'
                            : 'bg-[#1c140f] border-[#422f22] text-[#cbb08c] hover:border-[#785438]'
                        }`}
                      >
                        <VesselVisual vessel={v} size={18} />
                        <span className="truncate">{VESSEL_LABELS[v].replace(' stakani', '')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium text-[#cbb08c] mb-1.5">
                    Tayyorlash usuli:
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {PREPS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => onSelectPrep(p)}
                        className={`flex flex-col items-center justify-center gap-0.5 px-1.5 py-1.5 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                          selectedPrep === p
                            ? 'bg-[#362519] border-[#f59e0b] text-[#fef3c7]'
                            : 'bg-[#1c140f] border-[#422f22] text-[#cbb08c] hover:border-[#785438]'
                        }`}
                      >
                        <PrepVisual prep={p} size={18} />
                        <span className="truncate w-full text-center">
                          {p === 'oddiy' ? 'Oddiy' : p === 'sheyker' ? 'Sheyker' : 'Blender'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onServe}
                disabled={selectedIngredientIds.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#f59e0b] disabled:bg-[#3f2c1f] disabled:text-[#8c7355] text-[#1b1410] font-bold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>Mijozga berish</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
