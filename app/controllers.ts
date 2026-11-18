import type { Command, Session } from "../core/mod.ts";
import type { BoardInput } from "./tileClicks.ts";
import { replay } from "./replay.ts";

// Strategy: each controller is one interchangeable way of turning input into
// Commands. The app attaches exactly one at a time, and the board, the session,
// and the other controllers do not know which.
export interface Controller {
  readonly label: string;
  /** Starts listening for input. Returns a function that stops listening. */
  attach(session: Session, board: BoardInput): () => void;
}

const KEYS: Record<string, Command> = {
  arrowup: { kind: "move", direction: "up" },
  arrowdown: { kind: "move", direction: "down" },
  arrowleft: { kind: "move", direction: "left" },
  arrowright: { kind: "move", direction: "right" },
  w: { kind: "move", direction: "up" },
  s: { kind: "move", direction: "down" },
  a: { kind: "move", direction: "left" },
  d: { kind: "move", direction: "right" },
  r: { kind: "restart" },
};

const keyboard: Controller = {
  label: "Keyboard",
  attach(session) {
    const onKeyDown = (event: KeyboardEvent) => {
      // Leave shortcuts such as Cmd+R and Ctrl+Z to the browser.
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const command = KEYS[event.key.toLowerCase()];
      if (!command) return;
      event.preventDefault();
      session.dispatch(command);
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  },
};

export const CONTROLLERS = { keyboard, replay };

export type ControllerName = keyof typeof CONTROLLERS;

/** Keyboard, unless the page was opened with ?replay. */
export function initialController(): ControllerName {
  const params = new URLSearchParams(globalThis.location.search);
  return params.has("replay") ? "replay" : "keyboard";
}
