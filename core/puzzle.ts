// One level in play. A Puzzle is immutable: move() returns a new Puzzle and
// leaves the old one untouched, so anyone holding an old Puzzle still sees
// exactly what was true then.

export type Direction = "up" | "down" | "left" | "right";

export interface Position {
  readonly x: number;
  readonly y: number;
}

/** The parts of a level that never change while it is played. */
export interface Layout {
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly walls: readonly Position[];
  readonly goals: readonly Position[];
}

export interface Puzzle {
  readonly layout: Layout;
  readonly player: Position;
  readonly crates: readonly Position[];
  readonly moves: number;
}

const STEP: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function samePosition(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

function includes(list: readonly Position[], p: Position): boolean {
  return list.some((q) => samePosition(q, p));
}

export function isWall(layout: Layout, p: Position): boolean {
  return includes(layout.walls, p);
}

export function isGoal(layout: Layout, p: Position): boolean {
  return includes(layout.goals, p);
}

export function hasCrate(puzzle: Puzzle, p: Position): boolean {
  return includes(puzzle.crates, p);
}

function nextPosition(p: Position, direction: Direction): Position {
  return { x: p.x + STEP[direction].x, y: p.y + STEP[direction].y };
}

/**
 * Reads a level drawn in the common Sokoban text format:
 * `#` wall, `@` player, `$` crate, `.` goal, `*` crate on a goal,
 * `+` player on a goal, and a space for floor.
 */
export function parsePuzzle(name: string, rows: readonly string[]): Puzzle {
  const walls: Position[] = [];
  const goals: Position[] = [];
  const crates: Position[] = [];
  let player: Position | undefined;
  rows.forEach((row, y) => {
    [...row].forEach((symbol, x) => {
      if (symbol === "#") walls.push({ x, y });
      if (".*+".includes(symbol)) goals.push({ x, y });
      if ("$*".includes(symbol)) crates.push({ x, y });
      if ("@+".includes(symbol)) player = { x, y };
    });
  });
  if (!player) throw new Error(`Level "${name}" has no player`);
  if (crates.length !== goals.length) {
    throw new Error(`Level "${name}" needs as many crates as goals`);
  }
  const width = Math.max(...rows.map((row) => row.length));
  const layout = { name, width, height: rows.length, walls, goals };
  return { layout, player, crates, moves: 0 };
}

/**
 * Walks the player one tile, pushing a crate if one is in the way. Returns the
 * same Puzzle, unchanged, when a wall or a second crate blocks the move.
 */
export function move(puzzle: Puzzle, direction: Direction): Puzzle {
  const target = nextPosition(puzzle.player, direction);
  if (isWall(puzzle.layout, target)) return puzzle;
  if (!hasCrate(puzzle, target)) {
    return { ...puzzle, player: target, moves: puzzle.moves + 1 };
  }
  const beyond = nextPosition(target, direction);
  if (isWall(puzzle.layout, beyond) || hasCrate(puzzle, beyond)) return puzzle;
  return {
    ...puzzle,
    player: target,
    crates: puzzle.crates.map((c) => samePosition(c, target) ? beyond : c),
    moves: puzzle.moves + 1,
  };
}

export function isSolved(puzzle: Puzzle): boolean {
  return puzzle.crates.every((crate) => isGoal(puzzle.layout, crate));
}
