import { getRandomInt } from "./number";

export function isArray(arr: any[], target: string) {
  return arr.indexOf(target) !== -1;
}

export function shuffle<T>(arr: T[]): T[] {
  const result = arr.slice();
  for (let i = 0; i < result.length; i++) {
    // 0 and i 之间的随机数
    const j = getRandomInt([0, 1]);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}