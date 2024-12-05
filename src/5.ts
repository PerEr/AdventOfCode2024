import { readFileSync } from "fs";

const [edgesPart, pageOrderPart] = readFileSync("data/5.txt", "utf8").split("\n\n");

interface Graph {
    [node: number]: number[];
}
const graph = ((edges: number[][]): Graph => {
    const graph: Graph = {};
    for (const edge of edges) {
        const [from, to] = edge;
        if (!graph[from]) graph[from] = [];
        graph[from].push(to);
    }
    return graph;
})(edgesPart.split("\n").map((line) => line.split("|").map(Number)));


function outOfOrder(graph: Graph, start: number, end: number): boolean {
    return (graph[end] || []).includes(start);
}

function isInOrder(graph: Graph, sequence: number[]): boolean {
    for (let i = 0; i < sequence.length - 1; i++) {
        const current = sequence[i];
        for (let j = i+1; j < sequence.length ; j++) {
            const next = sequence[j];
            if (outOfOrder(graph, current, next)) {
                return false;
            }
        }
    }
    return true;
}

const validOrders = pageOrderPart.split("\n").map((line) => line.split(",").map(Number)).filter((page) => isInOrder(graph, page))

const part1 = validOrders.map((l) => l[Math.floor(l.length/2)]).reduce((sum, value) => sum + value, 0);
console.log("Part1: ", part1);
