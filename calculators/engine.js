import { models } from '../models/index.js';
import { CONFIG } from '../config/constants.js';

// ========== CALCULATION ENGINE ==========

/**
 * Calculate results for the selected model
 * Simplified for static unit economics (no month-by-month projections)
 */
export function calculateModel(modelKey) {
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

    // Run calculation (no longer needs months parameter - static calculation)
    const results = model.calculate(inputs);

    return results;
}

