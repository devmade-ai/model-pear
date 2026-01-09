// ========== TESTING UTILITIES ==========
// Pre-defined test cases for validating intercompany model calculations.
// Each test case includes inputs, expected outputs, and tolerance for comparison.
//
// TEST CASE STRUCTURE:
// - id: Unique identifier for the test
// - name: Human-readable test name
// - description: What this test validates
// - businessRule: The accounting/tax rule being tested (explains WHY)
// - formula: Step-by-step calculation showing how expected values are derived
// - source: Reference to documentation or standard (CALCULATIONS.md, IAS 38, etc.)
// - modelId/variantId: Which model and variant to test
// - inputs: The input values to use
// - expected: The expected output values (nested by perspective)
// - tolerance: Acceptable variance for floating-point comparison (default 1%)

import { calculateIntercompany, DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from './registry.js';

// ========== TEST CASE DEFINITIONS ==========

/**
 * Test cases for Model 1: Cost-Plus Development Services
 *
 * Model 1 covers development services where the developer (your company) builds
 * software for a client and charges based on costs plus a markup.
 *
 * Key accounting treatments:
 * - Developer: Revenue = Cost + Markup, taxed at corporate rate
 * - Buyer: Capitalises development phase costs (IAS 38), expenses research phase
 * - Tax: Buyer gets Section 11(e) accelerated depreciation (SA Income Tax Act)
 */
const MODEL_1_TESTS = [
    {
        id: 'model1-1a-basic',
        name: 'Model 1A: Pure Cost Reimbursement - Basic',
        description: 'Verify zero markup calculation for pure cost reimbursement arrangement',
        businessRule: `
            In a pure cost reimbursement (Variant 1A), the developer charges exactly
            what it costs to build the software - no profit margin. This is typically
            used between related parties or as a loss-leader arrangement.

            Developer: Revenue equals total cost, profit is zero, no tax payable.
            Buyer: Capitalises development phase costs per IAS 38 (research is expensed).
        `,
        formula: `
            DEVELOPER SIDE:
            - Revenue = Development Cost = R1,000,000
            - Gross Profit = Revenue - Cost = R1,000,000 - R1,000,000 = R0
            - Margin = 0%
            - Tax Payable = R0 (no profit to tax)

            BUYER SIDE:
            - Research Phase (R200,000): Expensed immediately per IAS 38.54
            - Development Phase (R800,000): Capitalised as intangible asset per IAS 38.57
            - Annual Amortisation = R800,000 / 5 years = R160,000
        `,
        source: 'CALCULATIONS.md - Cost-Plus Formula; IAS 38.54-57 for capitalisation rules',
        modelId: 'model-1',
        variantId: '1A',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 1000000,
                'profit.gross': 0,
                'profit.margin': 0,
                'tax.taxPayable': 0
            },
            buyer: {
                'asset.capitalised': 800000,
                'asset.expensed': 200000,
                'asset.annualAmortisation': 160000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-1b-standard',
        name: 'Model 1B: Cost-Plus Fixed Margin - 10%',
        description: 'Verify standard cost-plus calculation with 10% markup (arm\'s length)',
        businessRule: `
            Cost-Plus with Fixed Margin (Variant 1B) is the standard arm's length
            arrangement. The developer charges costs plus a fixed percentage markup.

            A 10% markup is within the OECD transfer pricing safe harbour range
            (5-15% for routine services), so this should flag as LOW risk.

            Developer: Earns 10% margin, pays corporate tax on profit.
            Buyer: Capitalises the total amount paid (cost + markup) as the asset value.
        `,
        formula: `
            DEVELOPER SIDE:
            - Revenue = Cost × (1 + Markup%) = R1,000,000 × 1.10 = R1,100,000
            - Gross Profit = Revenue - Cost = R1,100,000 - R1,000,000 = R100,000
            - Margin = R100,000 / R1,000,000 = 10%
            - Tax Payable = Profit × Tax Rate = R100,000 × 27% = R27,000

            BUYER SIDE:
            - Capitalised Asset = Development Phase Cost to Buyer = R800,000
              (Note: Only development phase is capitalised, research is expensed)

            TRANSFER PRICING:
            - 10% markup is within OECD range (5-15%) = LOW risk
        `,
        source: 'CALCULATIONS.md - Cost-Plus Formula; OECD TP Guidelines Chapter II',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 1100000,
                'profit.gross': 100000,
                'profit.margin': 10,
                'tax.taxPayable': 27000
            },
            buyer: {
                'asset.capitalised': 800000
            },
            transferPricing: {
                'withinRange': true,
                'riskLevel': 'low'
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-1b-high-margin',
        name: 'Model 1B: Cost-Plus High Margin - 25%',
        description: 'Verify transfer pricing risk increases with high margin (above OECD range)',
        businessRule: `
            When markup exceeds the OECD safe harbour range (typically 5-15% for
            routine development services), transfer pricing risk increases.

            A 25% markup triggers HIGH risk because:
            - It exceeds typical arm's length benchmarks
            - May indicate profit shifting (especially between related parties)
            - Requires documentation to justify the premium
        `,
        formula: `
            DEVELOPER SIDE:
            - Revenue = R1,000,000 × 1.25 = R1,250,000
            - Gross Profit = R1,250,000 - R1,000,000 = R250,000
            - Margin = 25%

            TRANSFER PRICING:
            - OECD benchmark range for cost-plus: 5-15%
            - 25% > 15% upper bound = HIGH risk
            - withinRange = false (exceeds benchmark)
        `,
        source: 'OECD Transfer Pricing Guidelines; SARS Practice Note 7',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 25,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 1250000,
                'profit.gross': 250000,
                'profit.margin': 25
            },
            transferPricing: {
                'withinRange': false,
                'riskLevel': 'high'
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-1c-milestone',
        name: 'Model 1C: Cost-Plus with Milestone Bonus',
        description: 'Verify milestone bonus is probability-weighted and added to revenue',
        businessRule: `
            Variant 1C adds performance-based milestone bonuses on top of cost-plus.

            Accounting treatment (IFRS 15):
            - Variable consideration (milestone bonus) is included at the
              probability-weighted expected value
            - If 80% probability of achieving milestone, include 80% of bonus

            This tests that the calculator correctly probability-weights bonuses.
        `,
        formula: `
            DEVELOPER SIDE:
            Step 1: Base Revenue = Cost × (1 + Markup%)
                  = R1,000,000 × 1.10 = R1,100,000

            Step 2: Expected Milestone Bonus = Bonus × Probability
                  = R100,000 × 80% = R80,000

            Step 3: Total Revenue = Base + Expected Bonus
                  = R1,100,000 + R80,000 = R1,180,000

            Step 4: Gross Profit = Total Revenue - Cost
                  = R1,180,000 - R1,000,000 = R180,000
        `,
        source: 'IFRS 15.50-54 - Variable Consideration',
        modelId: 'model-1',
        variantId: '1C',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 10,
            milestoneBonus: 100000,
            milestoneProbability: 80,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 1180000,
                'profit.gross': 180000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-1d-fixed-price',
        name: 'Model 1D: Fixed Price Development',
        description: 'Verify fixed price contract with cost variance adjustment',
        businessRule: `
            Fixed Price (Variant 1D) shifts risk to the developer. The price is
            fixed upfront, but actual costs may vary.

            The "cost variance" input represents the expected deviation from
            estimated costs. A positive variance means costs will likely exceed
            estimates, reducing profit.

            This tests that profit is calculated as Fixed Price minus adjusted costs.
        `,
        formula: `
            DEVELOPER SIDE:
            Step 1: Fixed Price = R1,200,000 (locked in at contract)

            Step 2: Adjusted Cost = Estimated Cost × (1 + Variance%)
                  = R1,000,000 × (1 + 10%) = R1,100,000

            Step 3: Gross Profit = Fixed Price - Adjusted Cost
                  = R1,200,000 - R1,100,000 = R100,000

            Revenue = Fixed Price (regardless of actual costs)
        `,
        source: 'IFRS 15.35 - Performance Obligations Satisfied Over Time',
        modelId: 'model-1',
        variantId: '1D',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            fixedPrice: 1200000,
            estimatedCostVariance: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 1200000,
                'profit.gross': 100000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-1e-time-materials',
        name: 'Model 1E: Time and Materials',
        description: 'Verify T&M calculation where revenue derives from hours × rate',
        businessRule: `
            Time & Materials (Variant 1E) bills based on actual hours worked at
            a loaded hourly rate that includes markup.

            The hourly rate INCLUDES the markup, so:
            - Revenue = Hours × Loaded Rate
            - Cost = Revenue / (1 + Markup)
            - Profit = Revenue - Cost

            This is different from cost-plus where markup is applied TO cost.
        `,
        formula: `
            DEVELOPER SIDE:
            Step 1: Revenue = Hours × Hourly Rate
                  = 2,000 hours × R500/hr = R1,000,000

            Step 2: Cost = Revenue / (1 + Markup%)
                  = R1,000,000 / 1.25 = R800,000

            Step 3: Gross Profit = Revenue - Cost
                  = R1,000,000 - R800,000 = R200,000

            Step 4: Margin = Profit / Cost × 100
                  = R200,000 / R800,000 × 100 = 25%

            Note: The margin equals the hourlyMarkup input (25%) because the
            loaded rate is calculated as: Cost Rate × (1 + Markup)
        `,
        source: 'CALCULATIONS.md - Time & Materials Formula',
        modelId: 'model-1',
        variantId: '1E',
        inputs: {
            projectName: 'Test Project',
            developerHours: 2000,
            hourlyRate: 500,
            hourlyMarkup: 25,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 1000000,
                'profit.gross': 200000,
                'profit.margin': 25
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-1f-dedicated-team',
        name: 'Model 1F: Dedicated Development Team',
        description: 'Verify monthly retainer model with fixed team costs',
        businessRule: `
            Dedicated Team (Variant 1F) is a retainer arrangement where the
            buyer pays a fixed monthly fee for a dedicated development team.

            Revenue is predictable (retainer × months), while costs are the
            actual team cost per month. Profit is the spread between them.

            This model is common for ongoing development partnerships.
        `,
        formula: `
            DEVELOPER SIDE:
            Step 1: Revenue = Monthly Retainer × Contract Months
                  = R250,000/month × 12 months = R3,000,000

            Step 2: Cost = Monthly Team Cost × Contract Months
                  = R200,000/month × 12 months = R2,400,000

            Step 3: Gross Profit = Revenue - Cost
                  = R3,000,000 - R2,400,000 = R600,000

            Implicit Margin = R600,000 / R2,400,000 = 25%
        `,
        source: 'CALCULATIONS.md - Retainer Model',
        modelId: 'model-1',
        variantId: '1F',
        inputs: {
            projectName: 'Test Project',
            monthlyRetainer: 250000,
            contractMonths: 12,
            monthlyCost: 200000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 3000000,
                'profit.gross': 600000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-tax-calculation',
        name: 'Model 1B: Tax Calculation Verification',
        description: 'Verify corporate tax is calculated correctly on developer profit',
        businessRule: `
            South African corporate income tax (CIT) is levied on taxable income
            at a flat rate of 27% (since 2023 tax year).

            For the developer:
            - Taxable income = Gross profit (simplified; assumes no permanent differences)
            - Tax payable = Taxable income × 27%
            - Net profit = Gross profit - Tax payable

            This test verifies the full tax calculation chain.
        `,
        formula: `
            DEVELOPER SIDE:
            Step 1: Revenue = R500,000 × 1.20 = R600,000

            Step 2: Gross Profit = R600,000 - R500,000 = R100,000

            Step 3: Tax Payable = R100,000 × 27% = R27,000

            Step 4: Net Profit = R100,000 - R27,000 = R73,000
        `,
        source: 'SA Income Tax Act; CALCULATIONS.md - Tax Calculation',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 500000,
            researchPhaseCost: 100000,
            developmentPhaseCost: 400000,
            markupPercentage: 20,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 600000,
                'profit.gross': 100000,
                'tax.taxPayable': 27000,
                'profit.net': 73000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-buyer-amortisation',
        name: 'Model 1B: Buyer Amortisation Schedule',
        description: 'Verify accounting amortisation vs tax depreciation for buyer',
        businessRule: `
            The buyer has two different depreciation schedules:

            1. ACCOUNTING (IAS 38): Amortise over useful life (e.g., 4 years)
               - Annual amortisation = Asset value / Useful life

            2. TAX (Section 11(e)): Accelerated depreciation
               - PC software: 2 years (50% per year)
               - Mainframe: 5 years (20% per year)

            The difference creates a timing difference for deferred tax.
        `,
        formula: `
            BUYER SIDE:
            Asset Value (Capitalised) = R1,000,000 (development phase only)

            ACCOUNTING AMORTISATION:
            - Useful life = 4 years
            - Annual amortisation = R1,000,000 / 4 = R250,000

            TAX DEPRECIATION (Section 11(e) PC - 2 year):
            - Write-off period = 2 years
            - Annual deduction = R1,000,000 / 2 = R500,000
        `,
        source: 'IAS 38.97-99; SA Income Tax Act Section 11(e)',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 0,
            developmentPhaseCost: 1000000,
            markupPercentage: 10,
            usefulLife: 4,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            buyer: {
                'asset.capitalised': 1000000,
                'asset.usefulLife': 4,
                'asset.annualAmortisation': 250000,
                'asset.section11eYears': 2,
                'tax.section11eDeduction': 500000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-deferred-tax',
        name: 'Model 1B: Deferred Tax Calculation',
        description: 'Verify deferred tax liability from timing differences',
        businessRule: `
            DEFERRED TAX arises when accounting treatment differs from tax treatment.

            For software:
            - Accounting: Amortise over useful life (e.g., 5 years = R200,000/year)
            - Tax: Section 11(e) accelerated (2 years = R500,000/year)

            In Year 1, tax deduction (R500,000) exceeds accounting expense (R200,000).
            This TIMING DIFFERENCE of R300,000 will reverse in later years.

            The deferred tax LIABILITY = Timing difference × Tax rate
            (It's a liability because we've claimed more tax upfront than accounting
            expense, so we "owe" this tax benefit back in future years)
        `,
        formula: `
            BUYER SIDE - YEAR 1:
            Step 1: Accounting Amortisation = R1,000,000 / 5 years = R200,000

            Step 2: Tax Deduction (s11e) = R1,000,000 / 2 years = R500,000

            Step 3: Timing Difference = Accounting - Tax = R200,000 - R500,000 = -R300,000
                    (Negative = tax deduction exceeds accounting expense)

            Step 4: Deferred Tax Liability = |R300,000| × 27% = R81,000
                    (Liability because we claimed more tax upfront)

            This liability will reverse in years 3-5 when accounting expense
            continues but tax deduction has been fully claimed.
        `,
        source: 'IAS 12 - Income Taxes; SA Income Tax Act Section 11(e)',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 0,
            developmentPhaseCost: 1000000,
            markupPercentage: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            buyer: {
                'tax.accountingAmortisation': 200000,
                'tax.section11eDeduction': 500000,
                'tax.timingDifference': -300000,
                'tax.deferredTaxLiability': 81000
            }
        },
        tolerance: 0.01
    }
];

/**
 * Test cases for Model 2: Software Licence with Royalties
 *
 * Model 2 covers licensing arrangements where the developer retains IP ownership
 * and grants the buyer a licence to use the software, often with ongoing royalties.
 */
const MODEL_2_TESTS = [
    {
        id: 'model2-2a-basic',
        name: 'Model 2A: Basic Perpetual Licence',
        description: 'Verify perpetual licence with upfront fee plus ongoing royalties',
        businessRule: `
            In a perpetual licence (Variant 2A):
            - Developer retains IP ownership
            - Buyer pays upfront licence fee for perpetual use rights
            - Buyer pays ongoing royalties based on their revenue from the software

            Developer Revenue = Upfront Fee + (Buyer Revenue × Royalty Rate)

            This is common for software products where the developer wants to
            retain ownership while monetising through licensing.
        `,
        formula: `
            DEVELOPER SIDE:
            Step 1: Upfront Licence Fee = R500,000 (one-time)

            Step 2: Annual Royalty = Buyer Revenue × Royalty Rate
                  = R2,000,000 × 10% = R200,000

            Step 3: Total Revenue (Year 1) = Upfront + Royalty
                  = R500,000 + R200,000 = R700,000

            Note: In subsequent years, only royalty applies (no upfront fee).
        `,
        source: 'CALCULATIONS.md - Licence Royalty Formula; IFRS 15.B63',
        modelId: 'model-2',
        variantId: '2A',
        inputs: {
            projectName: 'Software Licence',
            upfrontLicenceFee: 500000,
            developmentCost: 200000,
            annualRoyaltyRate: 10,
            estimatedBuyerRevenue: 2000000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 700000
            }
        },
        tolerance: 0.05
    }
];

/**
 * Test cases for Model 3: Joint Development / Cost-Sharing
 *
 * Model 3 covers joint development arrangements where both parties contribute
 * to development and share ownership proportionally.
 */
const MODEL_3_TESTS = [
    {
        id: 'model3-3a-equal-split',
        name: 'Model 3A: Equal Cost-Sharing',
        description: 'Verify 50/50 cost sharing results in 50/50 ownership',
        businessRule: `
            In a Cost-Sharing Arrangement (Variant 3A):
            - Both parties contribute to development costs
            - Ownership is proportional to contribution
            - Each party can use the IP within their territory/market

            Ownership % = Party Contribution / Total Contribution × 100

            This is common for joint ventures or co-development partnerships.
            OECD guidelines require contributions to be commensurate with
            expected benefits (the "commensurate with income" principle).
        `,
        formula: `
            OWNERSHIP CALCULATION:
            Total Development Cost = R1,000,000

            Developer Contribution = R500,000
            Developer Ownership = R500,000 / R1,000,000 × 100 = 50%

            Buyer Contribution = R500,000
            Buyer Ownership = R500,000 / R1,000,000 × 100 = 50%

            Each party capitalises their contribution as an intangible asset
            and recognises their share of future economic benefits.
        `,
        source: 'OECD TP Guidelines Chapter VIII; IAS 38.24',
        modelId: 'model-3',
        variantId: '3A',
        inputs: {
            projectName: 'Joint Project',
            totalDevelopmentCost: 1000000,
            developerContribution: 500000,
            buyerContribution: 500000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'ownership.percentage': 50
            },
            buyer: {
                'ownership.percentage': 50
            }
        },
        tolerance: 0.01
    }
];

/**
 * Test cases for edge cases and boundary conditions
 *
 * These tests verify the calculator handles unusual inputs correctly:
 * - Zero values
 * - Extreme values
 * - Non-standard configurations
 */
const EDGE_CASE_TESTS = [
    {
        id: 'edge-zero-cost',
        name: 'Edge Case: Zero Development Cost',
        description: 'Verify handling of zero cost input (no division by zero errors)',
        businessRule: `
            Edge case: What happens when development cost is zero?
            - This shouldn't happen in practice but tests error handling
            - All derived values should be zero
            - No division by zero or NaN errors

            This is a DEFENSIVE test to ensure the calculator doesn't crash.
        `,
        formula: `
            With Cost = R0:
            - Revenue = R0 × 1.10 = R0
            - Profit = R0 - R0 = R0
            - Tax = R0 × 27% = R0
            - Capitalised Asset = R0
            - Amortisation = R0 / 5 = R0
        `,
        source: 'Defensive programming - boundary condition test',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 0,
            researchPhaseCost: 0,
            developmentPhaseCost: 0,
            markupPercentage: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 0,
                'profit.gross': 0,
                'tax.taxPayable': 0
            },
            buyer: {
                'asset.capitalised': 0,
                'asset.annualAmortisation': 0
            }
        },
        tolerance: 0.01
    },
    {
        id: 'edge-100-margin',
        name: 'Edge Case: 100% Markup',
        description: 'Verify extreme margin triggers transfer pricing high risk',
        businessRule: `
            Edge case: What happens with a 100% markup?
            - Revenue = 2× cost (doubling)
            - This FAR exceeds arm's length benchmarks
            - Must trigger HIGH transfer pricing risk

            OECD benchmarks for cost-plus services: 5-15%
            100% is 6-7× the upper bound, which is a clear red flag.
        `,
        formula: `
            DEVELOPER SIDE:
            - Revenue = R1,000,000 × 2.00 = R2,000,000
            - Profit = R2,000,000 - R1,000,000 = R1,000,000
            - Margin = 100%

            TRANSFER PRICING:
            - Benchmark upper bound = 15%
            - Actual margin = 100%
            - 100% >> 15% = HIGH RISK
            - withinRange = false
        `,
        source: 'OECD TP Guidelines - arm\'s length principle',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 100,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 2000000,
                'profit.gross': 1000000,
                'profit.margin': 100
            },
            transferPricing: {
                'withinRange': false,
                'riskLevel': 'high'
            }
        },
        tolerance: 0.01
    },
    {
        id: 'edge-mainframe-depreciation',
        name: 'Edge Case: 5-Year Mainframe Depreciation',
        description: 'Verify 5-year Section 11(e) calculation for mainframe software',
        businessRule: `
            Section 11(e) of the SA Income Tax Act provides two write-off periods:
            - PC software: 2 years (50% per year)
            - Mainframe software: 5 years (20% per year)

            This tests the mainframe option, which has slower tax depreciation.

            The timing difference with accounting will be different because
            tax deduction (5 years) may match accounting amortisation more closely.
        `,
        formula: `
            BUYER SIDE:
            Asset = R1,000,000

            TAX DEPRECIATION (Section 11(e) Mainframe):
            - Write-off period = 5 years
            - Annual deduction = R1,000,000 / 5 = R200,000

            Compare to PC software which would be R500,000/year (2 years).
        `,
        source: 'SA Income Tax Act Section 11(e) - Mainframe software',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Mainframe System',
            developmentCost: 1000000,
            researchPhaseCost: 0,
            developmentPhaseCost: 1000000,
            markupPercentage: 10,
            usefulLife: 10,
            section11eType: 'mainframe-5yr',
            corporateTaxRate: 27
        },
        expected: {
            buyer: {
                'asset.section11eYears': 5,
                'tax.section11eDeduction': 200000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'edge-custom-tax-rate',
        name: 'Edge Case: Custom Tax Rate (25%)',
        description: 'Verify calculation works with non-default tax rate',
        businessRule: `
            The default SA corporate tax rate is 27%, but users can override this.

            This tests that the calculator correctly uses the input tax rate
            rather than hardcoding 27%.

            Use cases:
            - Different jurisdictions (e.g., Mauritius at 15%)
            - Historical calculations (SA was 28% before 2023)
            - Future changes
        `,
        formula: `
            DEVELOPER SIDE (with 25% tax rate):
            Step 1: Revenue = R1,000,000 × 1.10 = R1,100,000
            Step 2: Profit = R1,100,000 - R1,000,000 = R100,000
            Step 3: Tax = R100,000 × 25% = R25,000 (not R27,000!)
            Step 4: Net Profit = R100,000 - R25,000 = R75,000
        `,
        source: 'Configurable tax rate test',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 25
        },
        expected: {
            developer: {
                'revenue.total': 1100000,
                'profit.gross': 100000,
                'tax.taxPayable': 25000,
                'profit.net': 75000
            }
        },
        tolerance: 0.01
    }
];

// ========== ALL TEST CASES ==========

export const ALL_TEST_CASES = [
    ...MODEL_1_TESTS,
    ...MODEL_2_TESTS,
    ...MODEL_3_TESTS,
    ...EDGE_CASE_TESTS
];

// ========== TEST RUNNER ==========

/**
 * Get nested value from object using dot notation
 * e.g., getNestedValue(obj, 'developer.revenue.total')
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
}

/**
 * Compare two values with tolerance for numeric values
 */
function compareValues(actual, expected, tolerance = 0.01) {
    if (typeof expected === 'number' && typeof actual === 'number') {
        if (expected === 0) {
            return Math.abs(actual) < tolerance;
        }
        const diff = Math.abs(actual - expected) / Math.abs(expected);
        return diff <= tolerance;
    }
    if (typeof expected === 'boolean') {
        return actual === expected;
    }
    if (typeof expected === 'string') {
        return actual === expected;
    }
    return actual === expected;
}

/**
 * Run a single test case
 * @param {Object} testCase - Test case definition
 * @param {Object} entityConfig - Entity configuration (optional)
 * @param {Object} taxParams - Tax parameters (optional)
 * @returns {Object} Test result with pass/fail status and details
 */
export function runTest(testCase, entityConfig = DEFAULT_ENTITY_CONFIG, taxParams = DEFAULT_TAX_PARAMS) {
    const startTime = performance.now();

    const result = {
        id: testCase.id,
        name: testCase.name,
        description: testCase.description,
        businessRule: testCase.businessRule,
        formula: testCase.formula,
        source: testCase.source,
        modelId: testCase.modelId,
        variantId: testCase.variantId,
        passed: true,
        assertions: [],
        error: null,
        duration: 0
    };

    try {
        // Run the calculation
        const calcResult = calculateIntercompany(
            testCase.modelId,
            testCase.variantId,
            testCase.inputs,
            entityConfig,
            taxParams
        );

        // Check each expected value
        for (const [perspective, expectations] of Object.entries(testCase.expected)) {
            const perspectiveData = calcResult[perspective];

            if (!perspectiveData) {
                result.assertions.push({
                    path: perspective,
                    expected: 'exists',
                    actual: 'undefined',
                    passed: false,
                    message: `Perspective "${perspective}" not found in results`
                });
                result.passed = false;
                continue;
            }

            for (const [path, expectedValue] of Object.entries(expectations)) {
                const actualValue = getNestedValue(perspectiveData, path);
                const passed = compareValues(actualValue, expectedValue, testCase.tolerance);

                result.assertions.push({
                    path: `${perspective}.${path}`,
                    expected: expectedValue,
                    actual: actualValue,
                    passed: passed,
                    message: passed ? 'OK' : `Expected ${expectedValue}, got ${actualValue}`
                });

                if (!passed) {
                    result.passed = false;
                }
            }
        }

        // Store the full result for debugging
        result.calculationResult = calcResult;

    } catch (error) {
        result.passed = false;
        result.error = {
            message: error.message,
            stack: error.stack
        };
    }

    result.duration = performance.now() - startTime;
    return result;
}

/**
 * Run all test cases
 * @param {Array} testCases - Array of test cases (defaults to ALL_TEST_CASES)
 * @param {Object} options - Options for test run
 * @returns {Object} Summary of test results
 */
export function runAllTests(testCases = ALL_TEST_CASES, options = {}) {
    const startTime = performance.now();
    const results = [];

    const entityConfig = options.entityConfig || DEFAULT_ENTITY_CONFIG;
    const taxParams = options.taxParams || DEFAULT_TAX_PARAMS;

    for (const testCase of testCases) {
        const result = runTest(testCase, entityConfig, taxParams);
        results.push(result);
    }

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const errors = results.filter(r => r.error).length;

    return {
        summary: {
            total: results.length,
            passed,
            failed,
            errors,
            passRate: results.length > 0 ? (passed / results.length) * 100 : 0,
            duration: performance.now() - startTime
        },
        results,
        timestamp: new Date().toISOString()
    };
}

/**
 * Run tests for a specific model
 * @param {string} modelId - Model ID to test
 * @returns {Object} Test results for the model
 */
export function runModelTests(modelId) {
    const modelTests = ALL_TEST_CASES.filter(tc => tc.modelId === modelId);
    return runAllTests(modelTests);
}

/**
 * Get test cases grouped by model
 * @returns {Object} Test cases grouped by model ID
 */
export function getTestsByModel() {
    const grouped = {};
    for (const testCase of ALL_TEST_CASES) {
        if (!grouped[testCase.modelId]) {
            grouped[testCase.modelId] = [];
        }
        grouped[testCase.modelId].push(testCase);
    }
    return grouped;
}

/**
 * Get test case by ID
 * @param {string} testId - Test case ID
 * @returns {Object|null} Test case or null if not found
 */
export function getTestById(testId) {
    return ALL_TEST_CASES.find(tc => tc.id === testId) || null;
}

/**
 * Create a custom test case from inputs
 * @param {Object} config - Test case configuration
 * @returns {Object} Test case object
 */
export function createTestCase(config) {
    return {
        id: config.id || `custom-${Date.now()}`,
        name: config.name || 'Custom Test',
        description: config.description || '',
        businessRule: config.businessRule || '',
        formula: config.formula || '',
        source: config.source || '',
        modelId: config.modelId,
        variantId: config.variantId,
        inputs: config.inputs,
        expected: config.expected || {},
        tolerance: config.tolerance || 0.01
    };
}

// ========== EXPORTS ==========

export default {
    ALL_TEST_CASES,
    MODEL_1_TESTS,
    MODEL_2_TESTS,
    MODEL_3_TESTS,
    EDGE_CASE_TESTS,
    runTest,
    runAllTests,
    runModelTests,
    getTestsByModel,
    getTestById,
    createTestCase
};
