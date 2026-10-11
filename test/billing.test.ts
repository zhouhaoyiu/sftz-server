import { calculateBill } from '../src/billing';
describe('billing snapshots', () => {
  test('resident tiers have one consistent total', () => {
    const bill = calculateBill([{ type: '居民一', volume: 200 }], 3);
    expect(bill.waterCents).toBe(76130); expect(bill.sewageCents).toBe(19000);
    expect(bill.totalCents).toBe(95130);
  });
  test.each([[108, 24840], [161, 49220], [0, 0]])('tier boundary %s', (volume, total) => {
    expect(calculateBill([{ type: '居民一', volume }], 3).waterCents).toBe(total);
  });
  test('extra population extends the first tier', () => {
    expect(calculateBill([{ type: '居民一', volume: 144 }], 4).waterCents).toBe(33120);
  });
  test('source data is unchanged and results repeat', () => {
    const lines = Object.freeze([Object.freeze({ type: '居民一', volume: 200 })]);
    const first = calculateBill([...lines], 3);
    expect(calculateBill([...lines], 3)).toEqual(first);
    expect(first.lines.reduce((sum, line) => sum + line.totalCents, 0)).toBe(first.totalCents);
  });
  test.each([-1, NaN, Infinity, 0.00001])('reject invalid volume %s', volume => {
    expect(() => calculateBill([{ type: '居民一', volume }], 3)).toThrow();
  });
  test('reject unrecognized tariff and invalid population', () => {
    expect(() => calculateBill([{ type: '__proto__', volume: 1 }], 3)).toThrow();
    expect(() => calculateBill([{ type: '居民一', volume: 1 }], 0)).toThrow();
  });
});
