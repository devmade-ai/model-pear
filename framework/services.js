import { LAYER_2_DELIVERY } from './delivery.js';

// Global variables for framework selections (will be set by initialization)
let selectedDelivery = null;
let selectedService = null;

// Export setters for these variables
export function setSelectedDelivery(value) {
    selectedDelivery = value;
}

export function setSelectedService(value) {
    selectedService = value;
}

// ========== LAYER 3: SERVICE MODELS ==========
export const LAYER_3_SERVICE = {
    'self-service': {
        name: 'Self-Service Software',
        description: 'Customer implements and manages independently',
        pricingMultiplier: 0.7, // 30% lower pricing
        churnMultiplier: 1.5, // 50% higher churn
        cacMultiplier: 0.6, // 40% lower CAC
        targetMarket: ['Technical users', 'Smaller budgets'],
        margin: '85-95%',
        supportCost: 'low'
    },
    'managed-services': {
        name: 'Managed Services',
        description: 'Vendor handles implementation, ongoing optimization',
        baseFee: 1500, // R1,500/unit/month base
        premiumRange: '1,500-5,000',
        sla: '99.9% uptime typical',
        implementationCost: 'Included or R100,000-R500,000 separate',
        churnMultiplier: 0.5, // 50% lower churn
        margin: '35-50%',
        targetMarket: ['Non-technical', 'Enterprises', 'Regulated industries'],
        supportCost: 'high'
    },
    'professional-services': {
        name: 'Professional Services',
        description: 'Custom implementation, integration, training',
        pricingModels: {
            hourly: 'R500-R2,500/hour',
            fixedPrice: 'R100,000-R5,000,000 depending on scope',
            retainer: 'R40,000-R350,000/month'
        },
        attachRate: '40-90% depending on complexity',
        revenueMultiple: '1-3× annual software license value',
        paymentTerms: '30% deposit, 30% midpoint, 40% completion',
        margin: '40-60%',
        addToRevenue: true
    },
    'hybrid-modular': {
        name: 'Hybrid/Modular',
        description: 'Base software self-service + optional managed components',
        pricingMultiplier: 0.85, // Base price at 85%
        managedAddon: 'R80,000/month typical',
        benefit: 'Flexibility drives higher conversion',
        tradeoff: 'Complexity in sales process',
        conversionBoost: 1.15 // 15% higher conversion
    }
};

// Helper function to apply Layer 2 modifiers
export function applyDeliveryModifier(basePrice, deliveryKey) {
    const delivery = LAYER_2_DELIVERY[deliveryKey];
    if (!delivery) return basePrice;

    if (deliveryKey === 'self-hosted') {
        // Convert to one-time + maintenance model
        return {
            oneTimeLicense: basePrice * delivery.licenseMultiplier,
            annualMaintenance: basePrice * delivery.licenseMultiplier * delivery.maintenanceMultiplier,
            model: 'one-time-maintenance'
        };
    }

    return basePrice * (delivery.pricingMultiplier || 1.0);
}

// Helper function to apply Layer 3 modifiers
export function applyServiceModifier(basePrice, serviceKey, churnRate = 0, cac = 0) {
    const service = LAYER_3_SERVICE[serviceKey];
    if (!service) return { price: basePrice, churn: churnRate, cac: cac };

    let modifiedPrice = basePrice;
    let modifiedChurn = churnRate;
    let modifiedCac = cac;
    let additionalRevenue = 0;

    if (serviceKey === 'managed-services') {
        additionalRevenue = service.baseFee;
    }

    if (service.pricingMultiplier) {
        modifiedPrice = basePrice * service.pricingMultiplier;
    }

    if (service.churnMultiplier) {
        modifiedChurn = churnRate * service.churnMultiplier;
    }

    if (service.cacMultiplier) {
        modifiedCac = cac * service.cacMultiplier;
    }

    return {
        price: modifiedPrice,
        churn: modifiedChurn,
        cac: modifiedCac,
        additionalRevenue: additionalRevenue
    };
}

/**
 * Apply all Layer 2/3 modifiers to pricing inputs
 * This is the central function that should be called by all calculate() functions
 * to ensure consistent application of delivery and service modifiers.
 *
 * @param {number} basePrice - The base monthly/recurring price
 * @param {number} churnRate - The base churn rate (as percentage, e.g., 5 for 5%)
 * @param {number} cac - The base Customer Acquisition Cost
 * @returns {object} Modified values: { price, churn, cac, additionalMRR, isOneTime, oneTimeLicense, annualMaintenance }
 */
export function applyFrameworkModifiers(basePrice, churnRate = 0, cac = 0) {
    let modifiedPrice = basePrice;
    let modifiedChurn = churnRate;
    let modifiedCac = cac;
    let additionalMRR = 0;
    let isOneTime = false;
    let oneTimeLicense = 0;
    let annualMaintenance = 0;

    // Step 1: Apply Layer 2 (Delivery) modifiers
    if (selectedDelivery) {
        const deliveryResult = applyDeliveryModifier(modifiedPrice, selectedDelivery);

        if (typeof deliveryResult === 'object' && deliveryResult.model === 'one-time-maintenance') {
            // Self-hosted: convert to one-time license model
            isOneTime = true;
            oneTimeLicense = deliveryResult.oneTimeLicense;
            annualMaintenance = deliveryResult.annualMaintenance;
            // For recurring calculations, use the monthly maintenance equivalent
            modifiedPrice = deliveryResult.annualMaintenance / 12;
        } else {
            // Regular pricing multiplier
            modifiedPrice = deliveryResult;
        }
    }

    // Step 2: Apply Layer 3 (Service) modifiers
    if (selectedService) {
        const serviceResult = applyServiceModifier(modifiedPrice, selectedService, modifiedChurn, modifiedCac);
        modifiedPrice = serviceResult.price;
        modifiedChurn = serviceResult.churn;
        modifiedCac = serviceResult.cac;

        // Managed services adds base fee per unit
        if (serviceResult.additionalRevenue) {
            additionalMRR = serviceResult.additionalRevenue;
        }
    }

    return {
        price: modifiedPrice,
        churn: modifiedChurn,
        cac: modifiedCac,
        additionalMRR: additionalMRR,
        isOneTime: isOneTime,
        oneTimeLicense: oneTimeLicense,
        annualMaintenance: annualMaintenance
    };
}

