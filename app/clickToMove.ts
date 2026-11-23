import type { Direction, Position } from "../core/mod.ts";
import type { Controller } from "./controllers.ts";

function directionTo(player: Position, at: Position): Direction | undefined {
  const dx = at.x - player.x;
  const dy = at.y - player.y;
  if (dx === 1 && dy === 0) return "right";
  if (dx === -1 && dy === 0) return "left";
  if (dx === 0 && dy === 1) return "down";
  if (dx === 0 && dy === -1) return "up";
  return undefined;
}

export const clickToMove: Controller = {
  label: "Click a neighboring tile",
  attach(session, board) {
    const stop = board.onTileClick((at) => {
      const { player } = session.getState().puzzle;
      const direction = directionTo(player, at);
      if (direction) session.dispatch({ kind: "move", direction });
    });
    return stop;
  },
};
