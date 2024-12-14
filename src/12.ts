import { readFileSync } from "fs";

interface Loc {
  row: number;
  col: number;
}

const locToId = (loc: Loc) => `${loc.row}|${loc.col}`;

const walkPlotMap = (plotMap: string[][], startLoc: Loc): { plots: Set<string>, sides: Map<string, Set<number>> } => {
    const plotsToCheck: Loc[] = [startLoc];
    const plots = new Set<string>([locToId(startLoc)]);
    const sides = new Map<string, Set<number>>();
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
    while (plotsToCheck.length) {
      const { row, col } = plotsToCheck.pop()!;
  
      for (const [dr, dc] of directions) {
        const newLoc: Loc = { row: row + dr, col: col + dc };
        if (plotMap[newLoc.row]?.[newLoc.col] === plotMap[startLoc.row][startLoc.col]) {
          const newPlotId = locToId(newLoc);
          if (!plots.has(newPlotId)) {
            plots.add(newPlotId);
            plotsToCheck.push(newLoc);
          }
        } else {
          if (newLoc.col === col) {
            const sideId = `c|${row}|${newLoc.row}`;
            sides.set(sideId, new Set([...(sides.get(sideId) || new Set()), col]));
          } else {
            const sideId = `r|${col}|${newLoc.col}`;
            sides.set(sideId, new Set([...(sides.get(sideId) || new Set()), row]));
          }
        }
      }
    }
    return { plots, sides };
  };

const findAllRegions = (plotMap, callback) => {
  let locVisited = new Set<string>();
  for (let row = 0; row < plotMap.length; row++) {
    for (let col = 0; col < plotMap[row].length; col++) {
      const loc = { row, col };
      if (locVisited.has(locToId(loc))) continue;
      const { plots, sides } = walkPlotMap(plotMap, { row, col });
      locVisited = new Set([...locVisited, ...plots]);
      callback(plots, sides);
    }
  }
};

const countSides = (sides: Map<string, Set<number>>) => {
  return [...sides.values()].reduce((acc, side) => {
    const points = [...side].sort((a, b) => a - b);
    return points.reduce((sideCount, point, index, array) => {
      if (index === array.length - 1 || point + 1 !== array[index + 1]) {
        return sideCount + 1;
      }
      return sideCount;
    }, acc);
  }, 0);
};

const processAllRegions = (plotMap, callback): number => {
  let res = 0;
  findAllRegions(
    plotMap,
    (plots: Set<string>, sides: Map<string, Set<number>>) => {
      res += callback(plots.size, sides);
    }
  );
  return res;
};

const plotMap = readFileSync("data/12.txt", "utf8")
  .split("\n")
  .map((line) => line.split(""));

console.log("Part1: ", processAllRegions( plotMap, (plotSize, sides) => {
      let perimeter = [...sides.values()].reduce(
        (acc, set) => acc + set.size,
        0
      );
      return plotSize * perimeter;
    }
  )
);

console.log("Part2: ", processAllRegions(plotMap, (plotSize, sides) => plotSize * countSides(sides)));
