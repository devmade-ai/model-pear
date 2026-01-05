import { SA_PRICING_DEFAULTS, getDefaults } from '../config/sa-pricing-defaults.js';

// ========== SIMPLIFIED MODEL DEFINITIONS ==========
// Static unit economics focused on seller cost vs buyer value equilibrium

export const models = {
    'subscription': {
        name: 'Subscription (SaaS)',
        description: 'Recurring monthly revenue per customer',
        inputs: [
            // PRICING
            {
                name: 'monthlyPrice',
                label: 'Monthly Price per Customer (R)',
                type: 'currency',
                default: 500,
                min: 0,
                step: 50,
                category: 'pricing',
                hint: 'What you charge each customer per month'
            },
            {
                name: 'customers',
                label: 'Number of Customers',
                type: 'number',
                default: 100,
                min: 0,
                step: 1,
                category: 'pricing',
                hint: 'Total active customers'
            },

            // SELLER COSTS
            {
                name: 'costToServe',
                label: 'Cost to Serve per Customer (R/month)',
                type: 'currency',
                default: 150,
                min: 0,
                step: 10,
                category: 'seller',
                hint: 'Infrastructure, support, customer success per customer per month'
            },
            {
                name: 'desiredMargin',
                label: 'Desired Gross Margin (%)',
                type: 'percent',
                default: 70,
                min: 0,
                max: 100,
                step: 1,
                category: 'seller',
                hint: 'Target profit margin (typical SaaS: 70-85%)'
            },

            // BUYER VALUE
            {
                name: 'buyerValue',
                label: 'Monthly Value to Buyer (R)',
                type: 'currency',
                default: 5000,
                min: 0,
                step: 100,
                category: 'buyer',
                hint: 'Revenue enabled or cost saved per month for buyer'
            }
        ],

        calculate: function(inputs) {
            const monthlyRevenue = inputs.monthlyPrice * inputs.customers;
            const monthlyCost = inputs.costToServe * inputs.customers;
            const monthlyProfit = monthlyRevenue - monthlyCost;
            const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

            // Calculate annual values
            const annualRevenue = monthlyRevenue * 12;
            const annualProfit = monthlyProfit * 12;

            // Seller perspective
            const minimumPrice = inputs.desiredMargin >= 100 ? Infinity :
                inputs.costToServe / (1 - inputs.desiredMargin / 100);
            const priceVsMinimum = inputs.monthlyPrice >= minimumPrice;

            // Buyer perspective
            const buyerROI = inputs.monthlyPrice > 0 ? inputs.buyerValue / inputs.monthlyPrice : 0;
            const buyerAnnualSavings = (inputs.buyerValue - inputs.monthlyPrice) * 12;
            const buyerPaybackMonths = inputs.buyerValue > inputs.monthlyPrice ?
                inputs.monthlyPrice / (inputs.buyerValue - inputs.monthlyPrice) : Infinity;

            // Equilibrium analysis
            const maximumPriceBuyerWillPay = inputs.buyerValue * 0.4; // 2.5x ROI threshold
            const equilibriumExists = minimumPrice <= maximumPriceBuyerWillPay;
            const equilibriumRange = equilibriumExists ? {
                floor: minimumPrice,
                ceiling: maximumPriceBuyerWillPay,
                suggested: (minimumPrice + maximumPriceBuyerWillPay) / 2
            } : null;

            return {
                // Revenue & Profit
                monthlyRevenue,
                annualRevenue,
                monthlyCost,
                monthlyProfit,
                annualProfit,
                actualMargin,

                // Seller perspective
                sellerMinimumPrice: minimumPrice,
                sellerMeetsTarget: priceVsMinimum,
                sellerPriceGap: inputs.monthlyPrice - minimumPrice,

                // Buyer perspective
                buyerROI,
                buyerAnnualSavings,
                buyerPaybackMonths,
                buyerMaxPrice: maximumPriceBuyerWillPay,

                // Equilibrium
                equilibriumExists,
                equilibriumRange,

                // Display metrics
                revenuePerCustomer: inputs.monthlyPrice,
                customers: inputs.customers
            };
        },

        defaultTier: 'standard',
        tiers: ['basic', 'standard', 'enterprise']
    },

    'usage-based': {
        name: 'Usage-Based',
        description: 'Pay per API call, transaction, build minute, etc.',
        inputs: [
            // PRICING
            {
                name: 'pricePerUnit',
                label: 'Price per Unit (R)',
                type: 'currency',
                default: 2.00,
                min: 0,
                step: 0.10,
                category: 'pricing',
                hint: 'What you charge per unit (e.g., per 1,000 API calls)'
            },
            {
                name: 'monthlyUnits',
                label: 'Monthly Units',
                type: 'number',
                default: 10000,
                min: 0,
                step: 100,
                category: 'pricing',
                hint: 'Total units consumed per month'
            },
            {
                name: 'unitLabel',
                label: 'Unit Description',
                type: 'text',
                default: '1,000 API calls',
                category: 'pricing',
                hint: 'What is the unit? (e.g., "1,000 API calls", "build minute")'
            },

            // SELLER COSTS
            {
                name: 'costPerUnit',
                label: 'Cost per Unit (R)',
                type: 'currency',
                default: 0.50,
                min: 0,
                step: 0.05,
                category: 'seller',
                hint: 'Infrastructure cost per unit'
            },
            {
                name: 'desiredMargin',
                label: 'Desired Gross Margin (%)',
                type: 'percent',
                default: 75,
                min: 0,
                max: 100,
                step: 1,
                category: 'seller',
                hint: 'Target profit margin (typical usage-based: 75-90%)'
            },

            // BUYER VALUE
            {
                name: 'buyerValuePerUnit',
                label: 'Value per Unit to Buyer (R)',
                type: 'currency',
                default: 10.00,
                min: 0,
                step: 0.50,
                category: 'buyer',
                hint: 'Revenue enabled or cost saved per unit for buyer'
            }
        ],

        calculate: function(inputs) {
            const monthlyRevenue = inputs.pricePerUnit * inputs.monthlyUnits;
            const monthlyCost = inputs.costPerUnit * inputs.monthlyUnits;
            const monthlyProfit = monthlyRevenue - monthlyCost;
            const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

            // Calculate annual values
            const annualRevenue = monthlyRevenue * 12;
            const annualProfit = monthlyProfit * 12;

            // Seller perspective
            const minimumPricePerUnit = inputs.desiredMargin >= 100 ? Infinity :
                inputs.costPerUnit / (1 - inputs.desiredMargin / 100);
            const priceVsMinimum = inputs.pricePerUnit >= minimumPricePerUnit;

            // Buyer perspective
            const buyerROIPerUnit = inputs.pricePerUnit > 0 ? inputs.buyerValuePerUnit / inputs.pricePerUnit : 0;
            const buyerMonthlyValue = inputs.buyerValuePerUnit * inputs.monthlyUnits;
            const buyerMonthlySavings = buyerMonthlyValue - monthlyRevenue;
            const buyerAnnualSavings = buyerMonthlySavings * 12;

            // Equilibrium analysis
            const maximumPriceBuyerWillPay = inputs.buyerValuePerUnit * 0.4; // 2.5x ROI threshold
            const equilibriumExists = minimumPricePerUnit <= maximumPriceBuyerWillPay;
            const equilibriumRange = equilibriumExists ? {
                floor: minimumPricePerUnit,
                ceiling: maximumPriceBuyerWillPay,
                suggested: (minimumPricePerUnit + maximumPriceBuyerWillPay) / 2
            } : null;

            return {
                // Revenue & Profit
                monthlyRevenue,
                annualRevenue,
                monthlyCost,
                monthlyProfit,
                annualProfit,
                actualMargin,

                // Seller perspective
                sellerMinimumPrice: minimumPricePerUnit,
                sellerMeetsTarget: priceVsMinimum,
                sellerPriceGap: inputs.pricePerUnit - minimumPricePerUnit,

                // Buyer perspective
                buyerROI: buyerROIPerUnit,
                buyerMonthlyValue,
                buyerMonthlySavings,
                buyerAnnualSavings,
                buyerMaxPrice: maximumPriceBuyerWillPay,

                // Equilibrium
                equilibriumExists,
                equilibriumRange,

                // Display metrics
                pricePerUnit: inputs.pricePerUnit,
                monthlyUnits: inputs.monthlyUnits,
                unitLabel: inputs.unitLabel
            };
        },

        defaultTier: 'api',
        tiers: ['api', 'cicd', 'transaction']
    },

    'per-seat': {
        name: 'Per-Seat (Per User)',
        description: 'Price per user/seat per month',
        inputs: [
            // PRICING
            {
                name: 'pricePerSeat',
                label: 'Price per Seat (R/month)',
                type: 'currency',
                default: 250,
                min: 0,
                step: 10,
                category: 'pricing',
                hint: 'What you charge per user per month'
            },
            {
                name: 'seats',
                label: 'Number of Seats',
                type: 'number',
                default: 25,
                min: 0,
                step: 1,
                category: 'pricing',
                hint: 'Total active users/seats'
            },

            // SELLER COSTS
            {
                name: 'costPerSeat',
                label: 'Cost per Seat (R/month)',
                type: 'currency',
                default: 70,
                min: 0,
                step: 5,
                category: 'seller',
                hint: 'Infrastructure and support cost per seat per month'
            },
            {
                name: 'desiredMargin',
                label: 'Desired Gross Margin (%)',
                type: 'percent',
                default: 72,
                min: 0,
                max: 100,
                step: 1,
                category: 'seller',
                hint: 'Target profit margin (typical per-seat: 70-80%)'
            },

            // BUYER VALUE
            {
                name: 'valuePerSeat',
                label: 'Monthly Value per Seat to Buyer (R)',
                type: 'currency',
                default: 2000,
                min: 0,
                step: 50,
                category: 'buyer',
                hint: 'Productivity gain or cost saved per user per month'
            }
        ],

        calculate: function(inputs) {
            const monthlyRevenue = inputs.pricePerSeat * inputs.seats;
            const monthlyCost = inputs.costPerSeat * inputs.seats;
            const monthlyProfit = monthlyRevenue - monthlyCost;
            const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

            // Calculate annual values
            const annualRevenue = monthlyRevenue * 12;
            const annualProfit = monthlyProfit * 12;

            // Seller perspective
            const minimumPricePerSeat = inputs.desiredMargin >= 100 ? Infinity :
                inputs.costPerSeat / (1 - inputs.desiredMargin / 100);
            const priceVsMinimum = inputs.pricePerSeat >= minimumPricePerSeat;

            // Buyer perspective
            const buyerROIPerSeat = inputs.pricePerSeat > 0 ? inputs.valuePerSeat / inputs.pricePerSeat : 0;
            const buyerMonthlyValue = inputs.valuePerSeat * inputs.seats;
            const buyerMonthlySavings = buyerMonthlyValue - monthlyRevenue;
            const buyerAnnualSavings = buyerMonthlySavings * 12;

            // Equilibrium analysis
            const maximumPriceBuyerWillPay = inputs.valuePerSeat * 0.4; // 2.5x ROI threshold
            const equilibriumExists = minimumPricePerSeat <= maximumPriceBuyerWillPay;
            const equilibriumRange = equilibriumExists ? {
                floor: minimumPricePerSeat,
                ceiling: maximumPriceBuyerWillPay,
                suggested: (minimumPricePerSeat + maximumPriceBuyerWillPay) / 2
            } : null;

            return {
                // Revenue & Profit
                monthlyRevenue,
                annualRevenue,
                monthlyCost,
                monthlyProfit,
                annualProfit,
                actualMargin,

                // Seller perspective
                sellerMinimumPrice: minimumPricePerSeat,
                sellerMeetsTarget: priceVsMinimum,
                sellerPriceGap: inputs.pricePerSeat - minimumPricePerSeat,

                // Buyer perspective
                buyerROI: buyerROIPerSeat,
                buyerMonthlyValue,
                buyerMonthlySavings,
                buyerAnnualSavings,
                buyerMaxPrice: maximumPriceBuyerWillPay,

                // Equilibrium
                equilibriumExists,
                equilibriumRange,

                // Display metrics
                pricePerSeat: inputs.pricePerSeat,
                seats: inputs.seats
            };
        },

        defaultTier: 'businessOps',
        tiers: ['devTools', 'businessOps', 'collaboration']
    },

    'one-time': {
        name: 'One-Time Purchase (Perpetual License)',
        description: 'Upfront license fee + optional annual maintenance',
        inputs: [
            // PRICING
            {
                name: 'licensePrice',
                label: 'License Price (R)',
                type: 'currency',
                default: 5000,
                min: 0,
                step: 100,
                category: 'pricing',
                hint: 'One-time perpetual license fee'
            },
            {
                name: 'maintenanceFee',
                label: 'Annual Maintenance Fee (%)',
                type: 'percent',
                default: 20,
                min: 0,
                max: 100,
                step: 1,
                category: 'pricing',
                hint: 'Percentage of license price charged annually (typical: 15-25%)'
            },
            {
                name: 'maintenanceAttach',
                label: 'Maintenance Attach Rate (%)',
                type: 'percent',
                default: 60,
                min: 0,
                max: 100,
                step: 1,
                category: 'pricing',
                hint: 'Percentage of customers buying maintenance'
            },
            {
                name: 'unitsSoldPerMonth',
                label: 'Licenses Sold per Month',
                type: 'number',
                default: 5,
                min: 0,
                step: 1,
                category: 'pricing',
                hint: 'Average number of new licenses sold monthly'
            },
            {
                name: 'existingCustomers',
                label: 'Existing Customers on Maintenance',
                type: 'number',
                default: 30,
                min: 0,
                step: 1,
                category: 'pricing',
                hint: 'Current customer base paying maintenance'
            },

            // SELLER COSTS
            {
                name: 'costToDeliver',
                label: 'Cost to Deliver per License (R)',
                type: 'currency',
                default: 1500,
                min: 0,
                step: 100,
                category: 'seller',
                hint: 'One-time cost for onboarding, implementation per customer'
            },
            {
                name: 'monthlySupportCost',
                label: 'Monthly Support Cost per Customer (R)',
                type: 'currency',
                default: 50,
                min: 0,
                step: 10,
                category: 'seller',
                hint: 'Ongoing monthly support cost per customer'
            },
            {
                name: 'desiredMargin',
                label: 'Desired Gross Margin (%)',
                type: 'percent',
                default: 70,
                min: 0,
                max: 100,
                step: 1,
                category: 'seller',
                hint: 'Target profit margin on license sales (typical: 70-80%)'
            },

            // BUYER VALUE
            {
                name: 'buyerValuePerYear',
                label: 'Annual Value to Buyer (R)',
                type: 'currency',
                default: 15000,
                min: 0,
                step: 500,
                category: 'buyer',
                hint: 'Annual productivity gain or cost saved for buyer'
            }
        ],

        calculate: function(inputs) {
            // Monthly calculations
            const monthlyLicenseRevenue = inputs.licensePrice * inputs.unitsSoldPerMonth;
            const annualMaintenanceFee = inputs.licensePrice * (inputs.maintenanceFee / 100);
            const monthlyMaintenanceRevenue = (inputs.existingCustomers * annualMaintenanceFee) / 12;
            const monthlyRevenue = monthlyLicenseRevenue + monthlyMaintenanceRevenue;

            const monthlyLicenseCost = inputs.costToDeliver * inputs.unitsSoldPerMonth;
            const monthlySupportCost = inputs.existingCustomers * inputs.monthlySupportCost;
            const monthlyCost = monthlyLicenseCost + monthlySupportCost;

            const monthlyProfit = monthlyRevenue - monthlyCost;
            const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

            // Annual calculations
            const annualRevenue = monthlyRevenue * 12;
            const annualProfit = monthlyProfit * 12;

            // Seller perspective - license only
            const minimumLicensePrice = inputs.desiredMargin >= 100 ? Infinity :
                inputs.costToDeliver / (1 - inputs.desiredMargin / 100);
            const priceVsMinimum = inputs.licensePrice >= minimumLicensePrice;

            // Buyer perspective - total cost of ownership
            const buyerFirstYearCost = inputs.licensePrice + (annualMaintenanceFee * (inputs.maintenanceAttach / 100));
            const buyerYear2PlusCost = annualMaintenanceFee * (inputs.maintenanceAttach / 100);
            const buyerROIFirstYear = buyerFirstYearCost > 0 ? inputs.buyerValuePerYear / buyerFirstYearCost : 0;
            const buyerPaybackMonths = buyerFirstYearCost > 0 && inputs.buyerValuePerYear > buyerFirstYearCost ?
                12 * (buyerFirstYearCost / (inputs.buyerValuePerYear - buyerFirstYearCost)) : Infinity;

            // Equilibrium analysis
            const maximumPriceBuyerWillPay = inputs.buyerValuePerYear * 0.5; // 2x ROI in year 1
            const equilibriumExists = minimumLicensePrice <= maximumPriceBuyerWillPay;
            const equilibriumRange = equilibriumExists ? {
                floor: minimumLicensePrice,
                ceiling: maximumPriceBuyerWillPay,
                suggested: (minimumLicensePrice + maximumPriceBuyerWillPay) / 2
            } : null;

            return {
                // Revenue & Profit
                monthlyRevenue,
                annualRevenue,
                monthlyLicenseRevenue,
                monthlyMaintenanceRevenue,
                monthlyCost,
                monthlyProfit,
                annualProfit,
                actualMargin,

                // Seller perspective
                sellerMinimumPrice: minimumLicensePrice,
                sellerMeetsTarget: priceVsMinimum,
                sellerPriceGap: inputs.licensePrice - minimumLicensePrice,

                // Buyer perspective
                buyerFirstYearCost,
                buyerYear2PlusCost,
                buyerROI: buyerROIFirstYear,
                buyerPaybackMonths,
                buyerAnnualValue: inputs.buyerValuePerYear,
                buyerMaxPrice: maximumPriceBuyerWillPay,

                // Equilibrium
                equilibriumExists,
                equilibriumRange,

                // Display metrics
                licensePrice: inputs.licensePrice,
                unitsSoldPerMonth: inputs.unitsSoldPerMonth,
                existingCustomers: inputs.existingCustomers
            };
        },

        defaultTier: 'small',
        tiers: ['small', 'enterprise']
    },

    'marketplace': {
        name: 'Marketplace (Two-Sided)',
        description: 'Commission-based marketplace connecting buyers and sellers',
        inputs: [
            // PRICING
            {
                name: 'commissionRate',
                label: 'Commission Rate (%)',
                type: 'percent',
                default: 10,
                min: 0,
                max: 100,
                step: 0.5,
                category: 'pricing',
                hint: 'Percentage commission on each transaction'
            },
            {
                name: 'avgTransactionValue',
                label: 'Average Transaction Value (R)',
                type: 'currency',
                default: 500,
                min: 0,
                step: 50,
                category: 'pricing',
                hint: 'Average gross merchandise value (GMV) per transaction'
            },
            {
                name: 'monthlyTransactions',
                label: 'Monthly Transactions',
                type: 'number',
                default: 200,
                min: 0,
                step: 10,
                category: 'pricing',
                hint: 'Total successful transactions per month'
            },
            {
                name: 'activeBuyers',
                label: 'Active Buyers',
                type: 'number',
                default: 100,
                min: 0,
                step: 5,
                category: 'pricing',
                hint: 'Number of active buyers on platform'
            },
            {
                name: 'activeSellers',
                label: 'Active Sellers',
                type: 'number',
                default: 20,
                min: 0,
                step: 1,
                category: 'pricing',
                hint: 'Number of active sellers on platform'
            },

            // SELLER COSTS
            {
                name: 'costPerTransaction',
                label: 'Cost per Transaction (R)',
                type: 'currency',
                default: 15,
                min: 0,
                step: 1,
                category: 'seller',
                hint: 'Payment processing, support, fraud prevention per transaction'
            },
            {
                name: 'desiredMargin',
                label: 'Desired Gross Margin (%)',
                type: 'percent',
                default: 70,
                min: 0,
                max: 100,
                step: 1,
                category: 'seller',
                hint: 'Target profit margin on commissions (typical: 60-75%)'
            },

            // BUYER VALUE (for sellers using the platform)
            {
                name: 'sellerValuePerTransaction',
                label: 'Value per Transaction to Seller (R)',
                type: 'currency',
                default: 150,
                min: 0,
                step: 10,
                category: 'buyer',
                hint: 'Profit seller makes per transaction (before commission)'
            }
        ],

        calculate: function(inputs) {
            // Revenue calculations
            const monthlyGMV = inputs.avgTransactionValue * inputs.monthlyTransactions;
            const commissionPerTransaction = inputs.avgTransactionValue * (inputs.commissionRate / 100);
            const monthlyRevenue = commissionPerTransaction * inputs.monthlyTransactions;

            // Cost calculations
            const monthlyCost = inputs.costPerTransaction * inputs.monthlyTransactions;
            const monthlyProfit = monthlyRevenue - monthlyCost;
            const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

            // Annual calculations
            const annualRevenue = monthlyRevenue * 12;
            const annualProfit = monthlyProfit * 12;
            const annualGMV = monthlyGMV * 12;

            // Seller perspective - minimum commission rate
            const minimumCommissionRate = inputs.desiredMargin >= 100 ? 100 :
                (inputs.costPerTransaction / inputs.avgTransactionValue) / (1 - inputs.desiredMargin / 100) * 100;
            const rateVsMinimum = inputs.commissionRate >= minimumCommissionRate;

            // Buyer perspective - sellers on the platform
            const sellerNetProfit = inputs.sellerValuePerTransaction - commissionPerTransaction;
            const sellerROI = inputs.sellerValuePerTransaction > 0 ?
                sellerNetProfit / inputs.sellerValuePerTransaction : 0;
            const sellerMonthlyProfit = sellerNetProfit * inputs.monthlyTransactions;
            const avgTransactionsPerSeller = inputs.activeSellers > 0 ?
                inputs.monthlyTransactions / inputs.activeSellers : 0;

            // Equilibrium analysis - maximum commission sellers will accept
            const maximumCommissionRate = inputs.avgTransactionValue > 0 ?
                (inputs.sellerValuePerTransaction * 0.3) / inputs.avgTransactionValue * 100 : 0; // Max 30% of profit
            const equilibriumExists = minimumCommissionRate <= maximumCommissionRate;
            const equilibriumRange = equilibriumExists ? {
                floor: minimumCommissionRate,
                ceiling: maximumCommissionRate,
                suggested: (minimumCommissionRate + maximumCommissionRate) / 2
            } : null;

            return {
                // Revenue & Profit
                monthlyRevenue,
                annualRevenue,
                monthlyGMV,
                annualGMV,
                monthlyCost,
                monthlyProfit,
                annualProfit,
                actualMargin,

                // Seller (platform) perspective
                sellerMinimumRate: minimumCommissionRate,
                sellerMeetsTarget: rateVsMinimum,
                sellerRateGap: inputs.commissionRate - minimumCommissionRate,

                // Buyer (merchants) perspective
                buyerNetProfitPerTransaction: sellerNetProfit,
                buyerROI: sellerROI,
                buyerMonthlyProfit: sellerMonthlyProfit,
                buyerMaxCommissionRate: maximumCommissionRate,
                avgTransactionsPerSeller,

                // Equilibrium
                equilibriumExists,
                equilibriumRange,

                // Display metrics
                commissionRate: inputs.commissionRate,
                avgTransactionValue: inputs.avgTransactionValue,
                monthlyTransactions: inputs.monthlyTransactions,
                activeBuyers: inputs.activeBuyers,
                activeSellers: inputs.activeSellers
            };
        },

        defaultTier: 'standard',
        tiers: ['standard', 'premium']
    }
};

// ========== HELPER FUNCTIONS ==========

/**
 * Get a model by key
 */
export function getModel(modelKey) {
    return models[modelKey];
}

/**
 * Get all model keys
 */
export function getModelKeys() {
    return Object.keys(models);
}

/**
 * Load default inputs for a model from SA pricing defaults
 */
export function loadModelDefaults(modelKey, tier = null) {
    const model = models[modelKey];
    if (!model) return {};

    // Map model keys to SA_PRICING_DEFAULTS keys
    const defaultsKeyMap = {
        'subscription': 'subscription',
        'usage-based': 'usageBased',
        'per-seat': 'perSeat',
        'one-time': 'oneTime',
        'marketplace': 'marketplace'
    };

    const defaultsKey = defaultsKeyMap[modelKey];
    if (!defaultsKey) return {};

    // Get tier (use model's default tier if not specified)
    const selectedTier = tier || model.defaultTier;

    try {
        const defaults = getDefaults(defaultsKey, selectedTier);

        // Map defaults to model inputs
        const inputDefaults = {};
        model.inputs.forEach(input => {
            if (defaults[input.name] !== undefined) {
                inputDefaults[input.name] = defaults[input.name];
            }
        });

        return inputDefaults;
    } catch (e) {
        console.warn(`Could not load defaults for ${modelKey}:${selectedTier}`, e);
        return {};
    }
}
