import {
  Array,
  Data,
  Effect,
  Number,
  Option,
  Ref,
  String,
  SynchronizedRef,
} from "effect";
import { Direction } from "effect/RedBlackTree";
import { ProblemInput, Runtime } from "../utils";

type Direction = Data.TaggedEnum<{
  Left: {};
  Right: {};
}>;

const { Left, Right, $is } = Data.taggedEnum<Direction>();

const mod = Effect.fnUntraced(function* (m: number, n: number) {
  return ((m % n) + n) % n;
});

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("input.txt", "day1");

  const pos = yield* SynchronizedRef.make(50);
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
      const isRight = $is("Right")(direction);

      yield* Effect.loop(mag, {
        while: (res) => res != 0,
        step: (res) => res - 1,
        body: () =>
          pos.pipe(
            Ref.updateAndGet((l) => (isRight ? l + 1 : l - 1)),
            Effect.andThen((newRes) => mod(newRes, 100)),
            Effect.flatMap((newRes) =>
              newRes === 0 ? Ref.update(pass, (p) => p + 1) : Effect.void,
            ),
          ),
        discard: true,
      });

      if (
        yield* pos.pipe(
          Ref.get,
          Effect.andThen((n) => mod(n, 100)),
          Effect.flatMap((res) => Effect.succeed(res === 0)),
        )
      )
        return;

      const newPos = yield* SynchronizedRef.updateAndGetEffect(pos, (p) =>
        mod(p, 100),
      );

      if (newPos == 0) {
        yield* Ref.update(pass, (n) => n + 1);
      }
    }),
  );

  yield* Effect.log(yield* Ref.get(pass));
});

Runtime.runPromise(program);
