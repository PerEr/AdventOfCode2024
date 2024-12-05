import { readFileSync } from "fs";

const data: string[][] = readFileSync("data/4.txt", "utf8")
  .split("\n")
  .map((l) => l.split(""));

const genSeqMatchFunction = (seq, delta) => (row, col) =>
  seq.every((char, i) => {
    const [dr, dc] = delta;
    const r = row + dr * i;
    const c = col + dc * i;
    return (
      r >= 0 &&
      r < data.length &&
      c >= 0 &&
      c < data[r].length &&
      data[r][c] === char
    );
  });

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const countOccurrences = (seq) =>
  data
    .flatMap((row, rowIndex) =>
      row.map(
        (_, colIndex) =>
          directions.filter((delta) =>
            genSeqMatchFunction(seq, delta)(rowIndex, colIndex)
          ).length
      )
    )
    .reduce((sum, count) => sum + count, 0);

console.log("Part1: ", countOccurrences("XMAS".split("")));

const offsets = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

const genCrossMatchFunction = (seq, offset) => (row, col) =>
  seq.every((char, i) => {
    const [dr, dc] = offset;
    const r = row + dr + i * Math.sign(dr) * -1;
    const c = col + dc + i * Math.sign(dc) * -1;
    return (
      r >= 0 &&
      r < data.length &&
      c >= 0 &&
      c < data[r].length &&
      data[r][c] === char
    );
  });

const countCrossOccurrences = (seq) =>
  data
    .flatMap((row, rowIndex) =>
      row.map(
        (_, colIndex) =>
          offsets.filter((offset) =>
            genCrossMatchFunction(seq, offset)(rowIndex, colIndex)
          ).length
      )
    )
    .filter((v) => v == 2).length;

console.log("Part2: ", countCrossOccurrences("MAS".split("")));
