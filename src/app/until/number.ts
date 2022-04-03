export function limitNumberInRange(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getPercent(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}