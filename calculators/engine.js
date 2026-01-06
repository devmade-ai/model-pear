import { models } from '../models/index.js';
import { CONFIG } from '../config/constants.js';
import { calculateMissingInput } from './reverse-calculations.js';

// ========== CALCULATION ENGINE ==========

/**
 * Calculate results for the selected model
 * Simplified for static unit economics (no month-by-month projections)
 * Now supports auto-calculating missing inputs
 */
export function calculateModel(modelKey, calculationMode = 'none', pricingStrategy = 'balanced') {
    const model = models[modelKey];
    const inputs = {};

    // Gather input values
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

    // Calculate missing input if calculation mode is active
    if (calculationMode && calculationMode !== 'none') {
        try {
            const calculatedValue = calculateMissingInput(modelKey, calculationMode, inputs, pricingStrategy);
            inputs[calculationMode] = calculatedValue;

            // Update the UI input field with calculated value
            const calculatedInputId = `${modelKey}-${calculationMode}`;
            const calculatedElement = document.getElementById(calculatedInputId);
            if (calculatedElement) {
                calculatedElement.value = calculatedValue.toFixed(2);
            }

            // Update input styling to show it's calculated
            updateCalculatedFieldStyling(modelKey, calculationMode, true);
        } catch (error) {
            console.error('Error calculating missing input:', error);
        }
    } else {
        // Reset all field styling when in manual mode
        model.inputs.forEach(input => {
            updateCalculatedFieldStyling(modelKey, input.name, false);
        });
    }

    // Run calculation (no longer needs months parameter - static calculation)
    const results = model.calculate(inputs);

    return results;
}

/**
 * Update field styling to show calculated vs manual
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

