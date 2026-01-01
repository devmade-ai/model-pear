import { models } from '../models/index.js';
import { CONFIG } from '../config/constants.js';

// ========== CALCULATION ENGINE ==========

/**
 * Calculate results for the selected model
 */
export function calculateModel(modelKey) {
    const model = models[modelKey];
    const inputs = {};

    // Gather input values
    model.inputs.forEach(input => {
        const inputId = `${modelKey}-${input.name}`;
        const element = document.getElementById(inputId);
        if (element) {
            inputs[input.name] = parseFloat(element.value) || input.default || 0;
        } else {
            inputs[input.name] = input.default || 0;
        }
    });

    // Run calculation
    const results = model.calculate(inputs, CONFIG.defaultForecastMonths);

    return results;
}

