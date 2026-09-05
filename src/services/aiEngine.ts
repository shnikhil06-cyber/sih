import { MaterialCategory } from '../types';
import { INITIAL_MATERIALS } from './mockData';

export interface ClassificationResult {
  detectedCategory: MaterialCategory;
  confidenceScore: number; // 0 to 100
  alternativeSuggestions: { category: MaterialCategory; confidence: number }[];
  isLowConfidence: boolean;
}

export interface ValuationResult {
  minEstimate: number;
  maxEstimate: number;
  suggestedQuotedPrice: number;
  ratePerKg: number;
  marketTrendNote: string;
}

export interface AnomalyAnalysisResult {
  isAnomaly: boolean;
  expectedPrice: number;
  actualPrice: number;
  deviationPercent: number;
  severity: 'NORMAL' | 'WARNING' | 'CRITICAL';
  warningMessage: string;
}

export class AIEngine {
  /**
   * Simulates computer vision material classification on e-waste photo.
   * Can be seeded or random based on file name or selection.
   */
  static classifyPhoto(imageNameOrSeed?: string): ClassificationResult {
    let category: MaterialCategory = 'PCB';
    let confidence = 87;

    if (imageNameOrSeed) {
      const lower = imageNameOrSeed.toLowerCase();
      if (lower.includes('cable') || lower.includes('wire')) {
        category = 'Cable';
        confidence = 92;
      } else if (lower.includes('screen') || lower.includes('lcd') || lower.includes('monitor')) {
        category = 'LCD';
        confidence = 89;
      } else if (lower.includes('motor') || lower.includes('engine')) {
        category = 'Motor';
        confidence = 85;
      } else if (lower.includes('tv') || lower.includes('crt')) {
        category = 'CRT';
        confidence = 94;
      } else if (lower.includes('battery') || lower.includes('cell')) {
        category = 'Battery';
        confidence = 91;
      } else if (lower.includes('magnet')) {
        category = 'Magnet assembly';
        confidence = 78;
      } else if (lower.includes('plastic')) {
        category = 'Plastic';
        confidence = 82;
      } else if (lower.includes('fuzzy') || lower.includes('blur')) {
        category = 'PCB';
        confidence = 58; // Low confidence trigger!
      }
    }

    const isLowConfidence = confidence < 70;

    return {
      detectedCategory: category,
      confidenceScore: confidence,
      isLowConfidence,
      alternativeSuggestions: [
        { category: category === 'PCB' ? 'Cable' : 'PCB', confidence: 12 },
        { category: 'Plastic', confidence: 5 },
      ],
    };
  }

  /**
   * AI Valuation Engine:
   * Combines Material Base Rate x Weight x Condition Multiplier
   */
  static calculateValuation(
    category: MaterialCategory,
    weightKg: number,
    condition: 'Mixed' | 'Clean' | 'High Grade' | 'Damaged' = 'Mixed'
  ): ValuationResult {
    const matInfo = INITIAL_MATERIALS.find(m => m.id === category) || INITIAL_MATERIALS[0];
    let conditionMultiplier = 1.0;

    switch (condition) {
      case 'High Grade':
        conditionMultiplier = 1.08;
        break;
      case 'Clean':
        conditionMultiplier = 1.03;
        break;
      case 'Mixed':
        conditionMultiplier = 1.0;
        break;
      case 'Damaged':
        conditionMultiplier = 0.90;
        break;
    }

    const baseRate = matInfo.avgPricePerKg * conditionMultiplier;
    const minRate = matInfo.priceRange.min * conditionMultiplier;
    const maxRate = matInfo.priceRange.max * conditionMultiplier;

    const minEstimate = Math.round(minRate * weightKg);
    const maxEstimate = Math.round(maxRate * weightKg);
    const suggestedQuotedPrice = Math.round(baseRate * weightKg);

    return {
      minEstimate,
      maxEstimate,
      suggestedQuotedPrice,
      ratePerKg: Math.round(baseRate),
      marketTrendNote: `${matInfo.nameEn} prevailing market index is currently ⬆️ rising in Pune region.`,
    };
  }

  /**
   * Abnormal Transaction Detection Engine:
   * Calculates deviation percentage between expected valuation and actual recycler price.
   */
  static detectAbnormalTransaction(
    category: MaterialCategory,
    weightKg: number,
    actualTotalPrice: number
  ): AnomalyAnalysisResult {
    const valuation = this.calculateValuation(category, weightKg, 'Mixed');
    const expectedPrice = valuation.suggestedQuotedPrice;
    
    // Formula: Deviation % = ((Expected - Actual) / Expected) * 100
    const deviationPercent = Number((((expectedPrice - actualTotalPrice) / expectedPrice) * 100).toFixed(1));

    if (deviationPercent >= 20) {
      return {
        isAnomaly: true,
        expectedPrice,
        actualPrice: actualTotalPrice,
        deviationPercent,
        severity: deviationPercent >= 50 ? 'CRITICAL' : 'WARNING',
        warningMessage: `⚠️ Unusual transaction detected! Actual price (₹${actualTotalPrice.toLocaleString()}) is ${deviationPercent}% below the prevailing market value (₹${expectedPrice.toLocaleString()}). Potential unfair transaction.`,
      };
    }

    return {
      isAnomaly: false,
      expectedPrice,
      actualPrice: actualTotalPrice,
      deviationPercent,
      severity: 'NORMAL',
      warningMessage: '✓ Transaction price is within fair market range.',
    };
  }
}
