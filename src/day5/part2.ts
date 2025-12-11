import { Array, Effect, MutableHashSet, Number, Option } from "effect";
import { ProblemInput, Runtime } from "../utils";

const getFreshIds = Effect.fnUntraced(function* (str: string) {
  const ranges = str.trim().split("\n");

  const freshIds = MutableHashSet.empty<[number, number]>();

  for (const range of ranges) {
    const starting = Number.parse(range.split("-")[0]!).pipe(Option.getOrThrow);
    const ending = Number.parse(range.split("-")[1]!).pipe(Option.getOrThrow);

    freshIds.pipe(MutableHashSet.add([starting, ending]));
  }

  return freshIds;
});

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("input.txt", "day5");

  const [freshRanges] = input.split("\n\n");
  if (!freshRanges) {
    yield* Effect.fail("Invalid Input");
    return;
  }

  let total = 0;
  let start: number | null = null;

  const freshRangesSet = Array.fromIterable(
    yield* getFreshIds(freshRanges),
  ).sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < freshRangesSet.length; i++) {
    const [starting, ending] = Array.get(freshRangesSet, i).pipe(
      Option.getOrThrow,
    );
    if (start === null || start < starting) {
      start = starting;
    }

    if (start <= ending) {
      total += ending - start + 1;
      start = ending + 1;
    }
  }

  console.log(total);
});

Runtime.runPromise(program);
