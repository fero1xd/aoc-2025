import { Data, Effect, MutableHashSet, Ref, String } from "effect";
import { ProblemInput, Runtime } from "../utils";

type Position = {
  row: number;
  col: number;
};
const Position = Data.case<Position>();

function isTachyonBeam(str: string) {
  return str === "S" || str === "|";
}

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("input.txt", "day7");
  const manifold = input
    .trim()
    .split("\n")
    .map(String.trim)
    .map(String.split(""));

  const width = manifold[0]!.length;
  const splitCount = yield* Ref.make<number>(0);
  const incrementSplitCount = Ref.updateAndGet(splitCount, (c) => c + 1);
  const getSplitCount = Ref.get(splitCount);

  for (let row = 0; row < manifold.length - 1; row++) {
    const newBeams = MutableHashSet.empty<Position>();

    for (let col = 0; col < width; col++) {
      const el = manifold[row]![col]!;
      if (!isTachyonBeam(el)) continue;

      // Check for empty space below
      if (manifold[row + 1]![col] === ".") {
        newBeams.pipe(MutableHashSet.add(Position({ row: row + 1, col })));
        continue;
      }

      // facing a splitter down
      yield* incrementSplitCount;

      if (col + 1 < width) {
        newBeams.pipe(
          MutableHashSet.add(Position({ row: row + 1, col: col + 1 })),
        );
      }
      if (col - 1 >= 0) {
        newBeams.pipe(
          MutableHashSet.add(Position({ row: row + 1, col: col - 1 })),
        );
      }
    }

    for (const beam of newBeams) {
      manifold[beam.row]![beam.col] = "|";
    }
  }

  console.log({ splitCount: yield* getSplitCount });
});

Runtime.runPromise(program);
