import { readFileSync } from "fs";
const lines = readFileSync("data/1.txt", "utf8").split("\n");
const [left, right] = [
  lines.map((l) => +l.split(/\s+/)[0]),
  lines.map((l) => +l.split(/\s+/)[1]),
];
const distance = left.reduce((sum, value, index) => {
  return sum + Math.abs(value - right[index]);
}, 0);
console.log("Part1: ", distance);
const similarityScore = left.reduce((sum, value) => (sum + right.reduce((sum, val) => {
      return sum + (value === val ? value : 0);
    }, 0)), 0);
console.log("Part2: ", similarityScore);
