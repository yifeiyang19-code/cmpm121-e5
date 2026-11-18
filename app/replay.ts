import { type Puzzle, replayScript, summarize } from "../core/mod.ts";
import type { Controller } from "./controllers.ts";

const STEP_MS = 60;

// A controller with no player: it plays every level's par route, one command
// per step, then prints the same summary line as `deno task replay`.
export const replay: Controller = {
  label: "Replay par routes",
  attach(session) {
    const script = replayScript();
    const finals: Puzzle[] = [];
    let level = 0;
    let step = 0;
    const timer = setInterval(() => {
      if (step === script[level].length) {
        finals.push(session.getState().puzzle);
        level++;
        step = 0;
        if (level === script.length) {
          clearInterval(timer);
          console.log(summarize(finals));
          return;
        }
      }
      session.dispatch(script[level][step++]);
    }, STEP_MS);
    return () => clearInterval(timer);
  },
};
