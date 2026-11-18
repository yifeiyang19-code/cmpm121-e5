import type { Position } from "../core/mod.ts";

/** What a controller can hear from the board: which tile the player clicked. */
export interface BoardInput {
  /** Calls listener with each clicked tile's position. Returns a function that stops listening. */
  onTileClick(listener: (at: Position) => void): () => void;
}

// Observer again, pointing the other way: the board announces where a click
// landed, and whichever controller is attached may listen. The board never
// decides what a click means; that is the controller's job.
export class TileClicks implements BoardInput {
  readonly #listeners = new Set<(at: Position) => void>();

  onTileClick(listener: (at: Position) => void): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  announce(at: Position): void {
    for (const listener of this.#listeners) listener(at);
  }
}
