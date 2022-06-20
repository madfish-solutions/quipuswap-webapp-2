export const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.min(maxValue, Math.max(minValue, value));
