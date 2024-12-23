import { readFileSync } from "fs";

interface Registers {
  A: bigint
  B: bigint;
  C: bigint;
  IP: number;
}

interface Instruction {
  opcode: number;
  operand: number;
}

const { registers, program } = ((fileName) => {
  const input = readFileSync(fileName, "utf8");

  const r = Object.fromEntries(
    Array.from(input.matchAll(/^Register (\w): (\d+)$/gm)).map(
      ([_, key, value]) => [key, parseInt(value, 10)]
    )
  );

  const registers: Registers = {
    A: BigInt(r.A),
    B: BigInt(r.B),
    C: BigInt(r.C),
    IP: 0,
  };

  const rawProgram =
    input
      .match(/^Program: ([\d,]+)$/m)?.[1]
      .split(",")
      .map(Number) || [];

  const program: Instruction[] = rawProgram.reduce((acc, _, i, src) => {
    if (i % 2 === 0) acc.push({ opcode: src[i], operand: src[i + 1] });
    return acc;
  }, [] as Instruction[]);

  return { registers, program };
})("data/17.txt");

const valueFromOperand = (operand: number, registers: Registers): bigint => {
  return [0n, 1n, 2n, 3n, registers.A, registers.B, registers.C][operand];
};

const runProgram = (program: Instruction[], registers: Registers) => {
  const output: bigint[] = [];

  const instructions: Array<(operand: number) => void> = [
    // 0: adv
    (operand) => {
      registers.A /= 2n ** valueFromOperand(operand, registers);
    },
    // 1: bxl
    (operand) => {
      registers.B ^= BigInt(operand);
    },
    // 2: bst
    (operand) => {
      registers.B = valueFromOperand(operand, registers) % 8n;
    },
    // 3: jnz
    (operand) => {
      registers.IP = registers.A !== 0n ? operand / 2 : registers.IP;
    },
    // 4: bxc
    () => {
      registers.B ^= registers.C;
    },
    // 5: out
    (operand) => {
      output.push(valueFromOperand(operand, registers) % 8n);
    },
    // 6: bdv
    (operand) => {
      registers.B = registers.A / 2n ** valueFromOperand(operand, registers);
    },
    // 7: cdv
    (operand) => {
      registers.C = registers.A / 2n ** valueFromOperand(operand, registers);
    },
  ];

  while (registers.IP < program.length) {
    const { opcode, operand } = program[registers.IP];
    registers.IP += 1;
    instructions[opcode](operand);
  }

  return output;
};

const result = runProgram(program, registers);
console.log("Part1: ", result.join(","));
