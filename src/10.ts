import { readFileSync } from "fs";

const pathFinder = (topoMap: number[][], revisitIsOk = false): number => {
  const findPaths = (startPos: number[]): number => {
    let pathCount = 0;
    let queue = [startPos];
    let visited = new Set<string>();

    while (queue.length > 0) {
      const [row, col] = queue.shift()!;
      if (topoMap[row][col] === 9) {
        pathCount++;
        continue;
      }
      const toKey = (row: number, col: number) => `${row}-${col}`;
      [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]
        .map(([dr, dc]) => [row + dr, col + dc])
        .filter(([r, c]) => topoMap[r]?.[c] === topoMap[row][col] + 1)
        .filter(([r, c]) => !visited.has(toKey(r, c)) || revisitIsOk)
        .map(([r, c]) => {
          visited.add(toKey(r, c));
          return [r, c];
        })
        .forEach(([r, c]) => queue.push([r, c]));
    }
    return pathCount;
  };

  return topoMap
    .flatMap((row, rowIndex) =>
      row.map((value, colIndex) =>
        value === 0 ? findPaths([rowIndex, colIndex]) : 0
      )
    )
    .reduce((acc, val) => acc + val, 0);
};

const topoMap: number[][] = readFileSync("data/10.txt", "utf8")
  .split("\n")
  .map((l) => l.split("").map(Number));

console.log("Part1: ", pathFinder(topoMap));
console.log("Part2: ", pathFinder(topoMap, true));
