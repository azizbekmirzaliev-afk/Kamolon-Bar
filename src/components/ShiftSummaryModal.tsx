import React from 'react';
import { Award, RotateCcw, Home, Star } from 'lucide-react';
import { CompletedOrderRecord } from '../game/types';

interface ShiftSummaryModalProps {
  records: CompletedOrderRecord[];
  totalPoints: number;
  onPlayAgain: () => void;
  onGoTitle: () => void;
}

export const ShiftSummaryModal: React.FC<ShiftSummaryModalProps> = ({
  records,
  totalPoints,
  onPlayAgain,
  onGoTitle,
}) => {
  const avgScore =
    records.length > 0
      ? (records.reduce((acc, r) => acc + r.score, 0) / records.length).toFixed(1)
      : '0.0';
  const perfectCount = records.filter((r) => r.score === 10).length;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#1b1410] text-[#f7efe4]">
      <div className="w-full max-w-2xl rounded-2xl border border-[#6e4c32] bg-[#241a14] p-6 md:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#362519] border border-[#f59e0b] text-[#f59e0b] mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#fef3c7]">
            Smena yakunlandi!
          </h1>
          <p className="text-sm text-[#cbb08c] mt-1">
            Kamolon baridagi bugungi natijalaringiz
          </p>
        </div>

        {/* 3 Key Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-[#1b1410] border border-[#4a3222] p-3 text-center">
            <div className="text-[11px] text-[#cbb08c]">O‘rtacha baho</div>
            <div className="font-mono-tabular text-2xl font-bold text-[#f59e0b] mt-0.5">
              {avgScore} / 10
            </div>
          </div>
          <div className="rounded-xl bg-[#1b1410] border border-[#4a3222] p-3 text-center">
            <div className="text-[11px] text-[#cbb08c]">Umumiy ball</div>
            <div className="font-mono-tabular text-2xl font-bold text-[#fef3c7] mt-0.5">
              {totalPoints}
            </div>
          </div>
          <div className="rounded-xl bg-[#1b1410] border border-[#4a3222] p-3 text-center">
            <div className="text-[11px] text-[#cbb08c]">10/10 Mukammal</div>
            <div className="font-mono-tabular text-2xl font-bold text-[#10b981] mt-0.5">
              {perfectCount} / {records.length}
            </div>
          </div>
        </div>

        {/* Drink-by-Drink Breakdown */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 mb-6">
          {records.map((rec, idx) => (
            <div
              key={`${rec.recipeId}-${idx}`}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#1b1410] border border-[#3d2b1f]"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#fef3c7] truncate">
                  {idx + 1}. {rec.recipeName}
                </div>
                <div className="text-xs text-[#cbb08c]">
                  {rec.customerName}
                  {rec.missingCount > 0 ? ` · ${rec.missingCount} ta kam` : ''}
                  {rec.extraCount > 0 ? ` · ${rec.extraCount} ta ortiqcha` : ''}
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-mono-tabular text-sm font-bold shrink-0">
                <Star
                  className={`w-4 h-4 ${
                    rec.score >= 8
                      ? 'text-[#f59e0b] fill-[#f59e0b]'
                      : 'text-[#6e4c32]'
                  }`}
                />
                <span
                  className={
                    rec.score === 10
                      ? 'text-[#10b981]'
                      : rec.score >= 7
                        ? 'text-[#f59e0b]'
                        : 'text-[#ef4444]'
                  }
                >
                  {rec.score}/10
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            data-start="true"
            onClick={onPlayAgain}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#d97706] hover:bg-[#f59e0b] text-[#1b1410] font-bold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yangi smena</span>
          </button>
          <button
            type="button"
            onClick={onGoTitle}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2f2119] hover:bg-[#3d2b20] border border-[#5a3d28] text-[#fef3c7] font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Bosh menyu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
