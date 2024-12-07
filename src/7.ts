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
  };
};

const records = readFileSync("data/7.txt", "utf8").split("\n").map(toRecord);

const solutionExists = (
  rec: Rec,
  expansions: ((a: number, b: number) => number)[]
): number => {
  let variants = [rec.values[0]];

  for (let i = 1; i < rec.values.length; i++) {
    variants = variants.flatMap((answer) =>
      expansions.map((expansion) => expansion(answer, rec.values[i]))
    );
    if (variants.includes(rec.result)) return rec.result;
  }
  return 0;
};

const addFun = (a: number, b: number) => a + b;
const mulFun = (a: number, b: number) => a * b;
const concatFun = (a: number, b: number) => +`${a}${b}`;

const solve = (expansions: ((a: number, b: number) => number)[]): number =>
  records
    .filter((r) => solutionExists(r, expansions))
    .map((r) => r.result)
    .reduce((a, b) => a + b, 0);

console.log("Part1: ", solve([addFun, mulFun]));
console.log("Part2: ", solve([addFun, mulFun, concatFun]));
