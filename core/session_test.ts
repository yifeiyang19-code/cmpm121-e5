import { assertEquals } from "@std/assert";
import { Session } from "./session.ts";
import { LEVELS } from "./levels.ts";
import { isSolved } from "./puzzle.ts";
import { replayAll, replayScript } from "./replay.ts";

Deno.test("subscribers hear about each change, and only about changes", () => {
  const session = new Session();
  let heard = 0;
  session.subscribe(() => heard++);
  session.dispatch({ kind: "move", direction: "right" });
  session.dispatch({ kind: "move", direction: "up" });
  session.dispatch({ kind: "move", direction: "up" }); // into a wall
  assertEquals(heard, 2);
});

Deno.test("an unsubscribed listener hears nothing more", () => {
  const session = new Session();
  let heard = 0;
  const unsubscribe = session.subscribe(() => heard++);
  unsubscribe();
  session.dispatch({ kind: "move", direction: "right" });
  assertEquals(heard, 0);
});

Deno.test("restart returns to the level's starting position", () => {
  const session = new Session();
  const start = session.getState();
  session.dispatch({ kind: "move", direction: "right" });
  session.dispatch({ kind: "restart" });
  assertEquals(session.getState(), start);
});

Deno.test("every level's par route solves it", () => {
  const session = new Session();
  replayScript().forEach((commands, index) => {
    for (const command of commands) session.dispatch(command);
    const { puzzle } = session.getState();
    assertEquals(isSolved(puzzle), true, LEVELS[index].name);
    assertEquals(puzzle.moves, LEVELS[index].par.length, LEVELS[index].name);
  });
});

Deno.test("the replay line", () => {
  assertEquals(replayAll(), "[replay] solved=5/5 moves=96 pushes=32");
});
