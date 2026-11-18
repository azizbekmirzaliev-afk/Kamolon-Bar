import React from 'react';
import { BookOpen, Play, Sparkles, GraduationCap, Clock } from 'lucide-react';
import { DRINK_CATEGORIES } from '../game/recipes';
import { DrinkCategoryId, GameMode } from '../game/types';

interface TitleScreenProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  selectedCategory: DrinkCategoryId | 'all';
  onCategoryChange: (cat: DrinkCategoryId | 'all') => void;
  onStart: () => void;
  onOpenMenu: () => void;
  masteredCount: number;
  totalRecipes: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  mode,
  onModeChange,
  selectedCategory,
  onCategoryChange,
  onStart,
  onOpenMenu,
  masteredCount,
  totalRecipes,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-3 sm:px-4 py-5 sm:py-8 bg-[#1b1410] text-[#f7efe4]">
      <div className="w-full max-w-4xl border border-[#5a3d28] bg-[#241a14] rounded-2xl p-5 md:p-10 shadow-2xl">
        {/* Custom Inline SVG Kamolon Crest Lockup */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <svg
            width="280"
            height="86"
            viewBox="0 0 280 86"
            className="mb-2 sm:mb-3 w-56 sm:w-[280px] h-auto"
            aria-label="Kamolon Barista Gerbi"
          >
            <path
              d="M24 44 L44 26 L236 26 L256 44 L236 62 L44 62 Z"
              fill="#2f2017"
              stroke="#d97706"
              strokeWidth="2"
            />
            <path
              d="M36 44 L48 33 H232 L244 44 L232 55 H48 Z"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <circle cx="140" cy="14" r="9" fill="#d97706" />
            <path d="M134 14 Q140 7 146 14 Q140 21 134 14 Z" fill="#fef3c7" />
            <text
              x="140"
              y="49"
              textAnchor="middle"
              fontFamily="Fraunces, Georgia, serif"
              fontSize="24"
              fontWeight="700"
              letterSpacing="4"
              fill="#fef3c7"
            >
              KAMOLON
            </text>
            <text
              x="140"
              y="77"
              textAnchor="middle"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontSize="11"
              fontWeight="600"
              letterSpacing="2"
              fill="#d6b995"
            >
              BARISTA AKADEMIYASI
            </text>
          </svg>

          <h1 className="font-display text-2xl md:text-4xl font-bold text-[#fef3c7] max-w-xl">
            Kamolon ichimliklarini to‘g‘ri retsept bilan tayyorlang
          </h1>
          <p className="mt-2 text-xs sm:text-base text-[#d6b995] max-w-2xl">
            Mijozlar buyurtma beradi — siz esa barista sifatida kerakli masalliqlarni tanlab,
            10 ballik bahoga sazovor bo‘ling.
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#cbb08c] tabular-nums">
            <span>{totalRecipes} ta rasmiy retsept</span>
            <span aria-hidden="true">·</span>
            <span>7 ta masalliq bo‘limi</span>
            <span aria-hidden="true">·</span>
            <span>
              O‘zlashtirilgan: {masteredCount} / {totalRecipes}
            </span>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <button
            type="button"
            onClick={() => onModeChange('training')}
            className={`min-h-[44px] text-left p-3.5 sm:p-4 rounded-xl border transition-colors cursor-pointer ${
              mode === 'training'
                ? 'bg-[#362519] border-[#f59e0b] text-[#fef3c7]'
                : 'bg-[#1e1510] border-[#4a3222] text-[#cbb08c] hover:border-[#8c623d]'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm sm:text-base mb-1">
              <GraduationCap className="w-5 h-5 text-[#f59e0b] shrink-0" />
              <span>O‘quv rejimi (Yordamchi bilan)</span>
            </div>
            <p className="text-xs text-[#cbb08c]">
              Retsept yordamchisini ko‘rib, yangi baristalar uchun barcha masalliq va grammlarni
              oson o‘rganish rejimi.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('shift')}
            className={`min-h-[44px] text-left p-3.5 sm:p-4 rounded-xl border transition-colors cursor-pointer ${
              mode === 'shift'
                ? 'bg-[#362519] border-[#f59e0b] text-[#fef3c7]'
                : 'bg-[#1e1510] border-[#4a3222] text-[#cbb08c] hover:border-[#8c623d]'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm sm:text-base mb-1">
              <Clock className="w-5 h-5 text-[#f59e0b] shrink-0" />
              <span>Smena rejimi (Imtihon)</span>
            </div>
            <p className="text-xs text-[#cbb08c]">
              Retsept yashirilgan! Xotira va tezlikka tayanib 6 ta mijozga xizmat ko‘rsating va eng
              yuqori ball yig‘ing.
            </p>
          </button>
        </div>

        {/* Category Practice Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="text-xs font-medium text-[#cbb08c] mb-2">
            Mashq qilinadigan bo‘limni tanlang:
          </div>
          <div className="flex sm:flex-wrap gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => onCategoryChange('all')}
              className={`min-h-[42px] sm:min-h-0 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#d97706] border-[#f59e0b] text-[#1b1410]'
                  : 'bg-[#1e1510] border-[#4a3222] text-[#e7d8c3] hover:border-[#8c623d]'
              }`}
            >
              Barcha ichimliklar (30)
            </button>
            {DRINK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`min-h-[42px] sm:min-h-0 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#d97706] border-[#f59e0b] text-[#1b1410]'
                    : 'bg-[#1e1510] border-[#4a3222] text-[#e7d8c3] hover:border-[#8c623d]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            data-start="true"
            onClick={onStart}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#d97706] hover:bg-[#f59e0b] text-[#1b1410] font-bold text-base transition-colors whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Smenani boshlash</span>
          </button>

          <button
            type="button"
            onClick={onOpenMenu}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2f2119] hover:bg-[#3d2b20] border border-[#6e4c32] text-[#fef3c7] font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4 text-[#f59e0b]" />
            <span>Menyu va retseptlar</span>
          </button>
        </div>

        {/* Clean single-line control hint (desktop) */}
        <div className="hidden sm:flex mt-6 pt-4 border-t border-[#3f2c1f] flex-wrap items-center justify-center gap-4 text-xs text-[#a88b68]">
          <span>A / D yoki ← / → Barista harakati</span>
          <span aria-hidden="true">·</span>
          <span>Enter / Space Boshlash va Berish</span>
          <span aria-hidden="true">·</span>
          <span>M Menyu</span>
          <span aria-hidden="true">·</span>
          <span>Esc / P Pauza</span>
        </div>
      </div>
    </div>
  );
};
