import { readFileSync } from "fs";

const data: string[][] = readFileSync("data/4.txt", "utf8")
  .split("\n")
  .map((l) => l.split(""));

const genMatchFunction = (seq, delta) => (row, col) => 
seq.every((char, i) => {
    const [dr, dc] = delta;
    const r = row + dr * i;
    const c = col + dc * i;
    return r >= 0 && r < data.length && c >= 0 && c < data[r].length && data[r][c] === char;
});

const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];
  
const countOccurrences = (seq) => 
    data.flatMap((row, rowIndex) => 
        row.map((_, colIndex) => 
        directions.filter(delta => genMatchFunction(seq, delta)(rowIndex, colIndex)).length
        )
    ).reduce((sum, count) => sum + count, 0);

console.log("Part1: ", countOccurrences("XMAS".split("")));
