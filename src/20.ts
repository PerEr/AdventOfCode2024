import { readFileSync } from "fs";

interface Position {
  row: number;
  col: number;
}

const { maze, startPos, endPos } = ((
  fileName: string,
): {
  maze: string[][];
  startPos: Position;
  endPos: Position;
} => {
  const maze = readFileSync(fileName, "utf8")
    .split("\n")
    .map((line) => line.split(""));

  const findChar = (char) =>
    maze.flatMap((line, row) =>
      line.includes(char) ? [{ row, col: line.indexOf(char) }] : []
    )[0] || { row: 0, col: 0 };

  const startPos = findChar("S");
  const endPos = findChar("E");

  maze[startPos.row][startPos.col] = ".";
  maze[endPos.row][endPos.col] = ".";

  return { maze, startPos, endPos };
})("data/20.txt");

const findPath = (
  maze,
  startPos: Position,
  endPos: Position
): Position[] | undefined => {
  const posToString = (pos: Position) => `(${pos.row},${pos.col})`;
  let currentPos: Position = { ...startPos };
  const posToVisit: Position[] = [currentPos];
  const visited = new Map([[posToString(currentPos), currentPos]]);
  let path: Position[] = [];
  while (posToVisit.length > 0) {
    currentPos = posToVisit.shift()!;
    path.push({ ...currentPos });
    if (currentPos.row === endPos.row && currentPos.col === endPos.col) {
      break;
    }
    [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
      .map(([dr, dc]) => [currentPos.row + dr, currentPos.col + dc])
      .filter(
        ([row, col]) =>
          row >= 0 && row < maze.length && col >= 0 && col < maze[row].length
      )
      .filter(([row, col]) => maze[row][col] !== "#")
      .filter(([row, col]) => !visited.has(posToString({ row, col })))
      .forEach(([row, col]) => {
        const pos: Position = { row, col };
        posToVisit.push(pos);
        visited.set(posToString(pos), pos);
      });
  }
  return path;
};

const findCheats = (
  path: Position[],
  minSavedPicos: number,
  maxCheatPicos: number
): number => {
  const calcDist = (pos1: Position, pos2: Position): number =>
    Math.abs(pos2.row - pos1.row) + Math.abs(pos2.col - pos1.col);
  let count = 0;
  for (let ii = 0; ii < path.length - minSavedPicos; ii++) {
    for (let jj = ii + minSavedPicos; jj < path.length; jj++) {
      const dist = calcDist(path[ii], path[jj]);
      if (jj - ii - dist >= minSavedPicos && dist <= maxCheatPicos) count++;
    }
  }
  return count;
};

const path = findPath(maze, startPos, endPos)!;

console.log("Part1: ", findCheats(path, 100, 2));
console.log("Part2: ", findCheats(path, 100, 20));
