import { FileSystem, Path } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { Effect, Layer, ManagedRuntime } from "effect";

type BuildTuple<N extends number, T extends any[] = []> = T["length"] extends N
  ? T
  : BuildTuple<N, [...T, unknown]>;

type AddOne<N extends number> = [...BuildTuple<N>, unknown]["length"];

type CountingUnion<
  N extends number,
  Acc extends any[] = [],
  Out = never,
> = Acc["length"] extends N
  ? Out
  : CountingUnion<N, [...Acc, unknown], Out | AddOne<Acc["length"]>>;

export class ProblemInput extends Effect.Service<ProblemInput>()(
  "ProblemInput",
  {
    effect: Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const p = yield* Path.Path;

      const read = Effect.fnUntraced(function* (
        name: `${"sample" | "input"}.txt`,
        day: `day${CountingUnion<12>}`,
      ) {
        return yield* fs.readFileString(p.join(import.meta.dir, day, name));
      });

      return { read };
    }),
    accessors: true,
  },
) {}

const Dependencies = ProblemInput.Default.pipe(
  Layer.provideMerge(BunContext.layer),
);

export const Runtime = ManagedRuntime.make(Dependencies);
