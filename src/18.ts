import { readFileSync } from "fs";

interface Position {
  x: number;
  y: number;
}

const loadMaze = (fileName): Position[] =>
  readFileSync(fileName, "utf8")
    .split("\n")
    .map((line) => {
      const [, x, y] = line.match(/(\d+),(\d+)/m)!;
      return { x: parseInt(x, 10), y: parseInt(y, 10) };
    });

const posToKey = (pos: Position) => `${pos.x}-${pos.y}`;

const bfsPathFind = (maze: Position[], width: number): number | undefined => {
  const mazeSet = new Set(maze.map(posToKey));
  const startPos: Position = { x: 0, y: 0 };
  const endPos: Position = { x: width - 1, y: width - 1 };
  const queue = [startPos];
  const visited = new Set<string>();
  const distance = new Map<string, number>();

  distance.set(posToKey(startPos), 0);
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentKey = posToKey(current);
    if (current.x === endPos.x && current.y === endPos.y)
      return distance.get(currentKey);
    if (visited.has(posToKey(current))) continue;
    visited.add(currentKey);
    [
      { x: current.x - 1, y: current.y },
      { x: current.x + 1, y: current.y },
      { x: current.x, y: current.y - 1 },
      { x: current.x, y: current.y + 1 },
    ]
      .filter(
        (neighbor) =>
          neighbor.x >= 0 &&
          neighbor.x < width &&
          neighbor.y >= 0 &&
          neighbor.y < width
      )
      .filter((neighbor) => !mazeSet.has(posToKey(neighbor)))
      .forEach((neighbor) => {
        distance.set(posToKey(neighbor), distance.get(currentKey)! + 1);
        queue.push(neighbor);
      });
  }
};

//const {maze, width, firstN } = { maze: loadMaze("data/18_test.txt"), width: 7, firstN: 12 };
const { maze, width, firstN } = {
  maze: loadMaze("data/18.txt"),
  width: 71,
  firstN: 1024,
};

const part1 = maze.slice(0, firstN);
console.log("Part1:", bfsPathFind(part1, width));

for (let ii = firstN; ii < maze.length; ii++) {
  const testMaze = maze.slice(0, ii);
  if (!bfsPathFind(testMaze, width)) {
    const lastPos= testMaze[testMaze.length - 1];
    console.log("Part2:", lastPos.x + ',' + lastPos.y);
    break;
  }
}
