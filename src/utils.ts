import { FileSystem, Path } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { Effect, Layer, ManagedRuntime } from "effect";

export class ProblemInput extends Effect.Service<ProblemInput>()(
  "ProblemInput",
  {
    effect: Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const p = yield* Path.Path;

      const read = Effect.fnUntraced(function* (
        name: `${"sample" | "input"}.txt`,
        day: `day${number}`,
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
