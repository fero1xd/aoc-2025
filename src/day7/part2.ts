import { Array, Effect, Option, pipe, String } from "effect";
import { ProblemInput, Runtime } from "../utils";

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("input.txt", "day7");
  const manifold = input
    .trim()
    .split("\n")
    .map(String.trim)
    .map(String.split(""));

  const beamsMap: number[][] = pipe(
    manifold,
    Array.map((a) => Array.map(a, (b) => (b === "S" ? 1 : 0))),
  );
  const width = manifold[0]!.length;

  for (let row = 0; row < beamsMap.length - 1; row++) {
    const line = Array.unsafeGet(beamsMap, row);
    const nextLine = Array.unsafeGet(beamsMap, row + 1);
    const nextManifoldLine = Array.unsafeGet(manifold, row + 1);

    for (let i = 0; i < width; i++) {
      const currentVal = line[i]!;

      if (line[i] === 0) continue;

      if (nextManifoldLine[i] === ".") {
        nextLine[i]! += currentVal;
        continue;
      }

      nextLine[i - 1]! += currentVal;
      nextLine[i + 1]! += currentVal;
    }
  }

  const result = Array.last(beamsMap).pipe(
    Option.getOrThrow,
    Array.reduce(0, (acc, num) => acc + num),
  );

  console.log({ result });
});

Runtime.runPromise(program);
