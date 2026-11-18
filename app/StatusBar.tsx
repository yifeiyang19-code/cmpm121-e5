import type { Puzzle } from "../core/mod.ts";

export function StatusBar({ puzzle }: { puzzle: Puzzle }) {
  return (
    <dl className="status">
      <dt>Level</dt>
      <dd>{puzzle.layout.name}</dd>
      <dt>Moves</dt>
      <dd>{puzzle.moves}</dd>
    </dl>
  );
}
