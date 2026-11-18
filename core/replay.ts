// The behavior check: play every level's par route through a Session and sum up
// the results in one line. Unchanged rules always print the same line, in the
// terminal (`deno task replay`) and in the browser (the Replay controls).

import type { Command } from "./session.ts";
import { Session } from "./session.ts";
import { LEVELS } from "./levels.ts";
import { type Direction, isSolved, type Puzzle } from "./puzzle.ts";

const LETTER: Record<string, Direction> = {
  u: "up",
  d: "down",
  l: "left",
  r: "right",
};

/** One list of commands per level: choose the level, then walk its par route. */
export function replayScript(): Command[][] {
  return LEVELS.map((level, index) => [
    { kind: "choose-level", level: index },
    ...[...level.par.toLowerCase()].map((letter): Command => ({
      kind: "move",
      direction: LETTER[letter],
    })),
  ]);
}

/** The summary line for the final puzzle of each level. */
export function summarize(finals: readonly Puzzle[]): string {
  const solved = finals.filter(isSolved).length;
  const moves = finals.reduce((sum, puzzle) => sum + puzzle.moves, 0);
  const pushes = finals.reduce((sum, puzzle) => sum + puzzle.pushes, 0);
  return `[replay] solved=${solved}/${finals.length} moves=${moves} pushes=${pushes}`;
}

/** Plays the whole script at once, with no browser. */
export function replayAll(): string {
  const session = new Session();
  const finals = replayScript().map((commands) => {
    for (const command of commands) session.dispatch(command);
    return session.getState().puzzle;
  });
  return summarize(finals);
}
