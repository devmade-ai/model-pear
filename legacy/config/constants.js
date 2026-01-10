// ========== CONFIGURATION ==========
export const CONFIG = {
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
    equilibrium: null
};

export function setChartInstance(key, instance) {
    chartInstances[key] = instance;
}
