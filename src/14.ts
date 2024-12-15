import { readFileSync } from "fs";

const [width, height] = [101, 103];

const robotData = readFileSync("data/14.txt", "utf8")
  .split("\n")
  .map((line) => {
    const match = line.match(/p=([-]?\d+),([-]?\d+) v=([-]?\d+),([-]?\d+)/);
    if (match) {
      const [, px, py, dx, dy] = match;
      return { px: +px, py: +py, dx: +dx, dy: +dy };
    }
  });

const moveRobotData = (robotData, moveFunc, iterations) => {
  for (let ii = 0; ii < iterations; ii++) {
    robotData = robotData.map((robot) => moveFunc(robot));
  }
  return robotData;
};

const moveFunction = ({ px, py, dx, dy }) => ({
  px: (((px + dx) % width) + width) % width,
  py: (((py + dy) % height) + height) % height,
  dx,
  dy,
});
const robotDataMoved = moveRobotData(robotData, moveFunction, 100);

const { q } = robotDataMoved.reduce(
  (acc, robot) => {
    if (robot.px === acc.wm || robot.py === acc.hm) return acc;
    const ix = (robot.py > acc.hm ? 2 : 0) + (robot.px > acc.wm ? 1 : 0);
    acc.q[ix]++;
    return acc;
  },
  { q: [0, 0, 0, 0], wm: (width - 1) / 2, hm: (height - 1) / 2 }
);

console.log(
  "Part1",
  q.reduce((prod, value) => prod * value, 1)
);

const findTreeDetail = (robotData) => {
  const grid = Array(height)
    .fill(0)
    .map((_) => Array(width).fill("."));
  const updatedGrid = robotData.reduce((acc, robot) => {
    acc[robot.py][robot.px] = "#";
    return acc;
  }, grid);
  return updatedGrid.some((line) =>
    line.join("").includes("###############################")
  );
};

let rd = robotData;
for (let ii = 0; ii <= Infinity; ii++) {
  if (findTreeDetail(rd)) {
    console.log("Part2:", ii);
    break;
  }
  rd = moveRobotData(rd, moveFunction, 1);
}
