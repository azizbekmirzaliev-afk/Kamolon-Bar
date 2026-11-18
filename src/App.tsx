import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Home,
  Send,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { IngredientPantry } from './components/IngredientPantry';
import { KamolonCanvas } from './components/KamolonCanvas';
import { OrderPanel } from './components/OrderPanel';
import { RecipeBookModal } from './components/RecipeBookModal';
import { ShiftSummaryModal } from './components/ShiftSummaryModal';
import { TitleScreen } from './components/TitleScreen';
import { soundEngine } from './game/audio';
import { CATEGORY_MAP } from './game/ingredients';
import { RECIPES } from './game/recipes';
import {
  evaluateDrink,
  generateShiftOrders,
  loadMastery,
  saveMastery,
} from './game/scoring';
import {
  CompletedOrderRecord,
  DrinkCategoryId,
  GameMode,
  GameScreenState,
  IngredientCategoryId,
  MasteryMap,
  OrderEvaluation,
  PrepMethodId,
  ShiftOrder,
  VesselId,
} from './game/types';

const SHIFT_ORDER_COUNT = 6;

export default function App() {
  const [gameState, setGameState] = useState<GameScreenState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return 'playing';
    }
    return 'title';
  });

  const [mode, setMode] = useState<GameMode>('training');
  const [selectedCategory, setSelectedCategory] = useState<
    DrinkCategoryId | 'all'
  >('all');
  const [orders, setOrders] = useState<ShiftOrder[]>(() =>
    generateShiftOrders('all', SHIFT_ORDER_COUNT, 0),
  );
  const [orderIndex, setOrderIndex] = useState(0);

  const [activeIngredientCat, setActiveIngredientCat] =
    useState<IngredientCategoryId>('qahva_sut');
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>(
    [],
  );
  const [selectedVessel, setSelectedVessel] = useState<VesselId>('standart');
  const [selectedPrep, setSelectedPrep] = useState<PrepMethodId>('oddiy');
  const [evaluation, setEvaluation] = useState<OrderEvaluation | null>(null);

  const [completedRecords, setCompletedRecords] = useState<
    CompletedOrderRecord[]
  >([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [mastery, setMastery] = useState<MasteryMap>(() => loadMastery());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [actionPulseKey, setActionPulseKey] = useState(0);

  // Sync game state to document.body.dataset.state
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  const currentOrder = orders[orderIndex] ?? orders[0];

  const targetStationX = useMemo(() => {
    if (evaluation) return 0.50; // Walk to center serving counter when evaluated
    return CATEGORY_MAP[activeIngredientCat]?.stationX ?? 0.45;
  }, [activeIngredientCat, evaluation]);

  const masteredCount = useMemo(
    () =>
      Object.values(mastery).filter((m) => m.bestScore === 10).length,
    [mastery],
  );

  const avgScore = useMemo(() => {
    if (completedRecords.length === 0) return '—';
    const sum = completedRecords.reduce((acc, r) => acc + r.score, 0);
    return `${(sum / completedRecords.length).toFixed(1)}/10`;
  }, [completedRecords]);

  const startNewShift = useCallback(
    (overrideCategory?: DrinkCategoryId | 'all') => {
      const cat = overrideCategory ?? selectedCategory;
      const newOrders = generateShiftOrders(
        cat,
        SHIFT_ORDER_COUNT,
        Math.floor(Math.random() * 8),
      );
      setOrders(newOrders);
      setOrderIndex(0);
      setSelectedIngredientIds([]);
      setSelectedVessel('standart');
      setSelectedPrep('oddiy');
      setEvaluation(null);
      setCompletedRecords([]);
      setTotalPoints(0);
      setGameState('playing');
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    },
    [selectedCategory],
  );

  const handleToggleIngredient = useCallback(
    (ingredientId: string) => {
      if (evaluation || gameState !== 'playing') return;
      setSelectedIngredientIds((prev) => {
        const exists = prev.includes(ingredientId);
        if (exists) {
          soundEngine.playRemove();
          return prev.filter((id) => id !== ingredientId);
        }
        soundEngine.playIngredientAdd(activeIngredientCat);
        setActionPulseKey((k) => k + 1);
        return [...prev, ingredientId];
      });
    },
    [evaluation, gameState, activeIngredientCat],
  );

  const handleRemoveIngredient = useCallback(
    (ingredientId: string) => {
      if (evaluation) return;
      soundEngine.playRemove();
      setSelectedIngredientIds((prev) =>
        prev.filter((id) => id !== ingredientId),
      );
    },
    [evaluation],
  );

  const handleClearCup = useCallback(() => {
    if (evaluation) return;
    soundEngine.playRemove();
    setSelectedIngredientIds([]);
    setSelectedVessel('standart');
    setSelectedPrep('oddiy');
  }, [evaluation]);

  const handleServe = useCallback(() => {
    if (!currentOrder || evaluation || selectedIngredientIds.length === 0) {
      return;
    }
    const res = evaluateDrink({
      recipe: currentOrder.recipe,
      selectedIngredientIds,
      selectedVessel,
      selectedPrep,
    });
    soundEngine.playServeResult(res.score);
    setActionPulseKey((k) => k + 1);
    setEvaluation(res);
    setTotalPoints((prev) => prev + res.pointsEarned);
    setCompletedRecords((prev) => [
      ...prev,
      {
        recipeId: currentOrder.recipe.id,
        recipeName: currentOrder.recipe.name,
        category: currentOrder.recipe.category,
        customerName: currentOrder.customer.name,
        score: res.score,
        pointsEarned: res.pointsEarned,
        missingCount: res.missingIngredientIds.length,
        extraCount: res.extraIngredientIds.length,
      },
    ]);
    setMastery((prev) => saveMastery(prev, currentOrder.recipe.id, res.score));
  }, [
    currentOrder,
    evaluation,
    selectedIngredientIds,
    selectedVessel,
    selectedPrep,
  ]);

  const handleNextOrder = useCallback(() => {
    if (orderIndex + 1 >= orders.length) {
      setGameState('gameover');
      return;
    }
    setOrderIndex((idx) => idx + 1);
    setSelectedIngredientIds([]);
    setSelectedVessel('standart');
    setSelectedPrep('oddiy');
    setEvaluation(null);
  }, [orderIndex, orders.length]);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundEngine.muted = next;
      return next;
    });
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName ?? '';
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      if (isMenuOpen) {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'm') {
          e.preventDefault();
          setIsMenuOpen(false);
        }
        return;
      }

      if (gameState === 'title') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startNewShift();
        } else if (e.key.toLowerCase() === 'm') {
          e.preventDefault();
          setIsMenuOpen(true);
        }
        return;
      }

      if (gameState === 'playing') {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
          e.preventDefault();
          setGameState('paused');
        } else if (e.key.toLowerCase() === 'm') {
          e.preventDefault();
          setIsMenuOpen(true);
        } else if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          startNewShift();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (evaluation) {
            handleNextOrder();
          } else if (selectedIngredientIds.length > 0) {
            handleServe();
          }
        }
        return;
      }

      if (gameState === 'paused') {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
          e.preventDefault();
          setGameState('playing');
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    gameState,
    isMenuOpen,
    evaluation,
    selectedIngredientIds.length,
    startNewShift,
    handleServe,
    handleNextOrder,
  ]);

  if (gameState === 'title') {
    return (
      <>
        <TitleScreen
          mode={mode}
          onModeChange={setMode}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onStart={() => startNewShift()}
          onOpenMenu={() => setIsMenuOpen(true)}
          masteredCount={masteredCount}
          totalRecipes={RECIPES.length}
        />
        <RecipeBookModal
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          mastery={mastery}
        />
      </>
    );
  }

  if (gameState === 'gameover') {
    return (
      <>
        <ShiftSummaryModal
          records={completedRecords}
          totalPoints={totalPoints}
          onPlayAgain={() => startNewShift()}
          onGoTitle={() => setGameState('title')}
        />
        <RecipeBookModal
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          mastery={mastery}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#1b1410] text-[#f7efe4] flex flex-col">
      {/* World-Matched Compact Game HUD Bar */}
      <div className="w-full border-b border-[#4a3222] bg-[#241a14] px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <span className="font-display text-base sm:text-lg font-bold tracking-wide text-[#fef3c7] whitespace-nowrap shrink-0">
              KAMOLON
            </span>
            <span className="hidden sm:inline text-xs text-[#cbb08c] whitespace-nowrap">
              {mode === 'training' ? 'O‘quv rejimi' : 'Smena rejimi'}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm tabular-nums">
            <div className="whitespace-nowrap">
              <span className="hidden sm:inline text-[#a88b68] mr-1.5">Buyurtma:</span>
              <span className="font-mono-tabular font-bold text-[#fef3c7]">
                {orderIndex + 1}/{orders.length}
              </span>
            </div>
            <div className="hidden sm:block whitespace-nowrap">
              <span className="text-[#a88b68] mr-1.5">O‘rtacha:</span>
              <span className="font-mono-tabular font-bold text-[#f59e0b]">
                {avgScore}
              </span>
            </div>
            <div className="whitespace-nowrap">
              <span className="text-[#a88b68] mr-1">Ball:</span>
              <span className="font-mono-tabular font-bold text-[#10b981]">
                {totalPoints}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Menyu va retseptlar"
              className="min-h-[42px] sm:min-h-0 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#2f2119] hover:bg-[#3d2b20] border border-[#5a3d28] text-xs font-semibold text-[#fef3c7] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#f59e0b]" />
              <span className="hidden sm:inline">Menyu [M]</span>
              <span className="sm:hidden">Menyu</span>
            </button>

            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                handleToggleMute();
              }}
              aria-label={muted ? 'Ovozni yoqish' : "Ovozni o'chirish"}
              className="min-h-[42px] min-w-[42px] sm:min-h-0 sm:min-w-0 flex items-center justify-center p-2 rounded-lg bg-[#2f2119] hover:bg-[#3d2b20] border border-[#5a3d28] text-[#fef3c7] cursor-pointer"
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-[#fca5a5]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#f59e0b]" />
              )}
            </button>

            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                setGameState((s) => (s === 'paused' ? 'playing' : 'paused'));
              }}
              aria-label="Pauza [P]"
              className="min-h-[42px] min-w-[42px] sm:min-h-0 sm:min-w-0 flex items-center justify-center p-2 rounded-lg bg-[#2f2119] hover:bg-[#3d2b20] border border-[#5a3d28] text-[#fef3c7] cursor-pointer"
            >
              <Pause className="w-4 h-4" />
            </button>

            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                startNewShift();
              }}
              aria-label="Qayta boshlash [R]"
              className="hidden sm:flex items-center justify-center p-2 rounded-lg bg-[#2f2119] hover:bg-[#3d2b20] border border-[#5a3d28] text-[#fef3c7] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar Workspace (bottom padding reserves space for mobile sticky thumb bar) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 pt-3 pb-24 lg:py-4 flex flex-col gap-3 sm:gap-4">
        <KamolonCanvas
          gameState={gameState}
          targetStationX={targetStationX}
          customer={currentOrder?.customer ?? null}
          drinkName={currentOrder?.recipe.name}
          addedIngredientIds={selectedIngredientIds}
          selectedVessel={selectedVessel}
          lastEvaluation={evaluation}
          actionPulseKey={actionPulseKey}
        />

        {currentOrder && (
          <OrderPanel
            order={currentOrder}
            mode={mode}
            selectedIngredientIds={selectedIngredientIds}
            onRemoveIngredient={handleRemoveIngredient}
            onClearCup={handleClearCup}
            selectedVessel={selectedVessel}
            onSelectVessel={setSelectedVessel}
            selectedPrep={selectedPrep}
            onSelectPrep={setSelectedPrep}
            onServe={handleServe}
            evaluation={evaluation}
            onNextOrder={handleNextOrder}
            isLastOrder={orderIndex + 1 >= orders.length}
          />
        )}

        <IngredientPantry
          activeCategory={activeIngredientCat}
          onSelectCategory={setActiveIngredientCat}
          selectedIngredientIds={selectedIngredientIds}
          onToggleIngredient={handleToggleIngredient}
          disabled={Boolean(evaluation) || gameState !== 'playing'}
        />
      </main>

      {/* Mobile Sticky Bottom Thumb-Zone Action Bar (< lg, <= 64px height) */}
      {currentOrder && !isMenuOpen && gameState === 'playing' && (
        <div
          data-testid="mobile-thumb-bar"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[#5a3d28] bg-[#1e1510]/95 px-3 py-2.5"
        >
          {evaluation ? (
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs tabular-nums">
                <span className="text-[#cbb08c]">Baho: </span>
                <span className="font-mono-tabular font-bold text-[#f59e0b]">
                  {evaluation.score}/10
                </span>
              </div>
              <button
                type="button"
                onClick={handleNextOrder}
                className="flex-1 max-w-[230px] h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-[#d97706] active:scale-[0.98] text-[#1b1410] font-bold text-sm transition-transform whitespace-nowrap cursor-pointer"
              >
                <span>
                  {orderIndex + 1 >= orders.length
                    ? 'Smena natijasi'
                    : 'Keyingi mijoz'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2.5">
              {selectedIngredientIds.length > 0 ? (
                <button
                  type="button"
                  onClick={handleClearCup}
                  aria-label="Stakanni tozalash"
                  className="h-11 px-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2f2119] border border-[#5a3d28] text-xs font-semibold text-[#fca5a5] whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{selectedIngredientIds.length} ta</span>
                </button>
              ) : (
                <div className="text-xs text-[#cbb08c] truncate">
                  {currentOrder.recipe.name}
                </div>
              )}

              <button
                type="button"
                onClick={handleServe}
                disabled={selectedIngredientIds.length === 0}
                className="flex-1 max-w-[230px] h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-[#d97706] active:scale-[0.98] disabled:bg-[#3f2c1f] disabled:text-[#8c7355] text-[#1b1410] font-bold text-sm transition-transform whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>Mijozga berish</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pause Modal */}
      {gameState === 'paused' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-title"
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75"
        >
          <div className="w-full max-w-sm rounded-2xl border border-[#6e4c32] bg-[#241a14] p-6 text-center shadow-2xl">
            <h2
              id="pause-title"
              className="font-display text-2xl font-bold text-[#fef3c7] mb-1"
            >
              Tanaffus (Pauza)
            </h2>
            <p className="text-xs text-[#cbb08c] mb-5">
              Buyurtma {orderIndex + 1} / {orders.length} · Umumiy ball: {totalPoints}
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setGameState('playing')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#f59e0b] text-[#1b1410] font-bold text-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Davom etish</span>
              </button>
              <button
                type="button"
                onClick={() => startNewShift()}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2f2119] hover:bg-[#3d2b20] border border-[#5a3d28] text-[#fef3c7] font-semibold text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qayta boshlash</span>
              </button>
              <button
                type="button"
                onClick={() => setGameState('title')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b1410] hover:bg-[#2f2119] border border-[#4a3222] text-[#cbb08c] font-semibold text-sm cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Bosh menyuga chiqish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <RecipeBookModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        mastery={mastery}
      />
    </div>
  );
}
