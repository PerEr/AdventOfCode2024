import { readFileSync } from "fs";

const loadMaze = () => {
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
};

const { maze, startPos, endPos } = loadMaze();

const posToKey = (pos: { row: number; col: number }, direction?: string) =>
  direction
    ? `(${pos.col},${pos.row},${direction})`
    : `(${pos.col},${pos.row})`;

interface Node {
  row: number;
  col: number;
  accumulatedCost: number;
  parent?: Node;
  direction: string;
}

const pathFinder = (
  maze: string[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): Node[] | undefined => {
  const priorityQueue: Array<[number, Node]> = []; // [cost, node]
  const visited: Set<string> = new Set();

  const enqueue = (cost: number, node: Node) => {
    priorityQueue.push([cost, node]);
    priorityQueue.sort((a, b) => a[0] - b[0]);
  };

  enqueue(0, { row: start.row, col: start.col, accumulatedCost: 0, direction: ">" });

  while (priorityQueue.length > 0) {
    const [_, currentNode] = priorityQueue.shift()!;
    const currentKey = posToKey(currentNode, currentNode.direction);

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    if (currentNode.row === end.row && currentNode.col === end.col) {
      const path: Node[] = [];
      let node: Node | undefined = currentNode;
      while (node) {
        path.unshift(node);
        node = node.parent;
      }
      return path;
    }

    [
      { row: currentNode.row - 1, col: currentNode.col, direction: "^" }, // Up
      { row: currentNode.row + 1, col: currentNode.col, direction: "v" }, // Down
      { row: currentNode.row, col: currentNode.col - 1, direction: "<" }, // Left
      { row: currentNode.row, col: currentNode.col + 1, direction: ">" }, // Right
    ].forEach((neighbor) => {
      if (
        neighbor.row >= 0 &&
        neighbor.row < maze.length &&
        neighbor.col >= 0 &&
        neighbor.col < maze[neighbor.row].length &&
        maze[neighbor.row][neighbor.col] !== "#"
      ) {
        const directionChanged = currentNode.direction !== neighbor.direction;
        const accumulatedCost =
          currentNode.accumulatedCost + (directionChanged ? 1001 : 1);

        const neighborNode: Node = {
          ...neighbor,
          accumulatedCost,
          parent: currentNode,
        };

        const neighborKey = posToKey(neighborNode, neighborNode.direction);

        if (!visited.has(neighborKey)) {
          enqueue(accumulatedCost, neighborNode);
        }
      }
    });
  }

  return;
};

const path = pathFinder(maze, startPos, endPos);
console.log("Part1: ", path![path!.length-1].accumulatedCost);