/**
 * Realistic football valuation model
 * Based on Rating Tiers
 */

export function calculatePlayerValue(rating) {
    if (!rating) return 0;

    // GOAT / Legendary: €180M – €250M
    if (rating >= 98) return 180_000_000 + (rating - 98) * 35_000_000;

    // World Class Superstar: €130M – €180M
    if (rating >= 95) return 130_000_000 + (rating - 95) * 16_666_666;

    // Elite Player: €90M – €130M
    if (rating >= 92) return 90_000_000 + (rating - 92) * 13_333_333;

    // Top Tier Starter: €65M – €90M
    if (rating >= 89) return 65_000_000 + (rating - 89) * 8_333_333;

    // Strong First Team: €45M – €65M
    if (rating >= 86) return 45_000_000 + (rating - 86) * 6_666_666;

    // Good Starter: €30M – €45M
    if (rating >= 83) return 30_000_000 + (rating - 83) * 5_000_000;

    // Solid Professional: €15M – €30M
    if (rating >= 80) return 15_000_000 + (rating - 80) * 5_000_000;

    // Fallback formula: value = rating * rating * 0.025 (in millions)
    return Math.round(rating * rating * 0.025) * 1_000_000;
}
