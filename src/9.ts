import { readFileSync } from "fs";

interface Fragment {
  id?: number;
}

const toFragment = (num: number, ix: number): Fragment[] =>
  Array<Fragment>(num).fill(ix % 2 == 0 ? { id: ix / 2 } : {});

const fragments: Fragment[] = readFileSync("data/9.txt", "utf8")
  .split("")
  .map(Number)
  .flatMap(toFragment);

const defragment = (fragments: Fragment[]): Fragment[] => {
  const isFreeSpace = (f: Fragment) => f.id === undefined;

  while (true) {
    let frontIndex = fragments.findIndex(isFreeSpace);
    // Find last isInUse index
    let backIndex = fragments.length - 1;
    while (backIndex >= 0 && isFreeSpace(fragments[backIndex])) backIndex--;
    if (backIndex < 0 || frontIndex < 0 || backIndex < frontIndex) break;
    fragments[frontIndex] = fragments[backIndex];
    fragments[backIndex] = {};
  }

  return fragments;
};
const part1 = defragment([...fragments]);

console.log("Part1: ",part1
    .map(({ id }, index) => (id ? id * index : 0))
    .reduce((sum, value) => sum + value, 0)
);
