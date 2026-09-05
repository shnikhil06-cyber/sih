import { INITIAL_MATERIALS } from './mockData.js';

export class AIEngine {
  static classifyPhoto(imageNameOrSeed) {
    let category = 'PCB';
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
        confidence = 58;
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

  static calculateValuation(category, weightKg, condition = 'Mixed') {
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

  static detectAbnormalTransaction(category, weightKg, actualTotalPrice) {
    const valuation = this.calculateValuation(category, weightKg, 'Mixed');
    const expectedPrice = valuation.suggestedQuotedPrice;
    
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
