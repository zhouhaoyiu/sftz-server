import { tariffs } from './billing';
export function customerInput(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new TypeError('客户资料格式错误');
  const input = value as Record<string, unknown>;
  const text = (key: string, max: number, required = false) => {
    const value = input[key] ?? '';
    if (
      typeof value !== 'string' ||
      value.length > max ||
      (required && !value.trim())
    )
      throw new TypeError('请核对客户字段');
    return value.trim();
  };
  const number = (key: string, fallback?: number) => {
    const value = input[key] ?? fallback;
    if (
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > 1e9
    )
      throw new TypeError('读数或人口错误');
    return value;
  };
  const userHh = text('userHh', 128, true);
  const lastNumber = number('lastNumber'),
    currentNumber = number('currentNumber');
  const userPopulation = number('userPopulation', 3);
  if (
    currentNumber < lastNumber ||
    !Number.isInteger(userPopulation) ||
    userPopulation < 1 ||
    userPopulation > 100
  )
    throw new TypeError('读数或人口错误');
  let lines = input.waterClassification;
  if (typeof lines === 'string') {
    try {
      lines = JSON.parse(lines);
    } catch {
      throw new TypeError('用水分类格式错误');
    }
  }
  if (
    !Array.isArray(lines) ||
    lines.length > 20 ||
    lines.some(
      (line) =>
        !line ||
        typeof line.waterType !== 'string' ||
        !Object.prototype.hasOwnProperty.call(tariffs, line.waterType) ||
        typeof line.waterNumber !== 'number' ||
        !Number.isFinite(line.waterNumber) ||
        line.waterNumber < 0 ||
        line.waterNumber > 1e7
    )
  )
    throw new TypeError('用水分类格式错误');
  return {
    userHh,
    userName: text('userName', 128, true),
    userAddress: text('userAddress', 500, true),
    userPhone: text('userPhone', 64),
    userWx: text('userWx', 128),
    jfyf: text('jfyf', 32),
    currentNumber,
    lastNumber,
    userPopulation,
    waterClassification: JSON.stringify(lines),
  };
}
