import { models } from '../models/index.js';
import { CONFIG } from '../config/constants.js';
import { calculateMissingInput } from './reverse-calculations.js';

// ========== CALCULATION ENGINE ==========
// This engine bridges user inputs with model calculations, handling both
// manual entry and auto-calculation modes.

// Track previous calculation mode per model so we can unlock the old field
// when the user switches to calculating a different field
const previousCalculationModes = {};

/**
 * Calculate results for the selected model
 *
 * Why static unit economics (no projections)?
 * - If pricing doesn't work at the unit level, growth projections are meaningless
 * - Simpler UI keeps focus on the equilibrium question
 * - Users can always add complexity later
 */
export function calculateModel(modelKey, calculationMode = 'none', pricingStrategy = 'balanced') {
    const model = models[modelKey];
    const inputs = {};

    // Gather input values from the form
    // We need to handle text vs numeric inputs differently because parseFloat
    // on text returns NaN, which breaks calculations
    model.inputs.forEach(input => {
        const inputId = `${modelKey}-${input.name}`;
        const element = document.getElementById(inputId);
        if (element) {
            // Handle text inputs differently from numeric inputs
            if (input.type === 'text') {
                inputs[input.name] = element.value || input.default || '';
            } else {
                inputs[input.name] = parseFloat(element.value) || input.default || 0;
            }
        } else {
            inputs[input.name] = input.default || 0;
        }
    });

    // Auto-calculate a missing input if the user selected a calculation mode
    // This lets users say "I know my costs and buyer value, calculate my price"
    if (calculationMode && calculationMode !== 'none') {
        try {
            // When switching from calculating price to calculating margin,
            // we need to unlock the price field so it becomes editable again
            const previousMode = previousCalculationModes[modelKey];
            if (previousMode && previousMode !== 'none' && previousMode !== calculationMode) {
                updateCalculatedFieldStyling(modelKey, previousMode, false);
            }

            const calculatedValue = calculateMissingInput(modelKey, calculationMode, inputs, pricingStrategy);
            inputs[calculationMode] = calculatedValue;

            // Show the calculated value in the form field so user sees the result
            const calculatedInputId = `${modelKey}-${calculationMode}`;
            const calculatedElement = document.getElementById(calculatedInputId);
            if (calculatedElement) {
                calculatedElement.value = calculatedValue.toFixed(2);
            }

            // Lock the field visually - users shouldn't edit a calculated value
            // (changing it would make the calculation inconsistent)
            updateCalculatedFieldStyling(modelKey, calculationMode, true);

            // Remember this mode so we can unlock the field if user switches modes
            previousCalculationModes[modelKey] = calculationMode;
        } catch (error) {
            console.error('Error calculating missing input:', error);
        }
    } else {
        // User switched to "Enter All Inputs Manually" - unlock all fields
        // so they can edit everything freely
        model.inputs.forEach(input => {
            updateCalculatedFieldStyling(modelKey, input.name, false);
        });
        previousCalculationModes[modelKey] = 'none';
    }

    // Run the model's calculation function to get equilibrium analysis
    const results = model.calculate(inputs);

    return results;
}

/**
 * Visually distinguish auto-calculated fields from user-editable ones
 *
 * Why lock calculated fields?
 * - Prevents confusion: editing a calculated value breaks the math
 * - Clear visual feedback: yellow background = "this was computed for you"
 */
function updateCalculatedFieldStyling(modelKey, fieldName, isCalculated) {
    const inputId = `${modelKey}-${fieldName}`;
    const element = document.getElementById(inputId);
    if (!element) return;

    const label = element.previousElementSibling;

    if (isCalculated) {
        element.classList.add('bg-yellow-900/20', 'border-yellow-600');
        element.classList.remove('border-gray-600');
        element.readOnly = true;

        // Update label
        if (label && !label.querySelector('.auto-calc-badge')) {
            const badge = document.createElement('span');
            badge.className = 'ml-2 text-xs px-2 py-0.5 bg-yellow-600 rounded auto-calc-badge';
            badge.textContent = 'Auto-calculated';
            label.appendChild(badge);
        }
    } else {
        element.classList.remove('bg-yellow-900/20', 'border-yellow-600');
        element.classList.add('border-gray-600');
        element.readOnly = false;

        // Remove badge from label
        if (label) {
            const badge = label.querySelector('.auto-calc-badge');
            if (badge) {
                badge.remove();
            }
        }
    }
}

