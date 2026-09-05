import { MaterialCategory, RecyclerMatchResult } from '../types';
import { VERIFIED_RECYCLERS_DATASET } from './mockData';
import { AIEngine } from './aiEngine';

export class RecyclerMatcher {
  /**
   * Ranks recyclers according to multi-factor Recycler Score Matrix.
   */
  static findBestRecyclers(
    category: MaterialCategory,
    weightKg: number,
    _userLocation: string = 'Pune'
  ): RecyclerMatchResult[] {
    const valuation = AIEngine.calculateValuation(category, weightKg);
    const basePricePerKg = valuation.ratePerKg;

    const matches: RecyclerMatchResult[] = VERIFIED_RECYCLERS_DATASET.map(recycler => {
      const acceptsMaterial = recycler.materials_accepted.includes(category);
      if (!acceptsMaterial) return null;

      // Price calculation
      const quotedPricePerKg = Math.round(basePricePerKg * recycler.offered_rate_multiplier);
      const totalQuotedPrice = Math.round(quotedPricePerKg * weightKg);

      // Scoring components (0 to 100)
      // 1. Distance Score: 100 - (Distance * 4) max drop
      const distanceScore = Math.max(0, 100 - recycler.distanceKm * 4);

      // 2. Price Score: (offered_rate_multiplier / 1.10) * 100
      const priceScore = Math.min(100, (recycler.offered_rate_multiplier / 1.08) * 100);

      // 3. Pickup Bonus: +25 points
      const pickupBonus = recycler.pickup_available ? 25 : 0;

      // 4. Authorization Status Bonus: Authorized = 30 points, Unverified = 0 points
      const authBonus = recycler.authorization_status === 'Authorized' ? 30 : -50;

      // 5. Reliability Score: 0 - 100
      const reliabilityScore = recycler.reliability_score;

      // Total Weighted Formula:
      // Weightage: Auth (30%) + Pickup (20%) + Distance (20%) + Price (15%) + Reliability (15%)
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
    .filter((res): res is RecyclerMatchResult => res !== null)
    .sort((a, b) => b.score - a.score); // Highest score first

    return matches;
  }
}
