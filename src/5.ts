import { readFileSync } from "fs";

interface Graph {
  [node: number]: number[];
}

const [graph, orders] = ((parts: string[]) => {
  return [
    ((edges: number[][]): Graph => {
      const graph: Graph = {};
      for (const edge of edges) {
        const [from, to] = edge;
        if (!graph[from]) graph[from] = [];
        graph[from].push(to);
      }
      return graph;
    })(parts[0].split("\n").map((line) => line.split("|").map(Number))),
    parts[1].split("\n").map((line) => line.split(",").map(Number)),
  ];
})(readFileSync("data/5.txt", "utf8").split("\n\n"));

const outOfOrderPair = (graph: Graph, start: number, end: number): boolean =>
  (graph[end] || []).includes(start);

// Function to check if any element in the sequence is out of order
const inOrderSequence = (graph: Graph, sequence: number[]): boolean =>
  sequence.every((current, i) =>
    sequence.slice(i + 1).every((next) => !outOfOrderPair(graph, current, next))
  );

const [validOrders, invalidOrders] = [
  orders.filter((page) => inOrderSequence(graph, page)),
  orders.filter((page) => !inOrderSequence(graph, page)),
];

const pickMiddleElement = (seq) => seq[Math.floor(seq.length / 2)];

const part1 = validOrders
  .map(pickMiddleElement)
  .reduce((sum, value) => sum + value, 0);
console.log("Part1: ", part1);

const reorderSequence = (graph: Graph, sequence: number[]): number[] => {
  for (let i = 0; i < sequence.length - 1; i++) {
    for (let j = i + 1; j < sequence.length; j++) {
      if (outOfOrderPair(graph, sequence[i], sequence[j])) {
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
      }
    }
  }
  return sequence;
};

const part2 = invalidOrders.map((seq) => reorderSequence(graph, seq))
  .map((l) => l[Math.floor(l.length / 2)])
  .reduce((sum, value) => sum + value, 0);
console.log("Part2: ", part2);
