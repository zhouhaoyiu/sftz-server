export const tariffVersion = 'legacy-v1';
export const tariffs: Record<string, { water: number; sewage: number }> = {
  生活一: { water: 240, sewage: 95 },
  生活二: { water: 240, sewage: 50 },
  居民一: { water: 230, sewage: 95 },
  居民二: { water: 230, sewage: 50 },
  非居民一: { water: 400, sewage: 140 },
  非居民二: { water: 400, sewage: 140 },
  特种一: { water: 4800, sewage: 140 },
  非居民四: { water: 320, sewage: 140 },
};
export type Line = { type: string; volume: number };
export function calculateBill(lines: Line[], population: number) {
  if (
    !Array.isArray(lines) ||
    !lines.length ||
    lines.length > 20 ||
    !Number.isInteger(population) ||
    population < 1 ||
    population > 100
  )
    throw new Error('Invalid bill');
  const result = lines.map((line) => {
    const rate =
      line && Object.prototype.hasOwnProperty.call(tariffs, line.type)
        ? tariffs[line.type]
        : null;
    if (
      !rate ||
      typeof line.volume !== 'number' ||
      !Number.isFinite(line.volume) ||
      line.volume < 0 ||
      line.volume > 10000000 ||
      Math.abs(line.volume * 1000 - Math.round(line.volume * 1000)) > 1e-6
    )
      throw new Error('Invalid volume or category');
    let remaining = Math.round(line.volume * 1000);
    const extra = Math.max(0, population - 3);
    const tiers =
      line.type === '居民一'
        ? [
            [(108 + extra * 36) * 1000, 230],
            [(53 + extra * 18) * 1000, 460],
            [Infinity, 690],
          ]
        : [[Infinity, rate.water]];
    const segments = tiers
      .map(([limit, price]) => {
        const quantity = Math.min(remaining, limit);
        remaining -= quantity;
        return {
          volume: quantity / 1000,
          unitCents: price,
          amountCents: Math.round((quantity * price) / 1000),
        };
      })
      .filter((segment) => segment.volume > 0);
    const waterCents = segments.reduce(
      (sum, segment) => sum + segment.amountCents,
      0
    );
    const sewageCents = Math.round(line.volume * rate.sewage);
    return {
      ...line,
      segments,
      waterCents,
      sewageCents,
      totalCents: waterCents + sewageCents,
    };
  });
  return {
    tariffVersion,
    population,
    lines: result,
    totalVolume:
      result.reduce((sum, line) => sum + Math.round(line.volume * 1000), 0) /
      1000,
    waterCents: result.reduce((sum, line) => sum + line.waterCents, 0),
    sewageCents: result.reduce((sum, line) => sum + line.sewageCents, 0),
    totalCents: result.reduce((sum, line) => sum + line.totalCents, 0),
  };
}
