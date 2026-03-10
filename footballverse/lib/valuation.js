/**
 * Realistic football valuation model
 * Based on Rating, Tiers, and Growth potential
 */

export function calculatePlayerValue(rating) {
    if (!rating) return 0;

    // Rating Ranges based on User Request
    // 98–100: €180M – €250M
    // 95–97: €130M – €180M
    // 92–94: €90M – €130M
    // 89–91: €65M – €90M
    // 86–88: €45M – €65M
    // 83–85: €30M – €45M
    // 80–82: €15M – €30M

    if (rating >= 98) return 180_000_000 + (rating - 98) * 35_000_000;
    if (rating >= 95) return 130_000_000 + (rating - 95) * 16_666_666;
    if (rating >= 92) return 90_000_000 + (rating - 92) * 13_333_333;
    if (rating >= 89) return 65_000_000 + (rating - 89) * 8_333_333;
    if (rating >= 86) return 45_000_000 + (rating - 86) * 6_666_666;
    if (rating >= 83) return 30_000_000 + (rating - 83) * 5_000_000;
    if (rating >= 80) return 15_000_000 + (rating - 80) * 5_000_000;

    // Fallback formula for lower ratings: value = rating * rating * 0.025 (in millions)
    return Math.round(rating * rating * 0.025) * 1_000_000;
}

export function formatCurrency(n) {
    if (n >= 1_000_000_000) return `€${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(0)}M`;
    if (n >= 1_000) return `€${(n / 1_000).toFixed(0)}K`;
    return `€${n}`;
}

export function getPlayerTier(rating) {
    if (rating >= 98) return 'Legendary';
    if (rating >= 95) return 'Superstar';
    if (rating >= 92) return 'Elite';
    if (rating >= 89) return 'Top Tier';
    if (rating >= 86) return 'First Team';
    if (rating >= 83) return 'Starter';
    if (rating >= 80) return 'Professional';
    return 'Prospect';
}
