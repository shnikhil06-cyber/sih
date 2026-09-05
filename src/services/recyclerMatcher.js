import { VERIFIED_RECYCLERS_DATASET } from './mockData.js';
import { AIEngine } from './aiEngine.js';

export class RecyclerMatcher {
  static findBestRecyclers(category, weightKg, _userLocation = 'Pune') {
    const valuation = AIEngine.calculateValuation(category, weightKg);
    const basePricePerKg = valuation.ratePerKg;

    const matches = VERIFIED_RECYCLERS_DATASET.map(recycler => {
      const acceptsMaterial = recycler.materials_accepted.includes(category);
      if (!acceptsMaterial) return null;

      const quotedPricePerKg = Math.round(basePricePerKg * recycler.offered_rate_multiplier);
      const totalQuotedPrice = Math.round(quotedPricePerKg * weightKg);

      const distanceScore = Math.max(0, 100 - recycler.distanceKm * 4);
      const priceScore = Math.min(100, (recycler.offered_rate_multiplier / 1.08) * 100);
      const pickupBonus = recycler.pickup_available ? 25 : 0;
      const authBonus = recycler.authorization_status === 'Authorized' ? 30 : -50;
      const reliabilityScore = recycler.reliability_score;

      const finalScore = Math.round(
        (authBonus * 0.3) +
        (pickupBonus * 0.8) +
        (distanceScore * 0.2) +
        (priceScore * 0.25) +
        (reliabilityScore * 0.25)
      );

      let recommendationReason = '✅ Recommended (Authorized & Free Pickup)';
      if (!recycler.pickup_available) {
        recommendationReason = '⚠️ Higher rate offered, but no pickup service (Self-transport required).';
      }
      if (recycler.authorization_status === 'Unverified') {
        recommendationReason = '❌ Unverified scrap dealer. Not recommended by platform.';
      }

      return {
        recycler,
        distance: recycler.distanceKm,
        quotedPricePerKg,
        totalQuotedPrice,
        pickupAvailable: recycler.pickup_available,
        score: finalScore,
        recommendationReason,
      };
    })
    .filter(res => res !== null)
    .sort((a, b) => b.score - a.score);

    return matches;
  }
}
