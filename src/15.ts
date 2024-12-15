import { readFileSync } from "fs";

const loadGrid = () => {
  const [gridRaw, movementsRaw] = readFileSync("data/15.txt", "utf8").split(
    "\n\n"
  );

  const grid = gridRaw.split("\n").map((line) => line.split(""));
  const movements = movementsRaw.split("").filter((c) => c !== "\n");

  const robot = "@";
  const startPos = grid.flatMap((line, row) =>
    line.includes(robot) ? [{ row, col: line.indexOf(robot) }] : []
  )[0] || { row: 0, col: 0 };

  grid[startPos.row][startPos.col] = ".";

  return { grid, movements, startPos };
};

const { grid, movements, startPos } = loadGrid();

const nextFromPosAndDir = (pos, dir) => {
  let next = { ...pos };
  next.col += (dir === "<" ? -1 : 0) + (dir === ">" ? 1 : 0);
  next.row += (dir === "v" ? 1 : 0) + (dir === "^" ? -1 : 0);
  return next;
};

const isPosInBounds = (grid: string[][], pos) => {
  return (
    pos.row >= 0 &&
    pos.row < grid.length &&
    pos.col >= 0 &&
    pos.col < grid[0].length
  );
};

const canMove = (grid: string[][], pos, dir: string) => {
  const next = nextFromPosAndDir(pos, dir);
  if (!isPosInBounds(grid, next)) return false;
  if (grid[next.row][next.col] === "#") return false;
  if (grid[next.row][next.col] === ".") return true;
  if (grid[next.row][next.col] === "O") return canMove(grid, next, dir);
  const leftBracket = grid[next.row][next.col] === "[";
  const rightBracket = grid[next.row][next.col] === "]";
  if (leftBracket || rightBracket) {
    if (next.col !== pos.col) return canMove(grid, next, dir); // Sideways?
    const dcol = leftBracket ? 1 : -1; // Up/down!
    const next2 = { row: next.row, col: next.col + dcol };
    return canMove(grid, next, dir) && canMove(grid, next2, dir);
  }
  return canMove(grid, next, dir);
};

const doMove = (grid: string[][], pos, dir: string) => {
  const next = nextFromPosAndDir(pos, dir);
  if (grid[next.row][next.col] === "O") {
    doMove(grid, next, dir);
  }
  const leftBracket = grid[next.row][next.col] === "[";
  const rightBracket = grid[next.row][next.col] === "]";
  if (leftBracket || rightBracket) {
    if (next.col !== pos.col) {
      doMove(grid, next, dir);
    } else {
      const dcol = leftBracket ? 1 : -1; // Up/down!
      const next2 = { row: next.row, col: next.col + dcol };
      doMove(grid, next, dir);
      doMove(grid, next2, dir);
    }
  }
  grid[next.row][next.col] = grid[pos.row][pos.col];
  grid[pos.row][pos.col] = ".";
};

const res = movements.reduce(
  ({ grid, pos }, m) => {
    let next = pos;
    if (canMove(grid, pos, m)) {
      doMove(grid, pos, m);
      next = nextFromPosAndDir(pos, m);
    }
    return { grid, pos: next };
  },
  { grid, pos: startPos }
);

const part1 = res.grid.reduce(
  (acc, line, row) =>
    line.reduce((acc, char, col) => {
      if (char === "O") {
        acc += row * 100 + col;
      }
      return acc;
    }, acc),
  0
);

console.log("Part1:", part1);

const grid2 = loadGrid().grid.map((line) =>
  line.flatMap((char) => (char == "O" ? ["[", "]"] : [char, char]))
);
const startPos2 = { row: startPos.row, col: startPos.col * 2 };

const res2 = movements.reduce(
  ({ grid, pos }, m) => {
    let next = pos;
    if (canMove(grid, pos, m)) {
      doMove(grid, pos, m);
      next = nextFromPosAndDir(pos, m);
    }
    return { grid, pos: next };
  },
  { grid: grid2, pos: startPos2 }
);

const part2 = res2.grid.reduce(
  (acc, line, row) =>
    line.reduce((acc, char, col) => {
      if (char === "[") {
        acc += row * 100 + col;
      }
      return acc;
    }, acc),
  0
);

console.log("Part2:", part2);
