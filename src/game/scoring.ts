import { getIngredientById } from './ingredients';
import { PREP_METHOD_LABELS, RECIPES, VESSEL_LABELS } from './recipes';
import {
  CustomerProfile,
  DrinkCategoryId,
  DrinkRecipe,
  MasteryMap,
  OrderEvaluation,
  PrepMethodId,
  ShiftOrder,
  VesselId,
} from './types';

export const CUSTOMER_PROFILES: CustomerProfile[] = [
  {
    id: 'aziz',
    name: 'Azizbek',
    role: 'Doimiy mehmon',
    shirtColor: '#2563eb',
    hairColor: '#1e1b18',
    skinTone: '#f3c6a5',
    hatType: 'none',
  },
  {
    id: 'madina',
    name: 'Madina',
    role: 'Dizayner',
    shirtColor: '#be185d',
    hairColor: '#2c1810',
    skinTone: '#f6d2b8',
    hatType: 'beret',
  },
  {
    id: 'rustam',
    name: 'Rustam aka',
    role: 'Tadbirkor',
    shirtColor: '#047857',
    hairColor: '#3f3f46',
    skinTone: '#e8b490',
    hatType: 'doppi',
  },
  {
    id: 'sevara',
    name: 'Sevara',
    role: 'Talaba',
    shirtColor: '#7c3aed',
    hairColor: '#1f1612',
    skinTone: '#f5cfb5',
    hatType: 'none',
  },
  {
    id: 'jasur',
    name: 'Jasur',
    role: 'Dasturchi',
    shirtColor: '#0f766e',
    hairColor: '#18181b',
    skinTone: '#ecc0a1',
    hatType: 'cap',
  },
  {
    id: 'dilnoza',
    name: 'Dilnoza opa',
    role: "Qo'shni do'kondan",
    shirtColor: '#b45309',
    hairColor: '#271911',
    skinTone: '#f2c7a7',
    hatType: 'hijab',
  },
  {
    id: 'bekzod',
    name: 'Bekzod',
    role: 'Sayyoh',
    shirtColor: '#dc2626',
    hairColor: '#451a03',
    skinTone: '#f4cbb0',
    hatType: 'none',
  },
  {
    id: 'gulnora',
    name: 'Gulnora',
    role: 'Shifokor',
    shirtColor: '#0369a1',
    hairColor: '#261a14',
    skinTone: '#f6d4bc',
    hatType: 'none',
  },
];

export interface EvaluateDrinkInput {
  recipe: DrinkRecipe;
  selectedIngredientIds: string[];
  selectedVessel: VesselId;
  selectedPrep: PrepMethodId;
}

export function evaluateDrink({
  recipe,
  selectedIngredientIds,
  selectedVessel,
  selectedPrep,
}: EvaluateDrinkInput): OrderEvaluation {
  const uniqueSelected = Array.from(new Set(selectedIngredientIds));
  const requiredIds = recipe.ingredients.map((i) => i.ingredientId);

  const matchedIngredientIds = requiredIds.filter((id) =>
    uniqueSelected.includes(id),
  );
  const missingIngredientIds = requiredIds.filter(
    (id) => !uniqueSelected.includes(id),
  );
  const extraIngredientIds = uniqueSelected.filter(
    (id) => !requiredIds.includes(id),
  );

  const vesselCorrect = selectedVessel === recipe.vessel;
  const prepCorrect = selectedPrep === recipe.prepMethod;

  if (uniqueSelected.length === 0) {
    return {
      score: 0,
      isPerfect: false,
      matchedIngredientIds: [],
      missingIngredientIds,
      extraIngredientIds: [],
      vesselCorrect,
      prepCorrect,
      feedbackTitle: "Stakan bo'sh!",
      feedbackDetails: [
        "Ichimlik tayyorlash uchun avval kerakli masalliqlarni tanlang.",
      ],
      pointsEarned: 0,
    };
  }

  const totalRequired = requiredIds.length;
  const ratio = totalRequired > 0 ? matchedIngredientIds.length / totalRequired : 0;
  let rawScore = ratio * 10;

  // Penalty for extra wrong ingredients
  rawScore -= extraIngredientIds.length * 1.25;

  // Special vessel / prep method check (for drinks that specify them)
  if (recipe.requiresSpecialVesselOrPrep) {
    if (!vesselCorrect) rawScore -= 1;
    if (!prepCorrect) rawScore -= 1;
  }

  const hasAnyDefect =
    missingIngredientIds.length > 0 ||
    extraIngredientIds.length > 0 ||
    (Boolean(recipe.requiresSpecialVesselOrPrep) && (!vesselCorrect || !prepCorrect));

  let score = Math.max(0, Math.min(10, Math.round(rawScore)));
  if (hasAnyDefect && score === 10) {
    score = 9;
  }

  const isPerfect = score === 10 && !hasAnyDefect;
  const feedbackDetails: string[] = [];

  // Espresso shot swap helper message
  if (
    missingIngredientIds.includes('double_shot_espresso') &&
    extraIngredientIds.includes('single_shot_espresso')
  ) {
    feedbackDetails.push(
      "Bu ichimlikka Single shot (10 gr) emas, Double shot espresso (18 gr) kerak!",
    );
  } else if (
    missingIngredientIds.includes('single_shot_espresso') &&
    extraIngredientIds.includes('double_shot_espresso')
  ) {
    feedbackDetails.push(
      "Bu ichimlikka Double shot (18 gr) emas, Single shot espresso (10 gr) kerak!",
    );
  }

  if (missingIngredientIds.length > 0) {
    const names = missingIngredientIds
      .map((id) => getIngredientById(id)?.shortName ?? id)
      .join(', ');
    feedbackDetails.push(`Yetishmayotgan masalliqlar: ${names}.`);
  }

  if (extraIngredientIds.length > 0) {
    const names = extraIngredientIds
      .map((id) => getIngredientById(id)?.shortName ?? id)
      .join(', ');
    feedbackDetails.push(`Ortiqcha qo'shilgan: ${names}.`);
  }

  if (recipe.requiresSpecialVesselOrPrep) {
    if (!prepCorrect) {
      feedbackDetails.push(
        `Tayyorlash usuli: "${PREP_METHOD_LABELS[recipe.prepMethod]}" bo'lishi kerak.`,
      );
    }
    if (!vesselCorrect) {
      feedbackDetails.push(
        `Berish idishi: "${VESSEL_LABELS[recipe.vessel]}" tanlanishi kerak.`,
      );
    }
  }

  let feedbackTitle = '';
  if (isPerfect) {
    feedbackTitle = "Mukammal! Kamolon standartiga 100% mos!";
    feedbackDetails.push(
      "Barcha masalliqlar va tayyorlash usuli to'g'ri bajarildi.",
    );
  } else if (score >= 8) {
    feedbackTitle = "Yaxshi harakat! Kichik kamchilik bor.";
  } else if (score >= 5) {
    feedbackTitle = "O'rtacha chiqdi, retseptni qayta ko'rib chiqing.";
  } else {
    feedbackTitle = "Buyurtma noto'g'ri tayyorlandi.";
  }

  const pointsEarned = score * 10 + (isPerfect ? 20 : 0);

  return {
    score,
    isPerfect,
    matchedIngredientIds,
    missingIngredientIds,
    extraIngredientIds,
    vesselCorrect,
    prepCorrect,
    feedbackTitle,
    feedbackDetails,
    pointsEarned,
  };
}

export function generateShiftOrders(
  categoryFilter: DrinkCategoryId | 'all',
  count = 6,
  seedOffset = 0,
): ShiftOrder[] {
  const pool =
    categoryFilter === 'all'
      ? RECIPES
      : RECIPES.filter((r) => r.category === categoryFilter);

  const source = pool.length > 0 ? pool : RECIPES;

  // Deterministic-friendly shuffle using Fisher-Yates with Math.random
  const shuffledRecipes = [...source];
  for (let i = shuffledRecipes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledRecipes[i], shuffledRecipes[j]] = [
      shuffledRecipes[j],
      shuffledRecipes[i],
    ];
  }

  const orders: ShiftOrder[] = [];
  for (let idx = 0; idx < count; idx++) {
    const recipe = shuffledRecipes[idx % shuffledRecipes.length];
    const customer =
      CUSTOMER_PROFILES[(idx + seedOffset) % CUSTOMER_PROFILES.length];
    const portionLabel =
      recipe.category === 'limonadlar'
        ? idx % 2 === 0
          ? 'Stakan (0.4L)'
          : 'Grafin (1L)'
        : undefined;

    orders.push({
      orderIndex: idx,
      customer,
      recipe,
      portionLabel,
    });
  }
  return orders;
}

const MASTERY_STORAGE_KEY = 'kamolon_barista_mastery_v1';

export function loadMastery(): MasteryMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(MASTERY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveMastery(
  current: MasteryMap,
  recipeId: string,
  score: number,
): MasteryMap {
  const prev = current[recipeId];
  const next: MasteryMap = {
    ...current,
    [recipeId]: {
      bestScore: prev ? Math.max(prev.bestScore, score) : score,
      attempts: prev ? prev.attempts + 1 : 1,
    },
  };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  }
  return next;
}
