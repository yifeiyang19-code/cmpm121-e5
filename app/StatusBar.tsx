import type { Puzzle } from "../core/mod.ts";

export function StatusBar({ puzzle, par }: { puzzle: Puzzle; par: number }) {
  return (
    <dl className="status">
      <dt>Level</dt>
      <dd>{puzzle.layout.name}</dd>
      <dt>Moves</dt>
      <dd>{puzzle.moves}</dd>
      <dt>Pushes</dt>
      <dd>{puzzle.pushes}</dd>
      <dt>Par</dt>
      <dd>{par} moves</dd>
    </dl>
  );
}
