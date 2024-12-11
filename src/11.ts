import { readFileSync } from "fs";

const blinkStone = (stoneNum: number): number[] => {
  if (stoneNum === 0) return [1];
  const t = `${stoneNum}`;
  if (t.length % 2 == 0) {
    return [+t.slice(0, t.length / 2), +t.slice(t.length / 2)];
  }
  return [2024 * stoneNum];
};

const stoneCache = new Map<string, number>();

const memoizedCountStones = (stoneNum: number, iterations: number): number => {
  const cacheKey = `${stoneNum}-${iterations}`;
  if (stoneCache.has(cacheKey)) return stoneCache.get(cacheKey) ?? 0;
  let blinkedStones = blinkStone(stoneNum);
  const count = iterations === 1 ? blinkedStones.length
      : blinkedStones.reduce((acc, stone) => acc + memoizedCountStones(stone, iterations - 1), 0);
  stoneCache.set(cacheKey, count);
  return count;
};

const inputStones = readFileSync("data/11.txt", "utf8").split(" ").map(Number);

console.log("Part1: ", inputStones.reduce((sum, stone) => sum + memoizedCountStones(stone, 25), 0));
console.log("Part2: ", inputStones.reduce((sum, stone) => sum + memoizedCountStones(stone, 75), 0));
