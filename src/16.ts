import { readFileSync } from "fs";

interface Position {
  row: number;
  col: number;
}
type Direction = "^" | "v" | "<" | ">";

type Node = Position & {
  dir: Direction;
};

type NodeEx = Node & {
  positions: Set<string>;
  score: number;
};

const posToString = (pos: Position) => `(${pos.row},${pos.col})`;
const nodeToString = (node: Node) => `(${node.row},${node.col},${node.dir})`;

const disallowedDir = new Map<Direction, Direction>([
  ["^", "v"],
  ["v", "^"],
  ["<", ">"],
  [">", "<"],
]);

const neighbouringNodes = (maze: string[][], currentNode: NodeEx): NodeEx[] => {
  return [
    { row: currentNode.row - 1, col: currentNode.col, dir: "^" as Direction },
    { row: currentNode.row + 1, col: currentNode.col, dir: "v" as Direction },
    { row: currentNode.row, col: currentNode.col - 1, dir: "<" as Direction },
    { row: currentNode.row, col: currentNode.col + 1, dir: ">" as Direction },
  ]
    .filter((n: Node) => maze[n.row]?.[n.col] !== "#")
    .filter((n: Node) => n.dir !== disallowedDir[currentNode.dir])
    .map(
      (n: Node): NodeEx => ({
        ...n,
        positions: new Set([...currentNode.positions, posToString(n)]),
        score: currentNode.score + 1 + (n.dir !== currentNode.dir ? 1000 : 0),
      })
    );
};

const findPaths = (maze, startPos: Position, endPos: Position): {score: number, positions: number} => {
  let currentNode: NodeEx = {
    ...startPos,
    dir: ">",
    score: 0,
    positions: new Set([posToString(startPos)]),
  };
  const nodesToVisit: NodeEx[] = [currentNode];
  const visited = new Map([[nodeToString(currentNode), currentNode]]);
  while (nodesToVisit.length > 0) {
    currentNode = nodesToVisit.shift()!;
    neighbouringNodes(maze, currentNode).forEach((n) => {
      const prev = visited.get(nodeToString(n));
      if (!prev || prev.score > n.score) {
        nodesToVisit.push(n);
        visited.set(nodeToString(n), n);
      } else if (prev.score === n.score) {
        prev.positions = new Set([...prev.positions, ...n.positions]);
      }
    });
  }

  return [...visited.values()]
    .filter((n) => n.row === endPos.row && n.col === endPos.col)
    .reduce(
      ({ score, positions }, n) => {
        if (n.score < score) return { score: n.score, positions: n.positions.size };
        else return { score, positions };
      },
      { score: Infinity, positions: 0 }
    );
};

const { maze, startPos, endPos } = (() => {
  const maze = readFileSync("data/16.txt", "utf8")
    .split("\n")
    .map((line) => line.split(""));

  const findChar = (char) =>
    maze.flatMap((line, row) =>
      line.includes(char) ? [{ row, col: line.indexOf(char) }] : []
    )[0] || { row: 0, col: 0 };

  const startPos = findChar("S");
  const endPos = findChar("E");

  return { maze, startPos, endPos };
})();

const { score, positions } = findPaths(maze, startPos, endPos);

console.log("Part1: ", score);
console.log("Part2: ", positions);
