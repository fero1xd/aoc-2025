import {
  Array,
  Data,
  Effect,
  HashSet,
  MutableHashSet,
  Number,
  Option,
  Predicate,
  String,
} from "effect";
import { ProblemInput, Runtime } from "../utils";

class Range extends Data.Class<{
  readonly starting: number;
  readonly ending: number;
}> {}

const getFreshIds = Effect.fnUntraced(function* (str: string) {
  const ranges = str.trim().split("\n");

  const freshIds = MutableHashSet.empty<Range>();

  for (const range of ranges) {
    const starting = Number.parse(range.split("-")[0]!).pipe(Option.getOrThrow);
    const ending = Number.parse(range.split("-")[1]!).pipe(Option.getOrThrow);

    freshIds.pipe(MutableHashSet.add(new Range({ starting, ending })));
  }

  const resultingSet = MutableHashSet.empty<[number, number]>();
  for (const r of freshIds) {
    resultingSet.pipe(MutableHashSet.add([r.starting, r.ending]));
  }

  return HashSet.fromIterable(resultingSet);
});

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("input.txt", "day5");

  const [freshRanges, availableIds] = input.split("\n\n");
  if (!freshRanges || !availableIds) {
    yield* Effect.fail("Invalid Input");
    return;
  }

  const freshRangesSet = Array.fromIterable(yield* getFreshIds(freshRanges));

  const productIds = availableIds
    .split("\n")
    .map(String.trim)
    .filter(String.isNonEmpty)
    .map(Number.parse)
    .map(Option.getOrThrow);

  const sum = Array.reduce(productIds, 0, (acc, id) =>
    freshRangesSet.some(([starting, ending]) => id >= starting && id <= ending)
      ? acc + 1
      : acc,
  );

  console.log(sum);
});

Runtime.runPromise(program);
