import { readFileSync } from "fs";

const cityMap = readFileSync("data/8.txt", "utf8")
  .split("\n")
  .map((line) => line.split(""));

interface Location {
  row: number;
  col: number;
}

const antennaMap = cityMap.reduce((acc, line, row) => {
  line.forEach((char, col) => {
    if (char !== ".") {
      if (!acc.has(char)) acc.set(char, []);
      acc.get(char)!.push({ row, col });
    }
  });
  return acc;
}, new Map<string, Location[]>());

const processMap = (cityMap, antennaMap, processFun) => {
  for (const locations of antennaMap.values()) {
    for (const loc1 of locations) {
      for (const loc2 of locations) {
        if (loc1 !== loc2) {
          processFun(cityMap, loc1, loc1.row - loc2.row, loc1.col - loc2.col);
        }
      }
    }
  }
  return cityMap;
};

console.log("Part1: ",
    processMap([...cityMap], antennaMap, (cityMap, loc, dr, dc) => {
        const r = loc.row - dr * 2;
        const c = loc.col - dc * 2;
        if (cityMap[r]?.[c]) cityMap[r][c] = "#";
      }).reduce((sum, line) => sum + line.filter((c) => c === "#").length, 0)
);

console.log("Part2: ",
  processMap([...cityMap], antennaMap, (cityMap, loc, dr, dc) => {
    let r = loc.row - dr;
    let c = loc.col - dc;
    while (cityMap[r]?.[c]) {
      cityMap[r][c] = "#";
      r -= dr;
      c -= dc;
    }
  }).reduce((sum, line) => sum + line.filter((c) => c === "#").length, 0)
);
