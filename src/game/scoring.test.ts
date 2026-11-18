import test from 'node:test';
import assert from 'node:assert/strict';
import { RECIPES, RECIPE_MAP } from './recipes';
import { INGREDIENTS, INGREDIENT_MAP } from './ingredients';
import { evaluateDrink, generateShiftOrders } from './scoring';

test('all 30 Kamolon recipes are loaded and reference valid ingredients', () => {
  assert.equal(RECIPES.length, 30);
  for (const recipe of RECIPES) {
    assert.ok(recipe.ingredients.length > 0, `${recipe.id} should have ingredients`);
    for (const req of recipe.ingredients) {
      assert.ok(
        INGREDIENT_MAP[req.ingredientId],
        `Missing ingredient definition "${req.ingredientId}" in recipe "${recipe.id}"`,
      );
    }
  }
  assert.ok(INGREDIENTS.length >= 55);
});

test('coffee recipes use Single shot espresso (10 gr) and Double shot espresso (18 gr)', () => {
  const americano = RECIPE_MAP['americano'];
  assert.ok(americano.ingredients.some((i) => i.ingredientId === 'double_shot_espresso'));

  const latte = RECIPE_MAP['latte'];
  assert.ok(latte.ingredients.some((i) => i.ingredientId === 'single_shot_espresso'));
  assert.equal(latte.vessel, 'ayirish');

  const frappuccino = RECIPE_MAP['frappuccino'];
  assert.equal(frappuccino.prepMethod, 'blender');
  assert.equal(frappuccino.vessel, 'xarikey');
});

test('evaluateDrink awards 10/10 and bonus points when all ingredients and vessel match', () => {
  const glintveyn = RECIPE_MAP['glintveyn'];
  const result = evaluateDrink({
    recipe: glintveyn,
    selectedIngredientIds: glintveyn.ingredients.map((i) => i.ingredientId),
    selectedVessel: glintveyn.vessel,
    selectedPrep: glintveyn.prepMethod,
  });

  assert.equal(result.score, 10);
  assert.equal(result.isPerfect, true);
  assert.equal(result.missingIngredientIds.length, 0);
  assert.equal(result.extraIngredientIds.length, 0);
  assert.equal(result.pointsEarned, 120);
});

test('evaluateDrink deducts score proportionally when ingredients are missing', () => {
  const glintveyn = RECIPE_MAP['glintveyn']; // 8 ingredients
  const halfIngredients = glintveyn.ingredients
    .slice(0, 4)
    .map((i) => i.ingredientId);

  const result = evaluateDrink({
    recipe: glintveyn,
    selectedIngredientIds: halfIngredients,
    selectedVessel: glintveyn.vessel,
    selectedPrep: glintveyn.prepMethod,
  });

  assert.equal(result.score, 5);
  assert.equal(result.isPerfect, false);
  assert.equal(result.missingIngredientIds.length, 4);
});

test('evaluateDrink penalizes wrong extra ingredients and never gives 10/10 with defects', () => {
  const cappuccino = RECIPE_MAP['cappuccino'];
  const result = evaluateDrink({
    recipe: cappuccino,
    selectedIngredientIds: [
      ...cappuccino.ingredients.map((i) => i.ingredientId),
      'bodring',
      'murch',
    ],
    selectedVessel: cappuccino.vessel,
    selectedPrep: cappuccino.prepMethod,
  });

  assert.ok(result.score < 10);
  assert.equal(result.isPerfect, false);
  assert.deepEqual(result.extraIngredientIds, ['bodring', 'murch']);
});

test('evaluateDrink gives specific Uzbek feedback when Single/Double espresso shot is swapped', () => {
  const flatWhite = RECIPE_MAP['flat_white']; // requires double_shot_espresso
  const result = evaluateDrink({
    recipe: flatWhite,
    selectedIngredientIds: ['single_shot_espresso', 'sut', 'pechenye'],
    selectedVessel: 'standart',
    selectedPrep: 'oddiy',
  });

  assert.ok(result.score < 10);
  assert.ok(
    result.feedbackDetails.some((msg) => msg.includes('Double shot espresso')),
  );
});

test('evaluateDrink checks special vessel and prep method for Frappuccino', () => {
  const frap = RECIPE_MAP['frappuccino'];
  const result = evaluateDrink({
    recipe: frap,
    selectedIngredientIds: frap.ingredients.map((i) => i.ingredientId),
    selectedVessel: 'standart',
    selectedPrep: 'oddiy',
  });

  assert.equal(result.vesselCorrect, false);
  assert.equal(result.prepCorrect, false);
  assert.equal(result.score, 8);
});

test('generateShiftOrders respects category filter', () => {
  const coffeeOrders = generateShiftOrders('qahva', 5);
  assert.equal(coffeeOrders.length, 5);
  assert.ok(coffeeOrders.every((o) => o.recipe.category === 'qahva'));
});
