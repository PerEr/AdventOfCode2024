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

console.log("Part1: ", part1
    .map(({ id }, index) => (id ? id * index : 0))
    .reduce((sum, value) => sum + value, 0)
);

const defragmentOneIntact = (fragments: Fragment[], backIndexR: number): number => {
  const isFreeSpace = (startIx: number) => (f: Fragment, ix: number) =>
    ix >= startIx && f.id === undefined;

  while (backIndexR >= 0 && isFreeSpace(0)(fragments[backIndexR], backIndexR))
    backIndexR--;
  if (backIndexR < 0) return backIndexR;
  let backIndexL = backIndexR;
  while (
    backIndexL >= 0 &&
    fragments[backIndexL]?.id === fragments[backIndexR].id
  )
    backIndexL--;
  if (backIndexL < 0) return backIndexL;
  const backLen = backIndexR - backIndexL;

  let frontIndexL = 0;
  while (true) {
    frontIndexL = fragments.findIndex(isFreeSpace(frontIndexL));
    if (frontIndexL < 0 || frontIndexL >= backIndexL) return backIndexL;
    let frontIndexR = frontIndexL;
    while (
      frontIndexR < fragments.length &&
      fragments[frontIndexR]?.id === fragments[frontIndexL].id
    )
      frontIndexR++;
    const frontLen = frontIndexR - frontIndexL;
    if (frontLen >= backLen) {
      for (let i = 0; i < backLen; i++) {
        fragments[frontIndexL + i] = fragments[backIndexL + i + 1];
        fragments[backIndexL + i + 1] = {};
      }
      return backIndexL;
    }
    frontIndexL = frontIndexR;
  }
};

const defragmentIntact = (fragments: Fragment[]): Fragment[] => {
  let backIndex = fragments.length - 1;
  while (backIndex >= 0) backIndex = defragmentOneIntact(fragments, backIndex);
  return fragments;
};

const part2 = defragmentIntact([...fragments]);
console.log("Part2: ", part2
    .map(({ id }, index) => (id ? id * index : 0))
    .reduce((sum, value) => sum + value, 0)
);
