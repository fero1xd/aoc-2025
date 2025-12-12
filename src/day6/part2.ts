import { Effect, Number, Option, String } from "effect";
import { ProblemInput, Runtime } from "../utils";

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("sample.txt", "day6");
  const problems = input
    .trim()
    .split("\n")
    .map(String.trim)
    // hacky
    .map((line) =>
      line.includes("+") ? line.split(" ").filter(Boolean) : line.split(" "),
    );

  console.log(problems);

  let sum = 0;

  for (let i = 0; i < problems[problems.length - 1]!.length; i++) {
    const operation = problems[problems.length - 1]![i];

    if (operation !== "+" && operation !== "*") {
      yield* Effect.fail("Invalid Operation");
      return;
    }

    const matrix: string[][] = [];
    for (let j = 0; j < problems.length - 1; j++) {
      const res: string[] = [];
      let hasSeenNum = false;
      for (let k = 0; k < problems[j]!.length; k++) {
        const digit = Number.parse(problems[j]![k + i]!).pipe(Option.getOrNull);
        if (digit !== null) {
          if (hasSeenNum) break;
          hasSeenNum = true;
        }
        res.push(problems[j]![k + i]!);
      }

      matrix.push(res);
    }
    console.log(matrix);

    // const arr: number[] = [];

    // for (let j = 0; j < problems.length - 1; j++) {
    //   arr.push(Number.parse(problems[j]![i]!).pipe(Option.getOrThrow));
    // }

    // const maxDigits = getDigitsCount(arr.toSorted((a, b) => b - a)[0]!);
    // const newNums: number[] = [];

    // for (let j = 0; j < maxDigits; j++) {
    //   let newNum = 0;
    //   for (let k = 0; k < arr.length; k++) {
    //     const digit = getNthDigit(arr[k]!, j);
    //     if (digit !== 0) {
    //       newNum = newNum * 10 + digit;
    //     }
    //   }
    //   newNums.push(newNum);
    // }

    // let result = operation === "*" ? 1 : 0;
    // for (const num of newNums) {
    //   switch (operation) {
    //     case "*": {
    //       result *= num;
    //       break;
    //     }
    //     case "+": {
    //       result += num;
    //     }
    //   }
    // }

    // console.log({
    //   og: arr,
    //   newNums,
    //   maxDigits,
    //   operation,
    //   result,
    // });

    // sum += result;
  }

  console.log(sum);
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
