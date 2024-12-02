import { readFileSync } from "fs";

const reports = readFileSync("data/2.txt", "utf8")
    .split("\n")
    .map((l) => l.split(/\s+/).map(Number));

const inRange = (diff: number) => diff >= 1 && diff <= 3;
const isSafeRule = (numbers: number[]) =>
    numbers.every((value, index) => index === 0 || inRange(value - numbers[index - 1]))

console.log("Part1: ", reports.filter((r) => isSafeRule(r) || isSafeRule([...r].reverse())).length);

console.log("Part2: ", reports
    .map((n: number[]) => {
        const r = n.map((_, index, array) => [...array.slice(0, index), ...array.slice(index + 1)]);
        r.push(n);
        return r;
    })
    .map((vs) => vs.find((r) => isSafeRule(r) || isSafeRule(r.reverse())))
    .filter(Boolean).length);