import { Array, Effect, Number, Option, String } from "effect";
import { ProblemInput, Runtime } from "../utils";

const isRangeInvalid = (range: string) =>
  Effect.gen(function* () {
    const [start, end] = range.split("-");
    if (!start || !end) {
      yield* Effect.fail("LOL");
      return 0;
    }

    const [startNum, endNum] = [
      Number.parse(start).pipe(Option.getOrThrow),
      Number.parse(end).pipe(Option.getOrThrow),
    ];

    const results = yield* Effect.loop(startNum, {
      while: (num) => num <= endNum,
      step: (num) => num + 1,
      body: (currentNum) =>
        Effect.gen(function* () {
          const num = `${currentNum}`;
          let seq = num.charAt(0);

          for (let i = 1; i < num.length; i++) {
            let isInvalid = true;
            for (let j = 0; j < num.length; j += seq.length) {
              if (num.substring(j, j + seq.length) !== seq) {
                isInvalid = false;
                break;
              }
            }
            if (isInvalid) {
              return Option.some(currentNum);
            }
            if (seq.length > Math.ceil(num.length / 2)) {
              return Option.none();
            }
            seq += `${num.charAt(i)}`;
          }

          return Option.none();
        }),
    }).pipe(Effect.andThen((r) => r.map(Option.getOrElse(() => 0))));

    return Array.reduce(results, 0, (acc, r) => acc + r);
  });

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("input.txt", "day2");
  const ranges = Array.map(String.split(input, ","), (s) => String.trim(s));

  const sum = yield* Effect.reduce(ranges, 0, (acc, range) =>
    isRangeInvalid(range).pipe(Effect.map((res) => acc + res)),
  );
  console.log(sum);
});

Runtime.runPromise(program);
