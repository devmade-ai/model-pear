import { applyFrameworkModifiers } from '../framework/services.js';

// ========== MODEL DEFINITIONS ==========
export const models = {
    'one-time': {
        name: 'One-Time Purchase (Perpetual License)',
        inputs: [
            { name: 'unitPrice', label: 'Unit Price per License (R)', type: 'currency', default: 5000, min: 0, step: 100, hint: 'One-time purchase price' },
            { name: 'unitsSold', label: 'Units Sold per Month', type: 'number', default: 5, min: 0, step: 1, hint: 'Number of licenses sold monthly' },
            { name: 'maintenanceFee', label: 'Annual Maintenance Fee (%)', type: 'percent', default: 20, min: 0, max: 100, step: 0.1, hint: 'Percentage of license price charged annually' },
            { name: 'maintenanceAttach', label: 'Maintenance Attach Rate (%)', type: 'percent', default: 60, min: 0, max: 100, step: 0.1, hint: 'Percentage of customers buying maintenance' },
            { name: 'customerLifetime', label: 'Customer Lifetime (years)', type: 'number', default: 5, min: 1, step: 1, hint: 'Average years customers remain active' },
            { name: 'cac', label: 'Customer Acquisition Cost (R)', type: 'currency', default: 2000, min: 0, step: 100, hint: 'Sales and marketing cost per customer' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.unitPrice,
                0,  // No churn for one-time model
                inputs.cac
            );

            const results = [];
            let totalCustomers = 0;

            for (let month = 0; month < months; month++) {
                const newCustomers = inputs.unitsSold;
                totalCustomers += newCustomers;

                const licenseRevenue = newCustomers * modifiers.price;
                const customersWithMaintenance = totalCustomers * (inputs.maintenanceAttach / 100);
                const maintenanceRevenue = customersWithMaintenance * modifiers.price * (inputs.maintenanceFee / 100) / 12;
                let totalRevenue = licenseRevenue + maintenanceRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += totalCustomers * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    licenseRevenue: licenseRevenue,
                    maintenanceRevenue: maintenanceRevenue,
                    totalRevenue: totalRevenue,
                    totalCustomers: totalCustomers,
                    unitsSold: newCustomers
                });
            }

            return results;
        }
    },
    'subscription': {
        name: 'Subscription (SaaS)',
        inputs: [
            { name: 'monthlyPrice', label: 'Monthly Subscription Price (R)', type: 'currency', default: 500, min: 0, step: 50, hint: 'Average monthly subscription fee per customer' },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 10, min: 0, step: 1, hint: 'Typical range for Early Stage SaaS: 20-100/month' },
            { name: 'churnRate', label: 'Monthly Churn Rate (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1, hint: 'Healthy SaaS churn: 3-7% monthly' },
            { name: 'startingCustomers', label: 'Starting Customer Base', type: 'number', default: 0, min: 0, step: 1, hint: 'Number of existing customers at start' },
            { name: 'expansionRate', label: 'Monthly Expansion Revenue (%)', type: 'percent', default: 2, min: 0, max: 100, step: 0.1, hint: 'Revenue growth from existing customers through upsells' },
            { name: 'cac', label: 'Customer Acquisition Cost (R)', type: 'currency', default: 1500, min: 0, step: 100, hint: 'Average cost to acquire one new customer' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.monthlyPrice,
                inputs.churnRate,
                inputs.cac
            );

            const results = [];
            let customers = inputs.startingCustomers;
            let avgRevenuePerCustomer = modifiers.price;

            for (let month = 0; month < months; month++) {
                const newMRR = inputs.newCustomers * modifiers.price;
                const churnedCustomers = customers * (modifiers.churn / 100);
                const churnedMRR = churnedCustomers * avgRevenuePerCustomer;
                const expansionMRR = customers * avgRevenuePerCustomer * (inputs.expansionRate / 100);

                customers = customers + inputs.newCustomers - churnedCustomers;
                let mrr = customers * avgRevenuePerCustomer + expansionMRR;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    mrr += customers * modifiers.additionalMRR;
                }

                avgRevenuePerCustomer = customers > 0 ? mrr / customers : modifiers.price;

                results.push({
                    month: month + 1,
                    customers: Math.round(customers),
                    mrr: mrr,
                    arr: mrr * 12,
                    newMRR: newMRR,
                    churnedMRR: churnedMRR,
                    expansionMRR: expansionMRR,
                    revenuePerCustomer: avgRevenuePerCustomer,
                    // Include modifier info
                    appliedMonthlyPrice: modifiers.price,
                    appliedChurnRate: modifiers.churn
                });
            }

            return results;
        }
    },
    'freemium': {
        name: 'Freemium',
        inputs: [
            { name: 'freeUsers', label: 'Free Users Acquired per Month', type: 'number', default: 100, min: 0, step: 1, hint: 'High free user acquisition is key for freemium models' },
            { name: 'conversionRate', label: 'Free-to-Paid Conversion Rate (%)', type: 'percent', default: 3, min: 0, max: 100, step: 0.1, hint: 'Typical freemium conversion: 2-5%' },
            { name: 'timeToConversion', label: 'Time to Conversion (months)', type: 'number', default: 2, min: 1, step: 1, hint: 'Average time before free users upgrade to paid' },
            { name: 'paidPrice', label: 'Paid Subscription Price (R)', type: 'currency', default: 300, min: 0, step: 50, hint: 'Monthly price for paid tier' },
            { name: 'freeChurn', label: 'Free User Churn Rate (%)', type: 'percent', default: 15, min: 0, max: 100, step: 0.1, hint: 'Free users typically have higher churn' },
            { name: 'paidChurn', label: 'Paid User Churn Rate (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1, hint: 'Paid user churn should be low: 3-7%' },
            { name: 'cac', label: 'Customer Acquisition Cost (R)', type: 'currency', default: 300, min: 0, step: 50, hint: 'Cost to acquire free users (typically lower than paid)' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.paidPrice,
                inputs.paidChurn,
                inputs.cac
            );

            const results = [];
            let freeUsers = 0;
            let paidUsers = 0;
            const cohorts = [];

            for (let month = 0; month < months; month++) {
                // Add new free users
                freeUsers += inputs.freeUsers;
                cohorts.push({ month: month, users: inputs.freeUsers, converted: 0 });

                // Convert users from eligible cohorts
                let newConversions = 0;
                cohorts.forEach(cohort => {
                    if (month - cohort.month >= inputs.timeToConversion) {
                        const eligible = cohort.users - cohort.converted;
                        const converting = eligible * (inputs.conversionRate / 100);
                        cohort.converted += converting;
                        newConversions += converting;
                    }
                });

                // Apply churn
                freeUsers = freeUsers * (1 - inputs.freeChurn / 100) - newConversions;
                paidUsers = paidUsers + newConversions;
                paidUsers = paidUsers * (1 - modifiers.churn / 100);

                // Calculate revenue using modified price
                let revenue = paidUsers * modifiers.price;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    revenue += paidUsers * modifiers.additionalMRR;
                }

                const totalUsers = freeUsers + paidUsers;

                results.push({
                    month: month + 1,
                    freeUsers: Math.round(freeUsers),
                    paidUsers: Math.round(paidUsers),
                    totalUsers: Math.round(totalUsers),
                    revenue: revenue,
                    conversionRate: totalUsers > 0 ? (paidUsers / totalUsers * 100) : 0,
                    newConversions: Math.round(newConversions),
                    // Include modifier info
                    appliedPaidPrice: modifiers.price,
                    appliedPaidChurn: modifiers.churn
                });
            }

            return results;
        }
    },
    'usage-based': {
        name: 'Usage-Based (Consumption)',
        inputs: [
            { name: 'pricePerUnit', label: 'Price per Unit (R)', type: 'currency', default: 0.50, min: 0, step: 0.10, hint: 'Price per API call, GB, or other unit' },
            { name: 'avgUsage', label: 'Avg Usage per Customer per Month', type: 'number', default: 500, min: 0, step: 1, hint: 'Starting usage level per customer' },
            { name: 'usageGrowth', label: 'Usage Growth per Customer (% monthly)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1, hint: 'Natural usage expansion as customers grow' },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 5, min: 0, step: 1, hint: 'New customers onboarded each month' },
            { name: 'churnRate', label: 'Customer Churn Rate (%)', type: 'percent', default: 3, min: 0, max: 100, step: 0.1, hint: 'Usage-based models often have lower churn: 2-5%' },
            { name: 'usageVariance', label: 'Usage Std Deviation (%)', type: 'percent', default: 20, min: 0, max: 100, step: 1, hint: 'Variability in monthly usage patterns' },
            { name: 'cac', label: 'Customer Acquisition Cost (R)', type: 'currency', default: 1000, min: 0, step: 100, hint: 'Average cost to acquire one customer' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.pricePerUnit,
                inputs.churnRate,
                inputs.cac
            );

            const results = [];
            let customers = 0;
            let avgUsagePerCustomer = inputs.avgUsage;

            for (let month = 0; month < months; month++) {
                customers = customers + inputs.newCustomers;
                customers = customers * (1 - modifiers.churn / 100);

                avgUsagePerCustomer = avgUsagePerCustomer * (1 + inputs.usageGrowth / 100);
                const totalUsage = customers * avgUsagePerCustomer;

                // Calculate revenue using modified price per unit
                let revenue = totalUsage * modifiers.price;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    revenue += customers * modifiers.additionalMRR;
                }

                const revenuePerCustomer = customers > 0 ? revenue / customers : 0;
                const variance = revenue * (inputs.usageVariance / 100);

                results.push({
                    month: month + 1,
                    customers: Math.round(customers),
                    totalUsage: totalUsage,
                    avgUsage: avgUsagePerCustomer,
                    revenue: revenue,
                    revenuePerCustomer: revenuePerCustomer,
                    revenueHigh: revenue + variance,
                    revenueLow: Math.max(0, revenue - variance),
                    // Include modifier info
                    appliedPricePerUnit: modifiers.price,
                    appliedChurnRate: modifiers.churn
                });
            }

            return results;
        }
    },
    'tiered': {
        name: 'Tiered Pricing',
        inputs: [
            { name: 'starterPrice', label: 'Starter Tier Price (R)', type: 'currency', default: 200, min: 0, step: 50, hint: 'Entry-level pricing tier' },
            { name: 'proPrice', label: 'Professional Tier Price (R)', type: 'currency', default: 600, min: 0, step: 50, hint: 'Mid-tier pricing for power users' },
            { name: 'enterprisePrice', label: 'Enterprise Tier Price (R)', type: 'currency', default: 2000, min: 0, step: 100, hint: 'Premium tier for large customers' },
            { name: 'starterPct', label: 'Starter Tier % of New Customers', type: 'percent', default: 60, min: 0, max: 100, step: 1, hint: 'Most customers start in lower tier' },
            { name: 'proPct', label: 'Pro Tier % of New Customers', type: 'percent', default: 30, min: 0, max: 100, step: 1, hint: 'Percentage starting in middle tier' },
            { name: 'enterprisePct', label: 'Enterprise Tier % of New Customers', type: 'percent', default: 10, min: 0, max: 100, step: 1, hint: 'Few start at highest tier' },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 20, min: 0, step: 1, hint: 'Total new customers across all tiers' },
            { name: 'upgradeRate', label: 'Monthly Upgrade Rate (%)', type: 'percent', default: 2, min: 0, max: 100, step: 0.1, hint: 'Customers moving to higher tiers' },
            { name: 'downgradeRate', label: 'Monthly Downgrade Rate (%)', type: 'percent', default: 1, min: 0, max: 100, step: 0.1, hint: 'Customers moving to lower tiers' },
            { name: 'churnRate', label: 'Monthly Churn Rate (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1, hint: 'Customer churn across all tiers' },
            { name: 'cac', label: 'Customer Acquisition Cost (R)', type: 'currency', default: 1200, min: 0, step: 100, hint: 'Blended CAC across all tiers' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers to each tier
            const starterMod = applyFrameworkModifiers(inputs.starterPrice, inputs.churnRate, inputs.cac);
            const proMod = applyFrameworkModifiers(inputs.proPrice, inputs.churnRate, inputs.cac);
            const enterpriseMod = applyFrameworkModifiers(inputs.enterprisePrice, inputs.churnRate, inputs.cac);

            const results = [];
            let starterCustomers = 0;
            let proCustomers = 0;
            let enterpriseCustomers = 0;

            for (let month = 0; month < months; month++) {
                // Add new customers
                const newStarter = inputs.newCustomers * (inputs.starterPct / 100);
                const newPro = inputs.newCustomers * (inputs.proPct / 100);
                const newEnterprise = inputs.newCustomers * (inputs.enterprisePct / 100);

                starterCustomers += newStarter;
                proCustomers += newPro;
                enterpriseCustomers += newEnterprise;

                // Handle upgrades and downgrades
                const starterUpgrade = starterCustomers * (inputs.upgradeRate / 100);
                const proUpgrade = proCustomers * (inputs.upgradeRate / 100);
                const proDowngrade = proCustomers * (inputs.downgradeRate / 100);
                const enterpriseDowngrade = enterpriseCustomers * (inputs.downgradeRate / 100);

                starterCustomers -= starterUpgrade;
                starterCustomers += proDowngrade;

                proCustomers += starterUpgrade;
                proCustomers -= proUpgrade;
                proCustomers -= proDowngrade;
                proCustomers += enterpriseDowngrade;

                enterpriseCustomers += proUpgrade;
                enterpriseCustomers -= enterpriseDowngrade;

                // Apply churn (use modified churn rate)
                starterCustomers *= (1 - starterMod.churn / 100);
                proCustomers *= (1 - proMod.churn / 100);
                enterpriseCustomers *= (1 - enterpriseMod.churn / 100);

                // Calculate revenue using modified prices
                const starterRevenue = starterCustomers * starterMod.price;
                const proRevenue = proCustomers * proMod.price;
                const enterpriseRevenue = enterpriseCustomers * enterpriseMod.price;

                // Add managed services fees if applicable
                let totalRevenue = starterRevenue + proRevenue + enterpriseRevenue;
                if (starterMod.additionalMRR > 0) {
                    totalRevenue += (starterCustomers + proCustomers + enterpriseCustomers) * starterMod.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    starterCustomers: Math.round(starterCustomers),
                    proCustomers: Math.round(proCustomers),
                    enterpriseCustomers: Math.round(enterpriseCustomers),
                    starterRevenue: starterRevenue,
                    proRevenue: proRevenue,
                    enterpriseRevenue: enterpriseRevenue,
                    totalRevenue: totalRevenue,
                    totalCustomers: Math.round(starterCustomers + proCustomers + enterpriseCustomers),
                    // Include modifier info
                    appliedChurnRate: starterMod.churn
                });
            }

            return results;
        }
    },
    'per-seat': {
        name: 'Per-Seat/Per-User',
        inputs: [
            { name: 'pricePerSeat', label: 'Price per Seat per Month (R)', type: 'currency', default: 150, min: 0, step: 50, hint: 'Price charged per user/seat' },
            { name: 'avgSeats', label: 'Avg Seats per Customer at Signup', type: 'number', default: 3, min: 1, step: 1, hint: 'Initial team size for new customers' },
            { name: 'seatExpansion', label: 'Seat Expansion Rate (% monthly)', type: 'percent', default: 3, min: 0, max: 100, step: 0.1, hint: 'Team growth rate within existing customers' },
            { name: 'customerChurn', label: 'Customer Churn Rate (%)', type: 'percent', default: 4, min: 0, max: 100, step: 0.1, hint: 'Account-level churn rate' },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 8, min: 0, step: 1, hint: 'New accounts (not seats) per month' },
            { name: 'startingCustomers', label: 'Starting Customer Base', type: 'number', default: 0, min: 0, step: 1, hint: 'Number of existing customers at start' },
            { name: 'cac', label: 'Customer Acquisition Cost (R)', type: 'currency', default: 1500, min: 0, step: 100, hint: 'Cost to acquire one account' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.pricePerSeat,
                inputs.customerChurn,
                inputs.cac
            );

            const results = [];
            let customers = inputs.startingCustomers || 0;
            let totalSeats = customers * inputs.avgSeats;

            for (let month = 0; month < months; month++) {
                // Add new customers with their initial seats
                customers += inputs.newCustomers;
                totalSeats += inputs.newCustomers * inputs.avgSeats;

                // Expand seats for existing customers
                totalSeats = totalSeats * (1 + inputs.seatExpansion / 100);

                // Apply customer churn (seats churn with customers) - use modified churn rate
                const avgSeatsPerCustomer = customers > 0 ? totalSeats / customers : inputs.avgSeats;
                const churnedCustomers = customers * (modifiers.churn / 100);
                const churnedSeats = churnedCustomers * avgSeatsPerCustomer;

                customers -= churnedCustomers;
                totalSeats -= churnedSeats;

                // Calculate revenue using modified price
                let revenue = totalSeats * modifiers.price;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    revenue += customers * modifiers.additionalMRR;
                }

                const seatsPerCustomer = customers > 0 ? totalSeats / customers : inputs.avgSeats;
                const revenuePerCustomer = customers > 0 ? revenue / customers : 0;

                results.push({
                    month: month + 1,
                    customers: Math.round(customers),
                    totalSeats: Math.round(totalSeats),
                    avgSeatsPerCustomer: seatsPerCustomer,
                    revenue: revenue,
                    revenuePerCustomer: revenuePerCustomer,
                    // Include modifier info for debugging/display
                    appliedPricePerSeat: modifiers.price,
                    appliedChurnRate: modifiers.churn
                });
            }

            return results;
        }
    },
    'retainer': {
        name: 'Retainer Agreements',
        inputs: [
            { name: 'retainerFee', label: 'Monthly Retainer Fee (R)', type: 'currency', default: 25000, min: 0, step: 5000 },
            { name: 'newClients', label: 'New Clients per Month', type: 'number', default: 1, min: 0, step: 1 },
            { name: 'clientChurn', label: 'Client Churn Rate (%)', type: 'percent', default: 10, min: 0, max: 100, step: 0.1 },
            { name: 'priceIncrease', label: 'Annual Price Increase (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1 },
            { name: 'overage', label: 'Avg Overage Revenue per Client (R)', type: 'currency', default: 3000, min: 0, step: 500 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.retainerFee,
                inputs.clientChurn,
                0  // No CAC in this model
            );

            const results = [];
            let clients = 0;
            let avgRetainerFee = modifiers.price;

            for (let month = 0; month < months; month++) {
                // Add new clients
                clients += inputs.newClients;

                // Apply churn
                const churnedClients = clients * (modifiers.churn / 100);
                clients -= churnedClients;

                // Apply annual price increase (every 12 months)
                if (month > 0 && month % 12 === 0) {
                    avgRetainerFee = avgRetainerFee * (1 + inputs.priceIncrease / 100);
                }

                const retainerRevenue = clients * avgRetainerFee;
                const overageRevenue = clients * inputs.overage;
                let totalRevenue = retainerRevenue + overageRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += clients * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    clients: Math.round(clients),
                    retainerRevenue: retainerRevenue,
                    overageRevenue: overageRevenue,
                    totalRevenue: totalRevenue,
                    mrr: totalRevenue,
                    arr: totalRevenue * 12,
                    revenuePerCustomer: clients > 0 ? totalRevenue / clients : 0
                });
            }

            return results;
        }
    },
    'managed-services': {
        name: 'Managed Services',
        inputs: [
            { name: 'baseServiceFee', label: 'Base Service Fee per Month (R)', type: 'currency', default: 50000, min: 0, step: 5000 },
            { name: 'newAccounts', label: 'New Accounts per Month', type: 'number', default: 1, min: 0, step: 1 },
            { name: 'accountChurn', label: 'Account Churn Rate (%)', type: 'percent', default: 8, min: 0, max: 100, step: 0.1 },
            { name: 'expansionRate', label: 'Monthly Account Expansion (%)', type: 'percent', default: 3, min: 0, max: 100, step: 0.1 },
            { name: 'setupFee', label: 'One-Time Setup Fee (R)', type: 'currency', default: 25000, min: 0, step: 5000 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.baseServiceFee,
                inputs.accountChurn,
                0  // No CAC in this model
            );

            const results = [];
            let accounts = 0;
            let avgServiceFee = modifiers.price;

            for (let month = 0; month < months; month++) {
                // Add new accounts
                accounts += inputs.newAccounts;
                const setupRevenue = inputs.newAccounts * inputs.setupFee;

                // Apply expansion to service fees
                avgServiceFee = avgServiceFee * (1 + inputs.expansionRate / 100);

                // Apply churn
                const churnedAccounts = accounts * (modifiers.churn / 100);
                accounts -= churnedAccounts;

                const recurringRevenue = accounts * avgServiceFee;
                let totalRevenue = recurringRevenue + setupRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += accounts * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    activeAccounts: Math.round(accounts),
                    recurringRevenue: recurringRevenue,
                    setupRevenue: setupRevenue,
                    totalRevenue: totalRevenue,
                    mrr: recurringRevenue,
                    arr: recurringRevenue * 12,
                    revenuePerCustomer: accounts > 0 ? recurringRevenue / accounts : 0
                });
            }

            return results;
        }
    },
    'pay-per-transaction': {
        name: 'Pay-Per-Transaction',
        inputs: [
            { name: 'feePerTransaction', label: 'Fee per Transaction (R)', type: 'currency', default: 10, min: 0, step: 5 },
            { name: 'transactionsMonth1', label: 'Transactions in Month 1', type: 'number', default: 500, min: 0, step: 10 },
            { name: 'transactionGrowth', label: 'Transaction Growth (% monthly)', type: 'percent', default: 10, min: 0, max: 100, step: 0.1 },
            { name: 'activeCustomers', label: 'Active Customers Month 1', type: 'number', default: 20, min: 0, step: 1 },
            { name: 'customerGrowth', label: 'Customer Growth (% monthly)', type: 'percent', default: 8, min: 0, max: 100, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.feePerTransaction,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            let transactions = inputs.transactionsMonth1;
            let customers = inputs.activeCustomers;

            for (let month = 0; month < months; month++) {
                let revenue = transactions * modifiers.price;
                const transactionsPerCustomer = customers > 0 ? transactions / customers : 0;
                const revenuePerCustomer = customers > 0 ? revenue / customers : 0;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    revenue += customers * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    transactions: Math.round(transactions),
                    customers: Math.round(customers),
                    revenue: revenue,
                    volume: transactions,
                    transactionsPerCustomer: transactionsPerCustomer,
                    revenuePerCustomer: revenuePerCustomer
                });

                // Apply growth for next month
                transactions = transactions * (1 + inputs.transactionGrowth / 100);
                customers = customers * (1 + inputs.customerGrowth / 100);
            }

            return results;
        }
    },
    'credits-token': {
        name: 'Credits/Token System',
        inputs: [
            { name: 'pricePerCredit', label: 'Price per Credit (R)', type: 'currency', default: 1.00, min: 0, step: 0.10 },
            { name: 'avgPurchaseSize', label: 'Avg Credits Purchased per Transaction', type: 'number', default: 50, min: 0, step: 10 },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 50, min: 0, step: 1 },
            { name: 'purchaseFrequency', label: 'Purchases per Customer per Month', type: 'number', default: 2, min: 0, step: 0.1 },
            { name: 'customerChurn', label: 'Customer Churn Rate (%)', type: 'percent', default: 15, min: 0, max: 100, step: 0.1 },
            { name: 'usageGrowth', label: 'Credit Usage Growth per Customer (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.pricePerCredit,
                inputs.customerChurn,
                0  // No CAC in this model
            );

            const results = [];
            let customers = 0;
            let avgCreditsPerPurchase = inputs.avgPurchaseSize;

            for (let month = 0; month < months; month++) {
                // Add new customers
                customers += inputs.newCustomers;

                // Apply churn
                const churnedCustomers = customers * (modifiers.churn / 100);
                customers -= churnedCustomers;

                // Apply usage growth
                avgCreditsPerPurchase = avgCreditsPerPurchase * (1 + inputs.usageGrowth / 100);

                // Calculate revenue
                const totalPurchases = customers * inputs.purchaseFrequency;
                const totalCredits = totalPurchases * avgCreditsPerPurchase;
                let revenue = totalCredits * modifiers.price;
                const revenuePerCustomer = customers > 0 ? revenue / customers : 0;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    revenue += customers * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    customers: Math.round(customers),
                    totalPurchases: Math.round(totalPurchases),
                    totalCredits: Math.round(totalCredits),
                    revenue: revenue,
                    usage: totalCredits,
                    volume: totalCredits,
                    revenuePerCustomer: revenuePerCustomer
                });
            }

            return results;
        }
    },
    'time-materials': {
        name: 'Time and Materials (Hourly)',
        inputs: [
            { name: 'hourlyRate', label: 'Average Hourly Rate (R)', type: 'currency', default: 800, min: 0, step: 100 },
            { name: 'billableResources', label: 'Billable Resources (People)', type: 'number', default: 2, min: 0, step: 1 },
            { name: 'utilization', label: 'Utilization Rate (%)', type: 'percent', default: 75, min: 0, max: 100, step: 1 },
            { name: 'hoursPerMonth', label: 'Work Hours per Month per Person', type: 'number', default: 160, min: 0, step: 10 },
            { name: 'resourceGrowth', label: 'Resource Growth (% monthly)', type: 'percent', default: 2, min: 0, max: 100, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.hourlyRate,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            let resources = inputs.billableResources;

            for (let month = 0; month < months; month++) {
                const billableHours = resources * inputs.hoursPerMonth * (inputs.utilization / 100);
                const revenue = billableHours * modifiers.price;
                const revenuePerResource = resources > 0 ? revenue / resources : 0;

                results.push({
                    month: month + 1,
                    resources: Math.round(resources),
                    billableHours: Math.round(billableHours),
                    revenue: revenue,
                    activeProjects: Math.round(resources * 0.4), // Estimate ~2.5 resources per project
                    utilization: inputs.utilization,
                    revenuePerResource: revenuePerResource
                });

                // Apply resource growth for next month
                resources = resources * (1 + inputs.resourceGrowth / 100);
            }

            return results;
        }
    },
    'fixed-price': {
        name: 'Fixed-Price Projects',
        inputs: [
            { name: 'avgProjectValue', label: 'Average Project Value (R)', type: 'currency', default: 200000, min: 0, step: 10000 },
            { name: 'projectsPerMonth', label: 'New Projects per Month', type: 'number', default: 1, min: 0, step: 1 },
            { name: 'projectDuration', label: 'Average Project Duration (months)', type: 'number', default: 3, min: 1, step: 1 },
            { name: 'upfrontPayment', label: 'Upfront Payment (%)', type: 'percent', default: 30, min: 0, max: 100, step: 5 },
            { name: 'projectGrowth', label: 'Project Win Rate Growth (%)', type: 'percent', default: 5, min: 0, max: 100, step: 1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.avgProjectValue,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            const activeProjects = [];
            let projectsPerMonth = inputs.projectsPerMonth;

            for (let month = 0; month < months; month++) {
                // Add new projects
                for (let i = 0; i < Math.round(projectsPerMonth); i++) {
                    activeProjects.push({
                        startMonth: month,
                        value: modifiers.price,
                        duration: inputs.projectDuration,
                        upfront: modifiers.price * (inputs.upfrontPayment / 100),
                        monthly: modifiers.price * (1 - inputs.upfrontPayment / 100) / inputs.projectDuration
                    });
                }

                // Calculate revenue from active projects
                let upfrontRevenue = 0;
                let recurringRevenue = 0;
                let activeCount = 0;

                activeProjects.forEach(project => {
                    const projectAge = month - project.startMonth;
                    if (projectAge === 0) {
                        upfrontRevenue += project.upfront;
                    }
                    if (projectAge >= 0 && projectAge < project.duration) {
                        recurringRevenue += project.monthly;
                        activeCount++;
                    }
                });

                const totalRevenue = upfrontRevenue + recurringRevenue;

                results.push({
                    month: month + 1,
                    activeProjects: activeCount,
                    upfrontRevenue: upfrontRevenue,
                    recurringRevenue: recurringRevenue,
                    revenue: totalRevenue,
                    newProjects: Math.round(projectsPerMonth)
                });

                // Apply growth
                projectsPerMonth = projectsPerMonth * (1 + inputs.projectGrowth / 100);
            }

            return results;
        }
    },
    'outcome-based': {
        name: 'Outcome-Based/Milestone',
        inputs: [
            { name: 'baseProjectValue', label: 'Base Project Value (R)', type: 'currency', default: 400000, min: 0, step: 10000 },
            { name: 'milestones', label: 'Number of Milestones', type: 'number', default: 4, min: 1, step: 1 },
            { name: 'projectsPerMonth', label: 'New Projects per Month', type: 'number', default: 1, min: 0, step: 1 },
            { name: 'successBonus', label: 'Success Bonus (%)', type: 'percent', default: 20, min: 0, max: 100, step: 5 },
            { name: 'successRate', label: 'Milestone Success Rate (%)', type: 'percent', default: 85, min: 0, max: 100, step: 5 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.baseProjectValue,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            const activeProjects = [];

            for (let month = 0; month < months; month++) {
                // Add new projects
                for (let i = 0; i < inputs.projectsPerMonth; i++) {
                    activeProjects.push({
                        startMonth: month,
                        milestones: inputs.milestones,
                        valuePerMilestone: modifiers.price / inputs.milestones,
                        bonusPerMilestone: (modifiers.price * (inputs.successBonus / 100)) / inputs.milestones
                    });
                }

                // Calculate revenue from milestone completions
                let milestoneRevenue = 0;
                let bonusRevenue = 0;
                let activeCount = 0;
                let completedMilestones = 0;

                activeProjects.forEach(project => {
                    const projectAge = month - project.startMonth;
                    const milestoneDuration = 2; // Assume 2 months per milestone
                    const currentMilestone = Math.floor(projectAge / milestoneDuration);

                    if (currentMilestone < project.milestones && projectAge % milestoneDuration === 0 && projectAge > 0) {
                        milestoneRevenue += project.valuePerMilestone;
                        completedMilestones++;

                        // Success bonus
                        if (Math.random() * 100 < inputs.successRate) {
                            bonusRevenue += project.bonusPerMilestone;
                        }
                    }

                    if (currentMilestone < project.milestones) {
                        activeCount++;
                    }
                });

                const totalRevenue = milestoneRevenue + bonusRevenue;

                results.push({
                    month: month + 1,
                    activeProjects: activeCount,
                    milestoneRevenue: milestoneRevenue,
                    bonusRevenue: bonusRevenue,
                    revenue: totalRevenue,
                    completedMilestones: completedMilestones
                });
            }

            return results;
        }
    },
    'open-core': {
        name: 'Open Core',
        inputs: [
            { name: 'freeDownloads', label: 'Free Downloads per Month', type: 'number', default: 500, min: 0, step: 100 },
            { name: 'enterprisePrice', label: 'Enterprise License Price (R)', type: 'currency', default: 30000, min: 0, step: 5000 },
            { name: 'conversionRate', label: 'Free-to-Enterprise Conversion (%)', type: 'percent', default: 1, min: 0, max: 100, step: 0.1 },
            { name: 'supportPrice', label: 'Support/Service Add-on Price (R)', type: 'currency', default: 10000, min: 0, step: 1000 },
            { name: 'supportAttach', label: 'Support Attach Rate (%)', type: 'percent', default: 40, min: 0, max: 100, step: 1 },
            { name: 'churnRate', label: 'Enterprise Customer Churn (%)', type: 'percent', default: 8, min: 0, max: 100, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.enterprisePrice,
                inputs.churnRate,
                0  // No CAC in this model
            );

            const results = [];
            let freeUsers = 0;
            let paidCustomers = 0;

            for (let month = 0; month < months; month++) {
                // Add free users
                freeUsers += inputs.freeDownloads;

                // Convert free users to paid
                const newConversions = freeUsers * (inputs.conversionRate / 100);
                freeUsers -= newConversions;
                paidCustomers += newConversions;

                // Apply churn to paid customers
                const churnedCustomers = paidCustomers * (modifiers.churn / 100);
                paidCustomers -= churnedCustomers;

                // Calculate revenue
                const licenseRevenue = paidCustomers * modifiers.price / 12; // Monthly
                const supportRevenue = paidCustomers * (inputs.supportAttach / 100) * inputs.supportPrice / 12;
                let totalRevenue = licenseRevenue + supportRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += paidCustomers * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    freeUsers: Math.round(freeUsers),
                    paidUsers: Math.round(paidCustomers),
                    licenseRevenue: licenseRevenue,
                    supportRevenue: supportRevenue,
                    revenue: totalRevenue,
                    conversionRate: freeUsers > 0 ? (paidCustomers / (freeUsers + paidCustomers) * 100) : 0
                });
            }

            return results;
        }
    },
    'marketplace': {
        name: 'Marketplace/Platform Fee',
        inputs: [
            { name: 'transactionVolume', label: 'Monthly Transaction Volume (R)', type: 'currency', default: 500000, min: 0, step: 10000 },
            { name: 'takeRate', label: 'Platform Take Rate (%)', type: 'percent', default: 15, min: 0, max: 100, step: 0.5 },
            { name: 'volumeGrowth', label: 'Volume Growth (% monthly)', type: 'percent', default: 15, min: 0, max: 100, step: 1 },
            { name: 'activeBuyers', label: 'Active Buyers per Month', type: 'number', default: 100, min: 0, step: 10 },
            { name: 'activeSellers', label: 'Active Sellers per Month', type: 'number', default: 20, min: 0, step: 1 },
            { name: 'participantGrowth', label: 'Participant Growth (% monthly)', type: 'percent', default: 10, min: 0, max: 100, step: 1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            // Note: For percentage-based pricing, we apply modifiers to the transaction volume
            const modifiers = applyFrameworkModifiers(
                inputs.transactionVolume,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            let volume = modifiers.price;  // Modified transaction volume
            let buyers = inputs.activeBuyers;
            let sellers = inputs.activeSellers;

            for (let month = 0; month < months; month++) {
                let revenue = volume * (inputs.takeRate / 100);
                const avgTransactionSize = buyers > 0 ? volume / buyers : 0;

                // Add managed services fee if applicable
                const totalParticipants = buyers + sellers;
                if (modifiers.additionalMRR > 0) {
                    revenue += totalParticipants * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    transactionVolume: volume,
                    revenue: revenue,
                    activeBuyers: Math.round(buyers),
                    activeSellers: Math.round(sellers),
                    participants: Math.round(buyers + sellers),
                    volume: volume,
                    takeRate: inputs.takeRate,
                    avgTransactionSize: avgTransactionSize
                });

                // Apply growth for next month
                volume = volume * (1 + inputs.volumeGrowth / 100);
                buyers = buyers * (1 + inputs.participantGrowth / 100);
                sellers = sellers * (1 + inputs.participantGrowth / 100);
            }

            return results;
        }
    },
    'revenue-share': {
        name: 'Revenue Share Partnership',
        inputs: [
            { name: 'partnerRevenue', label: 'Partner Generated Revenue (R)', type: 'currency', default: 1000000, min: 0, step: 10000 },
            { name: 'sharePercentage', label: 'Your Share (%)', type: 'percent', default: 30, min: 0, max: 100, step: 1 },
            { name: 'revenueGrowth', label: 'Revenue Growth (% monthly)', type: 'percent', default: 8, min: 0, max: 100, step: 0.5 },
            { name: 'activePartners', label: 'Active Partners', type: 'number', default: 3, min: 0, step: 1 },
            { name: 'newPartnersPerMonth', label: 'New Partners per Month', type: 'number', default: 1, min: 0, step: 1 },
            { name: 'partnerChurn', label: 'Partner Churn Rate (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.5 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.partnerRevenue / inputs.activePartners,  // Revenue per partner
                inputs.partnerChurn,
                0  // No CAC in this model
            );

            const results = [];
            let partners = inputs.activePartners;
            let avgRevenuePerPartner = modifiers.price;

            for (let month = 0; month < months; month++) {
                // Add new partners
                partners += inputs.newPartnersPerMonth;

                // Apply churn
                const churnedPartners = partners * (modifiers.churn / 100);
                partners -= churnedPartners;

                // Apply revenue growth
                avgRevenuePerPartner = avgRevenuePerPartner * (1 + inputs.revenueGrowth / 100);

                const totalPartnerRevenue = partners * avgRevenuePerPartner;
                let yourRevenue = totalPartnerRevenue * (inputs.sharePercentage / 100);

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    yourRevenue += partners * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    activePartners: Math.round(partners),
                    totalPartnerRevenue: totalPartnerRevenue,
                    revenue: yourRevenue,
                    volume: totalPartnerRevenue,
                    participants: Math.round(partners),
                    revenuePerPartner: avgRevenuePerPartner
                });
            }

            return results;
        }
    },
    'advertising': {
        name: 'Advertising Supported',
        inputs: [
            { name: 'monthlyUsers', label: 'Monthly Active Users', type: 'number', default: 25000, min: 0, step: 1000 },
            { name: 'pageViewsPerUser', label: 'Page Views per User per Month', type: 'number', default: 20, min: 0, step: 1 },
            { name: 'cpm', label: 'CPM (Cost per 1000 impressions) (R)', type: 'currency', default: 30, min: 0, step: 10 },
            { name: 'userGrowth', label: 'User Growth (% monthly)', type: 'percent', default: 10, min: 0, max: 100, step: 1 },
            { name: 'premiumConversion', label: 'Premium Conversion Rate (%)', type: 'percent', default: 2, min: 0, max: 100, step: 0.1 },
            { name: 'premiumPrice', label: 'Premium Subscription Price (R)', type: 'currency', default: 50, min: 0, step: 10 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.cpm,  // CPM is the primary price input
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            let users = inputs.monthlyUsers;
            let premiumUsers = 0;

            for (let month = 0; month < months; month++) {
                // Convert free users to premium
                const newConversions = users * (inputs.premiumConversion / 100);
                users -= newConversions;
                premiumUsers += newConversions;

                // Calculate ad revenue from free users
                const impressions = users * inputs.pageViewsPerUser;
                const adRevenue = (impressions / 1000) * modifiers.price;

                // Calculate premium subscription revenue
                const premiumRevenue = premiumUsers * inputs.premiumPrice;

                let totalRevenue = adRevenue + premiumRevenue;
                const totalUsers = users + premiumUsers;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += totalUsers * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    freeUsers: Math.round(users),
                    premiumUsers: Math.round(premiumUsers),
                    totalUsers: Math.round(totalUsers),
                    impressions: Math.round(impressions),
                    adRevenue: adRevenue,
                    premiumRevenue: premiumRevenue,
                    revenue: totalRevenue,
                    volume: impressions,
                    participants: Math.round(totalUsers)
                });

                // Apply growth for next month (to free users)
                users = users * (1 + inputs.userGrowth / 100);
            }

            return results;
        }
    },
    'ela': {
        name: 'Enterprise License Agreement (ELA)',
        inputs: [
            { name: 'avgContractValue', label: 'Average Annual Contract Value (R)', type: 'currency', default: 2500000, min: 0, step: 100000 },
            { name: 'newDealsPerYear', label: 'New Deals per Year', type: 'number', default: 2, min: 0, step: 1 },
            { name: 'contractLength', label: 'Average Contract Length (years)', type: 'number', default: 3, min: 1, step: 1 },
            { name: 'renewalRate', label: 'Renewal Rate (%)', type: 'percent', default: 85, min: 0, max: 100, step: 1 },
            { name: 'annualIncrease', label: 'Annual Price Increase (%)', type: 'percent', default: 5, min: 0, max: 100, step: 1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.avgContractValue,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            const activeContracts = [];
            const dealsPerMonth = inputs.newDealsPerYear / 12;

            for (let month = 0; month < months; month++) {
                // Add new contracts (probabilistically based on deals per month)
                if (Math.random() < dealsPerMonth || (month % Math.floor(12 / inputs.newDealsPerYear) === 0)) {
                    activeContracts.push({
                        startMonth: month,
                        annualValue: modifiers.price,
                        monthlyValue: modifiers.price / 12,
                        lengthMonths: inputs.contractLength * 12
                    });
                }

                // Calculate revenue from active contracts
                let monthlyRevenue = 0;
                let activeCount = 0;

                activeContracts.forEach(contract => {
                    const contractAge = month - contract.startMonth;
                    const contractYear = Math.floor(contractAge / 12);

                    if (contractAge < contract.lengthMonths) {
                        // Apply annual price increase
                        const adjustedMonthly = contract.monthlyValue * Math.pow(1 + inputs.annualIncrease / 100, contractYear);
                        monthlyRevenue += adjustedMonthly;
                        activeCount++;
                    }
                    // Check for renewal at contract end
                    else if (contractAge === contract.lengthMonths && Math.random() * 100 < inputs.renewalRate) {
                        contract.lengthMonths += inputs.contractLength * 12;
                    }
                });

                results.push({
                    month: month + 1,
                    activeContracts: activeCount,
                    revenue: monthlyRevenue,
                    contractValue: monthlyRevenue * 12,
                    contractCount: activeCount,
                    avgContractSize: activeCount > 0 ? (monthlyRevenue * 12) / activeCount : 0,
                    renewalRate: inputs.renewalRate
                });
            }

            return results;
        }
    },
    'data-licensing': {
        name: 'Data Licensing',
        inputs: [
            { name: 'licensePrice', label: 'License Price per Customer (R)', type: 'currency', default: 250000, min: 0, step: 10000 },
            { name: 'newLicensesPerMonth', label: 'New Licenses per Month', type: 'number', default: 1, min: 0, step: 1 },
            { name: 'renewalPrice', label: 'Annual Renewal Price (R)', type: 'currency', default: 75000, min: 0, step: 10000 },
            { name: 'renewalRate', label: 'Renewal Rate (%)', type: 'percent', default: 90, min: 0, max: 100, step: 1 },
            { name: 'usageFeePerQuery', label: 'Usage Fee per 1000 Queries (R)', type: 'currency', default: 500, min: 0, step: 100 },
            { name: 'avgQueriesPerCustomer', label: 'Avg Queries per Customer (1000s)', type: 'number', default: 50, min: 0, step: 5 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.licensePrice,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            const customers = [];

            for (let month = 0; month < months; month++) {
                // Add new customers
                for (let i = 0; i < inputs.newLicensesPerMonth; i++) {
                    customers.push({ startMonth: month });
                }

                // Calculate revenue
                let licenseRevenue = 0;
                let renewalRevenue = 0;
                let usageRevenue = 0;
                let activeCount = 0;

                customers.forEach(customer => {
                    const customerAge = month - customer.startMonth;

                    if (customerAge === 0) {
                        // Initial license fee
                        licenseRevenue += modifiers.price;
                        activeCount++;
                    } else if (customerAge % 12 === 0) {
                        // Annual renewal
                        if (Math.random() * 100 < inputs.renewalRate) {
                            renewalRevenue += inputs.renewalPrice;
                            activeCount++;
                        }
                    } else if (customerAge > 0) {
                        activeCount++;
                    }

                    // Usage fees (all active customers)
                    if (customerAge >= 0 && customerAge < 12 * 5) { // Active for up to 5 years
                        usageRevenue += inputs.avgQueriesPerCustomer * inputs.usageFeePerQuery;
                    }
                });

                let totalRevenue = licenseRevenue + renewalRevenue + usageRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += activeCount * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    activeCustomers: activeCount,
                    licenseRevenue: licenseRevenue,
                    renewalRevenue: renewalRevenue,
                    usageRevenue: usageRevenue,
                    revenue: totalRevenue,
                    contractCount: activeCount,
                    contractValue: totalRevenue
                });
            }

            return results;
        }
    },
    'white-label': {
        name: 'White Label/OEM',
        inputs: [
            { name: 'setupFee', label: 'Setup Fee per Partner (R)', type: 'currency', default: 500000, min: 0, step: 50000 },
            { name: 'monthlyFee', label: 'Monthly Platform Fee (R)', type: 'currency', default: 50000, min: 0, step: 10000 },
            { name: 'revenueShare', label: 'Revenue Share (%)', type: 'percent', default: 20, min: 0, max: 100, step: 1 },
            { name: 'avgPartnerRevenue', label: 'Avg Partner Revenue per Month (R)', type: 'currency', default: 250000, min: 0, step: 10000 },
            { name: 'newPartnersPerQuarter', label: 'New Partners per Quarter', type: 'number', default: 1, min: 0, step: 1 },
            { name: 'revenueGrowth', label: 'Partner Revenue Growth (% monthly)', type: 'percent', default: 5, min: 0, max: 100, step: 0.5 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.monthlyFee,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            const partners = [];

            for (let month = 0; month < months; month++) {
                // Add new partners (quarterly)
                if (month % 3 === 0) {
                    for (let i = 0; i < inputs.newPartnersPerQuarter; i++) {
                        partners.push({
                            startMonth: month,
                            monthlyRevenue: inputs.avgPartnerRevenue
                        });
                    }
                }

                // Calculate revenue
                let setupRevenue = 0;
                let platformRevenue = 0;
                let shareRevenue = 0;
                let activeCount = 0;

                partners.forEach(partner => {
                    const partnerAge = month - partner.startMonth;

                    if (partnerAge === 0) {
                        setupRevenue += inputs.setupFee;
                    }

                    if (partnerAge >= 0) {
                        activeCount++;
                        platformRevenue += modifiers.price;

                        // Revenue share grows over time
                        const grownRevenue = partner.monthlyRevenue * Math.pow(1 + inputs.revenueGrowth / 100, partnerAge);
                        shareRevenue += grownRevenue * (inputs.revenueShare / 100);
                    }
                });

                let totalRevenue = setupRevenue + platformRevenue + shareRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += activeCount * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    activePartners: activeCount,
                    setupRevenue: setupRevenue,
                    platformRevenue: platformRevenue,
                    shareRevenue: shareRevenue,
                    revenue: totalRevenue,
                    contractCount: activeCount,
                    contractValue: totalRevenue,
                    avgContractSize: activeCount > 0 ? totalRevenue / activeCount : 0
                });
            }

            return results;
        }
    }
};

