import { readFileSync } from "fs";

const content = readFileSync("data/3.txt", "utf8");

const part1 = (content: string): number => 
    Array.from(content.matchAll(/mul\((\d+),(\d+)\)/g))
        .map((match) => Number(match[1]) * Number(match[2]))
        .reduce((acc, value) => acc + value, 0);
console.log("Part1: ", part1(content));

const part2 = (content: string): number => {
    let accumulate = true;
    let result = 0;
    for (const match of content.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don\'t\(\)/g)) {
        if (match[0] === 'do()')  accumulate = true;
        if (match[0] === 'don\'t()') accumulate = false;
        if (accumulate && match[0].startsWith('mul(')) result += Number(match[1]) * Number(match[2]);
    }
    return result;
};

console.log("Part2: ", part2(content));
