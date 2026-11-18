export type GameScreenState = 'title' | 'playing' | 'paused' | 'gameover';

export type GameMode = 'training' | 'shift';

export type DrinkCategoryId =
  | 'olib_ketishga_choylar'
  | 'detokslar'
  | 'limonadlar'
  | 'maxsus_choylar'
  | 'qahva';

export type IngredientCategoryId =
  | 'qahva_sut'
  | 'choy_suv'
  | 'meva_kokat'
  | 'siroplar'
  | 'pyurelar'
  | 'sharbatlar'
  | 'ziravorlar';

export type VesselId =
  | 'standart'
  | 'ayirish'
  | 'xaybol'
  | 'xarikey';

export type PrepMethodId =
  | 'oddiy'
  | 'sheyker'
  | 'blender';

export interface IngredientCategoryMeta {
  id: IngredientCategoryId;
  label: string;
  shortLabel: string;
  stationX: number; // 0..1 normalized position along bar counter
  accentHex: string;
}

export interface Ingredient {
  id: string;
  name: string;
  shortName: string;
  category: IngredientCategoryId;
  color: string;
  note?: string;
}

export interface RecipeIngredientRequirement {
  ingredientId: string;
  amount: string; // e.g. "200 ml" or "45 ml / 90 ml"
}

export interface DrinkRecipe {
  id: string;
  name: string;
  category: DrinkCategoryId;
  ingredients: RecipeIngredientRequirement[];
  vessel: VesselId;
  prepMethod: PrepMethodId;
  requiresSpecialVesselOrPrep?: boolean;
  volumeNote?: string;
  servingNote?: string;
  accentColor: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  role: string;
  shirtColor: string;
  hairColor: string;
  skinTone: string;
  hatType: 'none' | 'doppi' | 'cap' | 'hijab' | 'beret';
}

export interface ShiftOrder {
  orderIndex: number;
  customer: CustomerProfile;
  recipe: DrinkRecipe;
  portionLabel?: 'Stakan (0.4L)' | 'Grafin (1L)';
}

export interface OrderEvaluation {
  score: number; // 0 to 10 integer
  isPerfect: boolean;
  matchedIngredientIds: string[];
  missingIngredientIds: string[];
  extraIngredientIds: string[];
  vesselCorrect: boolean;
  prepCorrect: boolean;
  feedbackTitle: string;
  feedbackDetails: string[];
  pointsEarned: number;
}

export interface CompletedOrderRecord {
  recipeId: string;
  recipeName: string;
  category: DrinkCategoryId;
  customerName: string;
  score: number;
  pointsEarned: number;
  missingCount: number;
  extraCount: number;
}

export interface MasteryMap {
  [recipeId: string]: {
    bestScore: number;
    attempts: number;
  };
}
