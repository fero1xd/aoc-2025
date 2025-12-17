import {
  Effect,
  Graph,
  MutableHashSet,
  Number,
  Option,
  ParseResult,
  Schema,
  String,
} from "effect";
import { ProblemInput, Runtime } from "../utils";

class Position extends Schema.TaggedClass<Position>()("Position", {
  x: Schema.Number,
  y: Schema.Number,
  z: Schema.Number,
}) {
  public getDistance(posB: Position) {
    return Math.hypot(posB.x - this.x, posB.y - this.y, posB.z - this.z);
  }
}

const PositionFromString = Schema.transformOrFail(Schema.String, Position, {
  strict: true,
  decode: (str, _opts, ast) => {
    const parts = str.trim().split(",");
    if (parts.length !== 3) {
      return ParseResult.fail(
        new ParseResult.Type(ast, str, "Failed to process input string"),
      );
    }

    const nums = parts
      .map(Number.parse)
      .filter(Option.isSome)
      .map(Option.getOrThrow);

    if (nums.length !== 3) {
      return ParseResult.fail(
        new ParseResult.Type(ast, str, "Failed to process input string"),
      );
    }

    return ParseResult.succeed(
      new Position({
        x: nums[0]!,
        y: nums[1]!,
        z: nums[2]!,
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
  const input = yield* ProblemInput.read("sample.txt", "day8");

  const rawPositions = input.trim().split("\n").map(String.trim);

  const positions = yield* Effect.forEach(rawPositions, (p) =>
    Schema.decode(PositionFromString)(p),
  );

  const graph = Graph.undirected<Position, number>((mutable) => {
    for (const pos of positions) {
      Graph.addNode(mutable, pos);
    }

    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i]!;

      for (let j = i + 1; j < positions.length; j++) {
        const posB = positions[j]!;
        Graph.addEdge(mutable, i, j, pos.getDistance(posB));
      }
    }
  });

  let circuits = Graph.undirected<Position, number>((mutable) => {
    for (const pos of positions) {
      Graph.addNode(mutable, pos);
    }
  }) as Graph.Graph<Position, number, "undirected">;
  const edges = MutableHashSet.fromIterable(
    graph.pipe(Graph.edges, Graph.indices),
  );

  for (let i = 0; i < 10; i++) {
    let minEdge: [number, Graph.Edge<number> | null] = [-1, null];
    for (const id of edges) {
      const edge = Graph.getEdge(graph, id).pipe(Option.getOrThrow);
      if (minEdge[1] === null || edge.data < minEdge[1].data) {
        minEdge[1] = edge;
        minEdge[0] = id;
      }
    }

    circuits = Graph.mutate(circuits, (mutable) => {
      Graph.addEdge(mutable, minEdge[1]!.source, minEdge[1]!.target, 1);
    });

    MutableHashSet.remove(edges, minEdge[0]);
  }

  // console.log(Array.fromIterable(Graph.entries(Graph.edges(graph))));
  console.log(
    //Array.reduce(
    Graph.connectedComponents(circuits),
    //     .sort((a, b) => b.length - a.length)
    //     .slice(0, 3),

    //   1,
    //   (acc, c) => acc * c.length,
    // ),
  );
});

Runtime.runPromise(program);
