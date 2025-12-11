import { Array, Effect, Number, Option, String } from "effect";
import { ProblemInput, Runtime } from "../utils";

const getHighest = (arr: number[]) => {
  let highest = -1;
  let idx = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]! > highest) {
      highest = arr[i]!;
      idx = i;
    }
  }

  return { highest, idx };
};

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("input.txt", "day3");
  const banks = input
    .split("\n")
    .map(String.trim)
    .filter(String.isNonEmpty)
    .map(String.split(""))
    .map(Array.map(Number.parse));
  let sum = 0;

  for (const b of banks) {
    const bank = Array.filter(b, Option.isSome).map(Option.getOrThrow);
    const { highest, idx: highestIdx } = getHighest(bank);

    const { highest: leftHighest } = getHighest(bank.slice(0, highestIdx));
    const { highest: rightHighest } = getHighest(bank.slice(highestIdx + 1));

    if (leftHighest === -1) {
      sum += highest * 10 + rightHighest;
    } else if (rightHighest === -1) {
      sum += leftHighest * 10 + highest;
    } else {
      sum += Math.max(highest * 10 + rightHighest, leftHighest * 10 + highest);
    }
  }

  console.log(sum);
});

Runtime.runPromise(program);
