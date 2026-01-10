// ========== COMPARISON STORAGE UTILITIES ==========
// Handles localStorage persistence for saved comparisons.
// Provides import/export functionality for sharing comparisons.

// Storage configuration
const STORAGE_KEY = 'model-pear-comparisons';
const MAX_COMPARISONS = 20;  // Prevent localStorage overflow
const STORAGE_VERSION = 1;   // For future migration support

// ========== CORE STORAGE FUNCTIONS ==========

/**
 * Save comparisons array to localStorage
 * @param {Array} comparisons - Array of comparison objects
 * @returns {boolean} - Success status
 */
export function saveToStorage(comparisons) {
    try {
        // Enforce maximum limit
        const trimmedComparisons = comparisons.slice(0, MAX_COMPARISONS);

        const storageData = {
            version: STORAGE_VERSION,
            lastUpdated: Date.now(),
            comparisons: trimmedComparisons
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
        return true;
    } catch (error) {
        console.error('Failed to save comparisons to storage:', error);

        // Handle quota exceeded error
        if (error.name === 'QuotaExceededError' || error.code === 22) {
            console.warn('localStorage quota exceeded. Consider clearing old comparisons.');
        }
        return false;
    }
}

/**
 * Load comparisons from localStorage
 * @returns {Array} - Array of comparison objects (empty if none found)
 */
export function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);

        // Handle versioned storage format
        if (parsed.version && parsed.comparisons) {
            // Future: add migration logic if version changes
            return validateComparisons(parsed.comparisons);
        }

        // Handle legacy format (direct array)
        if (Array.isArray(parsed)) {
            return validateComparisons(parsed);
        }

        return [];
    } catch (error) {
        console.error('Failed to load comparisons from storage:', error);
        return [];
    }
}

/**
 * Clear all saved comparisons from storage
 * @returns {boolean} - Success status
 */
export function clearStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear storage:', error);
        return false;
    }
}

/**
 * Get storage usage information
 * @returns {Object} - Storage usage stats
 */
export function getStorageInfo() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        const sizeBytes = data ? new Blob([data]).size : 0;

        return {
            count: loadFromStorage().length,
            sizeBytes,
            sizeKB: Math.round(sizeBytes / 1024 * 10) / 10,
            maxComparisons: MAX_COMPARISONS,
            available: true
        };
    } catch (error) {
        return {
            count: 0,
            sizeBytes: 0,
            sizeKB: 0,
            maxComparisons: MAX_COMPARISONS,
            available: false,
            error: error.message
        };
    }
}

// ========== EXPORT FUNCTIONS ==========

/**
 * Export all comparisons as JSON string
 * @param {Array} comparisons - Array of comparison objects
 * @returns {string} - JSON string for download
 */
export function exportAsJSON(comparisons) {
    const exportData = {
        exportedAt: new Date().toISOString(),
        version: STORAGE_VERSION,
        tool: 'Model Pear - Inter-Company Transaction Tool',
        comparisons: comparisons
    };

    return JSON.stringify(exportData, null, 2);
}

/**
 * Export comparisons as CSV format
 * @param {Array} comparisons - Array of comparison objects
 * @returns {string} - CSV string for download
 */
export function exportAsCSV(comparisons) {
    if (!comparisons || comparisons.length === 0) {
        return '';
    }

    // Define CSV columns
    const headers = [
        'Name',
        'Model',
        'Variant',
        'Timestamp',
        'Developer Revenue',
        'Developer Profit',
        'Developer Tax',
        'Buyer Cost',
        'Buyer Asset',
        'Buyer Tax Benefit',
        'Transfer Pricing Risk',
        'Notes'
    ];

    const rows = comparisons.map(comp => {
        const dev = comp.results?.developer || {};
        const buyer = comp.results?.buyer || {};
        const tp = comp.results?.transferPricing || {};

        return [
            escapeCSV(comp.name),
            escapeCSV(comp.modelId),
            escapeCSV(comp.variantId),
            new Date(comp.timestamp).toISOString(),
            dev.revenue?.total || 0,
            dev.profit?.gross || 0,
            dev.tax?.taxPayable || 0,
            buyer.totalCost || 0,
            buyer.asset?.capitalised || 0,
            buyer.tax?.taxBenefit || 0,
            tp.riskLevel || 'N/A',
            escapeCSV(comp.notes || '')
        ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
}

/**
 * Generate a summary for PDF/print export
 * @param {Array} comparisons - Array of comparison objects to compare
 * @returns {Object} - Structured comparison data for rendering
 */
export function generateComparisonSummary(comparisons) {
    if (!comparisons || comparisons.length === 0) {
        return null;
    }

    // Extract key metrics from each comparison
    const metrics = comparisons.map(comp => {
        const dev = comp.results?.developer || {};
        const buyer = comp.results?.buyer || {};
        const tp = comp.results?.transferPricing || {};

        return {
            name: comp.name,
            modelId: comp.modelId,
            variantId: comp.variantId,
            timestamp: comp.timestamp,
            developer: {
                revenue: dev.revenue?.total || 0,
                costs: dev.costs?.total || 0,
                profit: dev.profit?.gross || 0,
                margin: dev.profit?.margin || 0,
                taxPayable: dev.tax?.taxPayable || 0,
                netProfit: dev.profit?.net || 0
            },
            buyer: {
                totalCost: buyer.totalCost || 0,
                capitalised: buyer.asset?.capitalised || 0,
                expensed: buyer.asset?.expensed || 0,
                taxBenefit: buyer.tax?.taxBenefit || 0,
                usefulLife: buyer.asset?.usefulLife || 0
            },
            transferPricing: {
                riskLevel: tp.riskLevel || 'N/A',
                method: tp.method || 'N/A',
                margin: tp.margin || 0,
                withinRange: tp.withinRange
            }
        };
    });

    // Calculate differences (if 2+ comparisons)
    const differences = comparisons.length >= 2 ? calculateDifferences(metrics) : null;

    return {
        generated: new Date().toISOString(),
        comparisons: metrics,
        differences,
        count: comparisons.length
    };
}

// ========== IMPORT FUNCTIONS ==========

/**
 * Import comparisons from JSON string
 * @param {string} jsonString - JSON string from exported file
 * @returns {Object} - Result with imported comparisons or error
 */
export function importFromJSON(jsonString) {
    try {
        const data = JSON.parse(jsonString);

        // Handle export format
        if (data.comparisons && Array.isArray(data.comparisons)) {
            const validated = validateComparisons(data.comparisons);
            return {
                success: true,
                comparisons: validated,
                count: validated.length,
                source: data.tool || 'Unknown',
                exportedAt: data.exportedAt
            };
        }

        // Handle direct array
        if (Array.isArray(data)) {
            const validated = validateComparisons(data);
            return {
                success: true,
                comparisons: validated,
                count: validated.length
            };
        }

        return {
            success: false,
            error: 'Invalid import format. Expected comparisons array.'
        };
    } catch (error) {
        return {
            success: false,
            error: `Failed to parse JSON: ${error.message}`
        };
    }
}

/**
 * Merge imported comparisons with existing ones
 * @param {Array} existing - Current comparisons
 * @param {Array} imported - Imported comparisons
 * @param {string} mode - 'merge' | 'replace'
 * @returns {Array} - Merged comparisons array
 */
export function mergeComparisons(existing, imported, mode = 'merge') {
    if (mode === 'replace') {
        return imported.slice(0, MAX_COMPARISONS);
    }

    // Merge mode: add imported, skip duplicates by id
    const existingIds = new Set(existing.map(c => c.id));
    const newComparisons = imported.filter(c => !existingIds.has(c.id));

    // Assign new IDs to imports that have duplicate IDs
    const merged = [
        ...existing,
        ...newComparisons.map(c => ({
            ...c,
            id: existingIds.has(c.id) ? crypto.randomUUID() : c.id,
            importedAt: Date.now()
        }))
    ];

    return merged.slice(0, MAX_COMPARISONS);
}

// ========== VALIDATION HELPERS ==========

/**
 * Validate and sanitize comparison objects
 * @param {Array} comparisons - Raw comparisons array
 * @returns {Array} - Validated comparisons
 */
function validateComparisons(comparisons) {
    if (!Array.isArray(comparisons)) {
        return [];
    }

    return comparisons
        .filter(comp => {
            // Must have required fields
            return comp &&
                   typeof comp === 'object' &&
                   comp.id &&
                   comp.name &&
                   comp.modelId &&
                   comp.results;
        })
        .map(comp => ({
            id: comp.id,
            name: String(comp.name).slice(0, 100),  // Limit name length
            timestamp: comp.timestamp || Date.now(),
            modelId: comp.modelId,
            variantId: comp.variantId || null,
            inputs: comp.inputs || {},
            entityConfig: comp.entityConfig || {},
            taxParams: comp.taxParams || {},
            results: comp.results,
            perspective: comp.perspective || 'developer',
            notes: String(comp.notes || '').slice(0, 500)  // Limit notes length
        }));
}

/**
 * Escape CSV field value
 * @param {string} value - Value to escape
 * @returns {string} - Escaped value
 */
function escapeCSV(value) {
    if (value === null || value === undefined) {
        return '';
    }
    const str = String(value);
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

/**
 * Calculate differences between comparison metrics
 * @param {Array} metrics - Array of metric objects
 * @returns {Object} - Differences object
 */
function calculateDifferences(metrics) {
    if (metrics.length < 2) return null;

    const base = metrics[0];
    const differences = metrics.slice(1).map(comp => ({
        name: comp.name,
        vsBase: base.name,
        developer: {
            revenue: comp.developer.revenue - base.developer.revenue,
            profit: comp.developer.profit - base.developer.profit,
            taxPayable: comp.developer.taxPayable - base.developer.taxPayable
        },
        buyer: {
            totalCost: comp.buyer.totalCost - base.buyer.totalCost,
            capitalised: comp.buyer.capitalised - base.buyer.capitalised,
            taxBenefit: comp.buyer.taxBenefit - base.buyer.taxBenefit
        }
    }));

    return {
        baseName: base.name,
        comparisons: differences
    };
}

// ========== DOWNLOAD HELPERS ==========

/**
 * Trigger browser download of a file
 * @param {string} content - File content
 * @param {string} filename - Download filename
 * @param {string} mimeType - MIME type
 */
export function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Download comparisons as JSON file
 * @param {Array} comparisons - Comparisons to export
 * @param {string} filename - Optional filename
 */
export function downloadAsJSON(comparisons, filename) {
    const json = exportAsJSON(comparisons);
    const defaultName = `model-pear-comparisons-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(json, filename || defaultName, 'application/json');
}

/**
 * Download comparisons as CSV file
 * @param {Array} comparisons - Comparisons to export
 * @param {string} filename - Optional filename
 */
export function downloadAsCSV(comparisons, filename) {
    const csv = exportAsCSV(comparisons);
    const defaultName = `model-pear-comparisons-${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csv, filename || defaultName, 'text/csv');
}

// ========== DEFAULT EXPORT ==========

export default {
    // Core storage
    saveToStorage,
    loadFromStorage,
    clearStorage,
    getStorageInfo,

    // Export
    exportAsJSON,
    exportAsCSV,
    generateComparisonSummary,
    downloadAsJSON,
    downloadAsCSV,
    downloadFile,

    // Import
    importFromJSON,
    mergeComparisons,

    // Constants
    MAX_COMPARISONS,
    STORAGE_KEY
};
