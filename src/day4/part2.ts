import { Array, Effect, String } from "effect";
import { ProblemInput, Runtime } from "../utils";

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("input.txt", "day4");

  const lines = input
    .split("\n")
    .map(String.trim)
    .filter(String.isNonEmpty)
    .map(String.split(""));

  const ROLL = "@" as const;
  const NULL = "." as const;
  let sum = 0;

  function getAvailableRolls() {
    let count = 0;
    const indexes: number[][] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      for (let j = 0; j < line.length; j++) {
        const element = line[j]!;
        if (element === NULL) continue;

        const left = j === 0 ? null : line[j - 1]!;
        const right = j === line.length - 1 ? null : line[j + 1]!;
        const top = i === 0 ? null : lines[i - 1]![j]!;
        const bottom = i === lines.length - 1 ? null : lines[i + 1]![j]!;

        const tr = top && right ? lines[i - 1]![j + 1]! : null;
        const tl = top && left ? lines[i - 1]![j - 1]! : null;
        const br = bottom && right ? lines[i + 1]![j + 1]! : null;
        const bl = bottom && left ? lines[i + 1]![j - 1]! : null;

        const arr = [top, bottom, left, right, tr, tl, br, bl];
        const total = Array.reduce(arr, 0, (acc, val) =>
          val === ROLL ? acc + 1 : acc,
        );
        if (total < 4) {
          count += 1;
          indexes.push([i, j]);
        }
      }
    }

    return { count, indexes };
  }

  while (true) {
    const { count, indexes } = getAvailableRolls();
    if (count === 0) break;
    sum += count;

    for (const pair of indexes) {
      lines[pair[0]!]![pair[1]!] = NULL;
    }
  }

  console.log(sum);
});

Runtime.runPromise(program);
