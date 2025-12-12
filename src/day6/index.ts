import { Effect, String } from "effect";
import { ProblemInput, Runtime } from "../utils";

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("sample.txt", "day6");
  const problems = input
    .trim()
    .split("\n")
    .map(String.trim)
    .map((line) => line.split(" ").filter(Boolean));

  let sum = 0;

  for (let i = 0; i < problems[0]!.length; i++) {
    const operation = problems[problems.length - 1]![i];

    if (operation !== "+" && operation !== "*") {
      yield* Effect.fail("Invalid Operation");
      return;
    }
    let result = operation === "*" ? 1 : 0;

    for (let j = 0; j < problems.length - 1; j++) {
      switch (operation) {
        case "*": {
          result *= Number(problems[j]![i]!);
          break;
        }
        case "+": {
          result += Number(problems[j]![i]!);
        }
      }
    }

    sum += result;
  }

  console.log(sum);
});

Runtime.runPromise(program);
