import { readFileSync } from "fs";

const { patterns, designs } = ((
  fileName: string
): { patterns: string[]; designs: string[] } => {
  const [patterns, designs] = readFileSync(fileName, "utf8")
    .split("\n\n")
    .map((x) => x.split(/\n|,\s*/));
  return { patterns, designs };
})("data/19.txt");

const memoizedCheckPatterns = (design, patterns, cache = {}) => {
  if (design in cache) 
    return cache[design];
  if (design.length === 0) 
    return 1;
  const findings = patterns
    .filter(((pattern) => design.startsWith(pattern)))
    .map((pattern) => memoizedCheckPatterns(design.slice(pattern.length), patterns, cache))
    .reduce((acc, f) => acc + f, 0);
  cache[design] = findings;
  return findings;
};

const result = designs.map((design) => memoizedCheckPatterns(design, patterns));

console.log("Part1: ", result.filter((x) => x > 0).length);
console.log("Part2: ", result.reduce((a, b) => a + b));
