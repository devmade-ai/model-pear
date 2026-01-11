/**
 * Tests for sensitivity analysis calculations
 *
 * These tests verify range creation, scenario generation,
 * sensitivity analysis, and Monte Carlo simulation.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  createRange,
  createInputRanges,
  generateBestCaseInputs,
  generateWorstCaseInputs,
  generateBaseCaseInputs,
  calculateInputSensitivity,
  findBreakEvenValue,
  triangularRandom,
  generateRandomInputs,
  calculateStatistics,
  calculatePercentiles,
  createHistogram,
  runMonteCarloSimulation,
  formatCurrency,
  formatPercentage,
  RANGE_CONFIGS,
} from '../../src/sensitivity/calculations.js';

// ============================================================
// RANGE CREATION
// ============================================================

describe('Range Creation', () => {
  describe('createRange', () => {
    it('creates range using default variance for known inputs', () => {
      const range = createRange('developmentCost', 1_000_000);

      expect(range.base).toBe(1_000_000);
      expect(range.low).toBe(800_000); // 20% variance
      expect(range.high).toBe(1_200_000);
      expect(range.variance).toBe(0.2);
      expect(range.label).toBe('Development Cost');
      expect(range.category).toBe('cost');
    });

    it('creates range with custom variance', () => {
      const range = createRange('developmentCost', 1_000_000, { variance: 0.3 });

      expect(range.low).toBe(700_000);
      expect(range.high).toBe(1_300_000);
    });

    it('creates range with custom low/high values', () => {
      const range = createRange('developmentCost', 1_000_000, {
        low: 500_000,
        high: 2_000_000,
      });

      expect(range.low).toBe(500_000);
      expect(range.high).toBe(2_000_000);
    });

    it('clamps percentage values to 0-100', () => {
      const range = createRange('markupPercentage', 10);

      expect(range.low).toBeGreaterThanOrEqual(0);
      expect(range.high).toBeLessThanOrEqual(100);
    });

    it('rounds integer values appropriately', () => {
      const range = createRange('usefulLife', 5);

      expect(Number.isInteger(range.low)).toBe(true);
      expect(Number.isInteger(range.high)).toBe(true);
      expect(range.low).toBeGreaterThanOrEqual(1);
    });

    it('uses default 20% variance for unknown inputs', () => {
      const range = createRange('unknownInput', 1000);

      expect(range.variance).toBe(0.2);
      expect(range.low).toBe(800);
      expect(range.high).toBe(1200);
    });
  });

  describe('createInputRanges', () => {
    it('creates ranges for all numeric inputs with configs', () => {
      const inputs = {
        developmentCost: 1_000_000,
        markupPercentage: 15,
        projectName: 'Test Project', // Non-numeric, should be skipped
        usefulLife: 5,
      };

      const ranges = createInputRanges(inputs);

      expect(ranges.developmentCost).toBeDefined();
      expect(ranges.markupPercentage).toBeDefined();
      expect(ranges.usefulLife).toBeDefined();
      expect(ranges.projectName).toBeUndefined();
    });

    it('skips inputs without range configs', () => {
      const inputs = {
        unknownField: 1000,
        developmentCost: 500_000,
      };

      const ranges = createInputRanges(inputs);

      expect(ranges.unknownField).toBeUndefined();
      expect(ranges.developmentCost).toBeDefined();
    });
  });
});

// ============================================================
// SCENARIO GENERATION
// ============================================================

describe('Scenario Generation', () => {
  const ranges = {
    developmentCost: { low: 800_000, base: 1_000_000, high: 1_200_000, variance: 0.2, inputName: 'developmentCost', label: 'Dev Cost', category: 'cost' as const },
    salePrice: { low: 1_500_000, base: 2_000_000, high: 2_500_000, variance: 0.25, inputName: 'salePrice', label: 'Sale Price', category: 'revenue' as const },
    usefulLife: { low: 3, base: 5, high: 7, variance: 0.4, inputName: 'usefulLife', label: 'Useful Life', category: 'duration' as const },
  };

  describe('generateBestCaseInputs', () => {
    it('uses low costs and high revenues', () => {
      const inputs = generateBestCaseInputs(ranges);

      expect(inputs.developmentCost).toBe(800_000); // Low cost
      expect(inputs.salePrice).toBe(2_500_000); // High revenue
      expect(inputs.usefulLife).toBe(5); // Base for duration
    });
  });

  describe('generateWorstCaseInputs', () => {
    it('uses high costs and low revenues', () => {
      const inputs = generateWorstCaseInputs(ranges);

      expect(inputs.developmentCost).toBe(1_200_000); // High cost
      expect(inputs.salePrice).toBe(1_500_000); // Low revenue
      expect(inputs.usefulLife).toBe(5); // Base for duration
    });
  });

  describe('generateBaseCaseInputs', () => {
    it('uses base values for all inputs', () => {
      const inputs = generateBaseCaseInputs(ranges);

      expect(inputs.developmentCost).toBe(1_000_000);
      expect(inputs.salePrice).toBe(2_000_000);
      expect(inputs.usefulLife).toBe(5);
    });
  });
});

// ============================================================
// SENSITIVITY ANALYSIS
// ============================================================

describe('Sensitivity Analysis', () => {
  describe('calculateInputSensitivity', () => {
    // Simple profit calculation function for testing
    const calculateProfit = (inputs: Record<string, number>) => {
      return (inputs.salePrice || 0) - (inputs.developmentCost || 0);
    };

    it('calculates sensitivity for each input', () => {
      const baseInputs = {
        developmentCost: 1_000_000,
        salePrice: 2_000_000,
      };

      const result = calculateInputSensitivity(baseInputs, calculateProfit);

      expect(result.baseOutput).toBe(1_000_000);
      expect(result.sensitivities.length).toBe(2);
    });

    it('ranks inputs by impact', () => {
      const baseInputs = {
        developmentCost: 1_000_000,
        salePrice: 2_000_000,
      };

      const result = calculateInputSensitivity(baseInputs, calculateProfit);

      // salePrice has higher variance (25%) than developmentCost (20%)
      // so it should have higher impact
      expect(result.sensitivities[0].inputName).toBe('salePrice');
    });

    it('identifies top influencers', () => {
      const baseInputs = {
        developmentCost: 1_000_000,
        salePrice: 2_000_000,
      };

      const result = calculateInputSensitivity(baseInputs, calculateProfit);

      expect(result.topInfluencers.length).toBeLessThanOrEqual(5);
    });

    it('calculates percent change correctly', () => {
      const baseInputs = {
        developmentCost: 1_000_000,
        salePrice: 2_000_000,
      };

      const result = calculateInputSensitivity(baseInputs, calculateProfit);

      // Each sensitivity should have a percent change relative to base
      result.sensitivities.forEach((s) => {
        expect(typeof s.percentChange).toBe('number');
        expect(s.percentChange).toBeGreaterThanOrEqual(0);
      });
    });
  });
});

// ============================================================
// BREAK-EVEN ANALYSIS
// ============================================================

describe('Break-Even Analysis', () => {
  describe('findBreakEvenValue', () => {
    const calculateProfit = (inputs: Record<string, number>) => {
      return (inputs.salePrice || 0) - (inputs.developmentCost || 0);
    };

    it('finds break-even for revenue inputs', () => {
      const baseInputs = {
        developmentCost: 1_000_000,
        salePrice: 2_000_000,
      };

      const breakEven = findBreakEvenValue(
        'salePrice',
        2_000_000,
        baseInputs,
        calculateProfit,
        true // isRevenueType
      );

      // Break-even should be close to development cost
      expect(breakEven).toBeCloseTo(1_000_000, -4); // Within 10,000
    });

    it('finds break-even for cost inputs', () => {
      const baseInputs = {
        developmentCost: 1_000_000,
        salePrice: 2_000_000,
      };

      const breakEven = findBreakEvenValue(
        'developmentCost',
        1_000_000,
        baseInputs,
        calculateProfit,
        false // isCostType
      );

      // Break-even should be close to sale price
      expect(breakEven).toBeCloseTo(2_000_000, -4);
    });
  });
});

// ============================================================
// MONTE CARLO SIMULATION
// ============================================================

describe('Monte Carlo Simulation', () => {
  describe('triangularRandom', () => {
    it('returns values within bounds', () => {
      for (let i = 0; i < 100; i++) {
        const value = triangularRandom(0, 50, 100);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    });

    it('tends toward mode value', () => {
      const values: number[] = [];
      for (let i = 0; i < 1000; i++) {
        values.push(triangularRandom(0, 80, 100));
      }

      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      // Mean of triangular should be (min + mode + max) / 3 = (0 + 80 + 100) / 3 = 60
      // Allow some variance due to randomness
      expect(mean).toBeGreaterThan(55);
      expect(mean).toBeLessThan(65);
    });
  });

  describe('generateRandomInputs', () => {
    it('generates values within ranges', () => {
      const ranges = {
        developmentCost: {
          low: 800_000,
          base: 1_000_000,
          high: 1_200_000,
          variance: 0.2,
          inputName: 'developmentCost',
          label: 'Dev Cost',
          category: 'cost' as const,
        },
      };

      for (let i = 0; i < 100; i++) {
        const inputs = generateRandomInputs(ranges);
        expect(inputs.developmentCost).toBeGreaterThanOrEqual(800_000);
        expect(inputs.developmentCost).toBeLessThanOrEqual(1_200_000);
      }
    });
  });

  describe('calculateStatistics', () => {
    it('calculates basic statistics correctly', () => {
      const values = [1, 2, 3, 4, 5];
      const stats = calculateStatistics(values);

      expect(stats.mean).toBe(3);
      expect(stats.median).toBe(3);
      expect(stats.min).toBe(1);
      expect(stats.max).toBe(5);
      expect(stats.stdDev).toBeCloseTo(1.41, 1);
    });

    it('handles empty array', () => {
      const stats = calculateStatistics([]);

      expect(stats.mean).toBe(0);
      expect(stats.median).toBe(0);
      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
      expect(stats.stdDev).toBe(0);
    });

    it('handles single value', () => {
      const stats = calculateStatistics([100]);

      expect(stats.mean).toBe(100);
      expect(stats.median).toBe(100);
      expect(stats.min).toBe(100);
      expect(stats.max).toBe(100);
      expect(stats.stdDev).toBe(0);
    });
  });

  describe('calculatePercentiles', () => {
    it('calculates percentiles correctly', () => {
      const values = Array.from({ length: 100 }, (_, i) => i + 1);
      const percentiles = calculatePercentiles(values);

      expect(percentiles.p5).toBe(6);
      expect(percentiles.p50).toBe(51);
      expect(percentiles.p95).toBe(96);
    });
  });

  describe('createHistogram', () => {
    it('creates histogram with specified bins', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const histogram = createHistogram(values, 5);

      expect(histogram).toHaveLength(5);
      expect(histogram.every((bin) => bin.count >= 0)).toBe(true);
    });

    it('frequencies sum to approximately 100%', () => {
      const values = Array.from({ length: 100 }, () => Math.random() * 100);
      const histogram = createHistogram(values, 10);

      const totalFrequency = histogram.reduce((sum, bin) => sum + bin.frequency, 0);
      expect(totalFrequency).toBeCloseTo(100, 0);
    });

    it('handles empty array', () => {
      const histogram = createHistogram([]);
      expect(histogram).toHaveLength(0);
    });
  });

  describe('runMonteCarloSimulation', () => {
    it('runs specified number of iterations', () => {
      const ranges = {
        value: {
          low: 0,
          base: 50,
          high: 100,
          variance: 0.5,
          inputName: 'value',
          label: 'Value',
          category: 'other' as const,
        },
      };

      const result = runMonteCarloSimulation(
        ranges,
        (inputs) => inputs.value * 2,
        100
      );

      expect(result.iterations).toBe(100);
    });

    it('calculates probability of loss', () => {
      const ranges = {
        revenue: {
          low: -100,
          base: 50,
          high: 200,
          variance: 0.5,
          inputName: 'revenue',
          label: 'Revenue',
          category: 'revenue' as const,
        },
      };

      const result = runMonteCarloSimulation(
        ranges,
        (inputs) => inputs.revenue,
        1000
      );

      // With range from -100 to 200, some iterations should be negative
      expect(result.probabilityOfLoss).toBeGreaterThan(0);
      expect(result.probabilityOfLoss).toBeLessThan(100);
    });

    it('generates histogram', () => {
      const ranges = {
        value: {
          low: 0,
          base: 50,
          high: 100,
          variance: 0.5,
          inputName: 'value',
          label: 'Value',
          category: 'other' as const,
        },
      };

      const result = runMonteCarloSimulation(
        ranges,
        (inputs) => inputs.value,
        500
      );

      expect(result.histogram.length).toBe(20);
    });
  });
});

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats number as currency', () => {
      expect(formatCurrency(1000000)).toBe('R1,000,000');
    });

    it('uses custom currency symbol', () => {
      expect(formatCurrency(1000, '$')).toBe('$1,000');
    });

    it('handles negative numbers', () => {
      expect(formatCurrency(-5000)).toContain('-');
      expect(formatCurrency(-5000)).toContain('5,000');
    });
  });

  describe('formatPercentage', () => {
    it('formats number as percentage', () => {
      expect(formatPercentage(15.5)).toBe('15.5%');
    });

    it('uses custom decimal places', () => {
      // Note: JavaScript toFixed can have rounding quirks with certain values
      expect(formatPercentage(15.556, 2)).toBe('15.56%');
    });

    it('handles zero', () => {
      expect(formatPercentage(0)).toBe('0.0%');
    });
  });
});

// ============================================================
// RANGE CONFIGS
// ============================================================

describe('Range Configs', () => {
  it('has configurations for common cost inputs', () => {
    expect(RANGE_CONFIGS.developmentCost).toBeDefined();
    expect(RANGE_CONFIGS.developmentCost.category).toBe('cost');
  });

  it('has configurations for common revenue inputs', () => {
    expect(RANGE_CONFIGS.salePrice).toBeDefined();
    expect(RANGE_CONFIGS.salePrice.category).toBe('revenue');
  });

  it('has configurations for margin inputs', () => {
    expect(RANGE_CONFIGS.markupPercentage).toBeDefined();
    expect(RANGE_CONFIGS.markupPercentage.isPercent).toBe(true);
  });

  it('has configurations for duration inputs', () => {
    expect(RANGE_CONFIGS.usefulLife).toBeDefined();
    expect(RANGE_CONFIGS.usefulLife.isInteger).toBe(true);
  });
});
