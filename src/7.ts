import { readFileSync } from "fs";

interface Rec {
  result: number;
  values: number[];
}

const toRecord = (line: string): Rec => {
  const [result, values] = line.split(": ");
  return {
    result: Number(result),
    values: values.split(" ").map(Number),
  }
}
const records = readFileSync("data/7.txt", "utf8").split("\n").map(toRecord);

const findSolution = (result: number, values: number[]) => {
    if (values.length === 0) return result === 0;
    const last = values[values.length - 1];
    const remaining = values.slice(0, values.length - 1);
    return findSolution(result-last, remaining) || findSolution(result/last, remaining);
}

console.log("Part1: ",  records
    .filter((r) => findSolution(r.result, r.values))
    .map((r) => r.result)
    .reduce((a, b) => a + b, 0));

