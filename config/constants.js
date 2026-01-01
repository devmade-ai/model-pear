// ========== CONFIGURATION ==========
export const CONFIG = {
    defaultForecastMonths: 24,
    maxForecastMonths: 36,
    debounceDelay: 300,
    chartColors: {
        primary: '#3B82F6',
        positive: '#10B981',
        moderate: '#F59E0B',
        negative: '#EF4444',
        secondary: '#6B7280'
    }
};

// ========== GLOBAL STATE ==========
// Store chart instances for cleanup
export let chartInstances = {
    primary: null,
    secondary1: null,
    secondary2: null,
    raceChart: null
};

// Store selected models for comparison
export let selectedModels = new Set();

// Store input values to preserve them when selection changes
export let storedInputValues = new Map();

// Calculator mode: 'forward', 'reverse', 'client-budget', or 'admin'
export let currentMode = 'forward';

// Reverse calculator state
export let reverseCalculatorState = {
    targetRevenue: 0,
    targetMonth: 24,
    solveForVariable: '',
    constraints: {},
    generateScenarios: true
};

// Client budget calculator state
export let clientBudgetState = {
    budget: 10000,
    flexibility: 'moderate',
    priority: 'max-users',
    requirements: {},
    showMultipleOptions: true
};

// Setters for state management
export function setCurrentMode(mode) {
    currentMode = mode;
}

export function setChartInstance(key, instance) {
    chartInstances[key] = instance;
}

export function addSelectedModel(model) {
    selectedModels.add(model);
}

export function removeSelectedModel(model) {
    selectedModels.delete(model);
}

export function clearSelectedModels() {
    selectedModels.clear();
}

export function setStoredInputValue(key, value) {
    storedInputValues.set(key, value);
}

export function updateReverseCalculatorState(updates) {
    Object.assign(reverseCalculatorState, updates);
}

export function updateClientBudgetState(updates) {
    Object.assign(clientBudgetState, updates);
}
