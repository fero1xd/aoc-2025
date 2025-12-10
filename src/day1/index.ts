import { Array, Data, Effect, Number, Option, Ref, String } from "effect";
import { Direction } from "effect/RedBlackTree";
import { ProblemInput, Runtime } from "../utils";

type Direction = Data.TaggedEnum<{
  Left: {};
  Right: {};
}>;

const { $match, Left, Right } = Data.taggedEnum<Direction>();

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("sample.txt", "day1");

  const pos = yield* Ref.make(50);
  const pass = yield* Ref.make(0);
  const instructions = Array.filter(
    String.split(input, "\n"),
    (l) => l.trim().length > 0,
  );

  yield* Effect.forEach(instructions, (i) =>
    Effect.gen(function* () {
      const direction = i.charAt(0) === "L" ? Left() : Right();
      const mag = Number.parse(i.substring(1)).pipe(
        Option.getOrThrowWith(() => new Error("LOL")),
      );

      yield* $match({
        Left: () => pos.pipe(Ref.update((p) => (p - mag) % 100)),
        Right: () => pos.pipe(Ref.update((p) => (p + mag) % 100)),
      })(direction);

      const currentPos = yield* Ref.get(pos);
      if (currentPos == 0) {
        yield* Ref.update(pass, (n) => n + 1);
      }
    }),
  );

  yield* Effect.log(yield* Ref.get(pass));
});

Runtime.runPromise(program);
