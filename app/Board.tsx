import {
  hasCrate,
  isGoal,
  isWall,
  type Position,
  type Puzzle,
  samePosition,
} from "../core/mod.ts";
import type { TileClicks } from "./tileClicks.ts";

// A view: given a puzzle, what the board looks like. It reads the puzzle and
// changes nothing. When a tile is clicked, it announces where, and leaves what
// the click means to whichever controller is listening.
export function Board(
  { puzzle, clicks }: { puzzle: Puzzle; clicks: TileClicks },
) {
  const { width, height } = puzzle.layout;
  const tiles = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      tiles.push(
        <Tile
          key={`${x},${y}`}
          puzzle={puzzle}
          at={{ x, y }}
          clicks={clicks}
        />,
      );
    }
  }
  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${width}, var(--tile))` }}
      aria-label={puzzle.layout.name}
    >
      {tiles}
    </div>
  );
}

function Tile(
  { puzzle, at, clicks }: { puzzle: Puzzle; at: Position; clicks: TileClicks },
) {
  const classes = ["tile"];
  if (isWall(puzzle.layout, at)) classes.push("wall");
  if (isGoal(puzzle.layout, at)) classes.push("goal");
  if (hasCrate(puzzle, at)) classes.push("crate");
  if (samePosition(puzzle.player, at)) classes.push("player");
  return (
    <div
      className={classes.join(" ")}
      onClick={() => clicks.announce(at)}
    />
  );
}
