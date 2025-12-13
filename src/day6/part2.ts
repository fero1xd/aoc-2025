import { Array, Effect, Number, Option, String } from "effect";
import { ProblemInput, Runtime } from "../utils";

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("input.txt", "day6");
  const problems = input
    .trim()
    .split("\n")
    // hacky
    .map((line) =>
      line.includes("+") ? line.split(" ").filter(Boolean) : line.split(" "),
    );

  const operations = Array.last(problems).pipe(Option.getOrThrow);
  const problemsLen = Array.length(problems) - 1;

  // console.log({ probsems });

  let skipN = 0;
  for (let i = 0; i < operations.length; i++) {
    const operands: string[][] = [
      // ["123"],
      // ["", "45"],
      // ["", "", "6"],
      // ["328"],
      // ["64", ""],
      // ["98", ""],
      // ["", "51"],
      // ["387"],
      // ["215"],
    ];
    // calculate max no. of digits in a col
    // subtract current digit len from max
    // Gives us the amount of spaces
    // These amount of spaces should be present in the array
    // Either in front or behind the number
    //
    // Steps
    // 1. Store elements of a column in a matrix
    //    Each row contains the number with its spaces
    // 2. calculate max no. of digits in a col
    // 3. Loop over the matrix and each row
    //     Subtract current no. of digits from max
    //      This will give *required* amount of spaces
    // 4. Remove extra spaces
    const operation = operations[i];
    if (operation !== "*" && operation !== "+") {
      return yield* Effect.fail("Invalid Operation");
    }

    for (let rowPtr = 0; rowPtr < problemsLen; rowPtr++) {
      const mat: string[] = [];
      let seenCount = 0;
      for (let colPtr = 0; colPtr < problems[rowPtr]!.length; colPtr++) {
        const num = Number.parse(problems[rowPtr]![colPtr]!).pipe(
          Option.getOrNull,
        );

        if (num === null && problems[rowPtr]![colPtr] === "") {
          if (seenCount < skipN) {
            continue;
          }
          mat.push("");
        } else {
          if (seenCount === skipN) {
            mat.push(`${num}`);
            seenCount++;
          } else if (seenCount < skipN) {
            seenCount++;
            continue;
          } else {
            break;
          }
        }
      }
      operands.push(mat);
    }

    skipN++;

    console.log({ operands });
  }

  let sum = 0;
});

function getDigitsCount(num: number) {
  let n = num;
  let c = 0;

  while (n !== 0) {
    c += 1;
    n = Math.floor(n / 10);
  }

  return c;
}

/**
 * @n 0 Based index from right
 */
function getNthDigit(num: number, n: number): number {
  return Math.floor(Math.abs(num) / Math.pow(10, n)) % 10;
}

Runtime.runPromise(program);
