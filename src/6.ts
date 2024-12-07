import { readFileSync } from "fs";

interface Location {
  row: number;
  col: number;
}

const DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const getKey = (row: number, col: number, dirIndex?: number) =>
  dirIndex !== undefined ? `${row},${col},${dirIndex}` : `${row},${col}`;

const { grid, startPos } = ((filename: string) => {
  const grid = readFileSync(filename, "utf8").split("\n");
  const start = grid.flatMap((line, row) =>
    line.includes("^") ? [{ row, col: line.indexOf("^") }] : []
  )[0] || { row: 0, col: 0 };
  return { grid, startPos: start };
})("data/6.txt");

console.log(startPos);

const traverse = (
  grid: string[],
  pos: Location,
  extraPos?: Location
): Set<string> | undefined => {
  const visited: Set<string> = new Set();
  let { row, col } = pos;
  let dirIndex = 0;

  while (true) {
    const cr = row + DIRECTIONS[dirIndex][0];
    const cc = col + DIRECTIONS[dirIndex][1];
    if (cr < 0 || cr >= grid.length || cc < 0 || cc >= grid[0].length) break;

    if (
      grid[cr][cc] === "#" ||
      (cr === extraPos?.row && cc === extraPos?.col)
    ) {
      dirIndex = (dirIndex + 1) % 4;
    } else {
      row = cr;
      col = cc;
      const key = getKey(row, col, extraPos ? dirIndex : undefined);
      if (extraPos && visited.has(key)) return visited;
      visited.add(key);
    }
  }
  return extraPos ? undefined : visited;
};

console.log("Part1: ", traverse(grid, startPos)!.size);

console.log(
  "Part2: ",
  [...traverse(grid, startPos)!].filter((pos) => {
    const [row, col] = pos.split(",").map(Number);
    return (
      !(row === startPos.row && col === startPos.col) &&
      traverse(grid, startPos, { row, col }) != undefined
    );
  }).length
);
