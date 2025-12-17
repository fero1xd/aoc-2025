import { Effect, Number, Option, ParseResult, Schema } from "effect";
import { ProblemInput, Runtime } from "../utils";

class Position extends Schema.TaggedClass<Position>()("Position", {
  x: Schema.Number,
  y: Schema.Number,
}) {
  public getAreaRectangle(cornerB: Position) {
    return Math.abs(cornerB.x - this.x + 1) * Math.abs(cornerB.y - this.y + 1);
  }
}

const PositionFromString = Schema.transformOrFail(Schema.String, Position, {
  strict: true,
  decode: (str, _opts, ast) => {
    const parts = str.trim().split(",");
    if (parts.length !== 2) {
      return ParseResult.fail(
        new ParseResult.Type(ast, str, "Failed to process input string"),
      );
    }

    const nums = parts
      .map(Number.parse)
      .filter(Option.isSome)
      .map(Option.getOrThrow);

    if (nums.length !== 2) {
      return ParseResult.fail(
        new ParseResult.Type(ast, str, "Failed to process input string"),
      );
    }

    return ParseResult.succeed(
      new Position({
        x: nums[0]!,
        y: nums[1]!,
      }),
    );
  },
  encode: (pos, _, ast) =>
    ParseResult.fail(
      new ParseResult.Forbidden(
        ast,
        pos,
        "Encoding position back to string is not available",
      ),
    ),
});

const program = Effect.gen(function* () {
  const input = yield* ProblemInput.read("input.txt", "day9");

  const coordsRaw = input.trim().split("\n");

  const coords = yield* Effect.forEach(coordsRaw, (c) =>
    Schema.decode(PositionFromString)(c),
  );

  let maxArea = 0;

  for (let i = 0; i < coords.length; i++) {
    const c1 = coords[i]!;
    for (let j = 0; j < coords.length; j++) {
      if (i === j) continue;
      const c2 = coords[j]!;

      const area = c1.getAreaRectangle(c2);
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  console.log({
    maxArea,
  });
});

Runtime.runPromise(program);
