import { readFileSync } from "fs";

const toRecord = (line: string) =>
  line.split("\n").reduce((result, line) => {
    const match = line.match(/^(Button)?(.*?):\s*X[+=]?(\d+),\s*Y[+=]?(\d+)$/);
    if (match) {
      const [, , key, x, y] = match;
      result[key.trim()] = [parseInt(x, 10), parseInt(y, 10)];
    }
    return result;
  }, {});

const toSolution = (prizeData, offset = 0) => {
  const X = prizeData.Prize[0] + offset;
  const Y = prizeData.Prize[1] + offset;
  const A =
    (X * prizeData.B[1] - Y * prizeData.B[0]) /
    (prizeData.A[0] * prizeData.B[1] - prizeData.A[1] * prizeData.B[0]);
  const B = (X - A * prizeData.A[0]) / prizeData.B[0];
  return Number.isInteger(A) && Number.isInteger(B) ? A * 3 + B : 0;
};

const prizeRecords = readFileSync("data/13.txt", "utf8")
  .split("\n\n")
  .map(toRecord);

const part1 = prizeRecords
  .map(toSolution)
  .reduce((sum, value) => sum + value, 0);

console.log("Part1: ", part1);

const part2 = prizeRecords
  .map((r) => toSolution(r, 10000000000000))
  .reduce((sum, value) => sum + value, 0);

console.log("Part2: ", part2);
