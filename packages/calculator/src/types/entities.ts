/**
 * Entity configuration types
 * Defines the structure of developer and buyer entities
 */

import type { Percentage, Section11eType } from './common.js';

/**
 * Accounting framework used by an entity
 */
export type AccountingFramework = 'IFRS' | 'IFRS-SME' | 'GAAP';

/**
 * Developer entity configuration
 */
export interface DeveloperEntityConfig {
  name: string;
  jurisdiction: string;
  taxResident: boolean;
  corporateTaxRate: Percentage;
  accountingFramework: AccountingFramework;
}

/**
 * Buyer entity configuration
 */
export interface BuyerEntityConfig {
  name: string;
  jurisdiction: string;
  taxResident: boolean;
  corporateTaxRate: Percentage;
  accountingFramework: AccountingFramework;
  section11eType: Section11eType;
}

/**
 * Relationship configuration between entities
 */
export interface RelationshipConfig {
  /**
   * Whether entities share common ownership (related parties)
   * When true, transfer pricing compliance is more critical
   */
  mutualOwnership: boolean;

  /**
   * Whether parties are related for transfer pricing purposes
   * @deprecated Use mutualOwnership instead
   */
  relatedParties?: boolean;
}

/**
 * Complete entity configuration for a transaction
 */
export interface EntityConfig {
  developer: DeveloperEntityConfig;
  buyer: BuyerEntityConfig;
  relationship: RelationshipConfig;
}

/**
 * Default entity configuration for South African companies
 */
export const DEFAULT_ENTITY_CONFIG: EntityConfig = {
  developer: {
    name: 'Your Company',
    jurisdiction: 'South Africa',
    taxResident: true,
    corporateTaxRate: 27,
    accountingFramework: 'IFRS',
  },
  buyer: {
    name: 'Client',
    jurisdiction: 'South Africa',
    taxResident: true,
    corporateTaxRate: 27,
    accountingFramework: 'IFRS',
    section11eType: 'pc-2yr',
  },
  relationship: {
    mutualOwnership: false,
  },
};

/**
 * Tax parameters that can override entity defaults
 */
export interface TaxParams {
  corporateTaxRate?: Percentage;
  cgtInclusionRate?: Percentage;
  withholdingTaxRate?: Percentage;
}

/**
 * Default tax parameters for South Africa
 */
export const DEFAULT_TAX_PARAMS: TaxParams = {
  corporateTaxRate: 27,
  cgtInclusionRate: 80,
  withholdingTaxRate: 15,
};
