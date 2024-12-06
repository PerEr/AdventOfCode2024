import { readFileSync } from "fs";
const grid = readFileSync("data/6.txt", "utf8").split("\n");

// find row, col for the character ^

const start = grid
    .map((line) => line.indexOf("^"))
    .map((off, index) => off === -1 ? undefined : [index, off])
    .find((v) => v) ?? [0,0];

const directions = [[-1,0], [0,1], [1, 0], [0,-1]]
let dirInxex = 0;

console.log(start)

// set of all visited positions as a tuple (row, col)
const visited: Set<string> = new Set();

let [row, col]: number[] = start;
while(true) {
    const cr = row + directions[dirInxex][0];
    const cc = col + directions[dirInxex][1];
    console.log(cr, cc);
    if (cr < 0 || cr >= grid.length || cc < 0 || cc >= grid[0].length) {
        break
    }
    if (grid[cr][cc] === "#") {
        dirInxex = (dirInxex + 1) % 4;
    } else {
        const key = [cr, cc].join(",");
        visited.add(key);
        row = cr;
        col = cc;
    }
}

console.log("Part1: ", visited.size);