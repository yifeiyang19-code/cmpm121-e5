import { assertEquals, assertStrictEquals } from "@std/assert";
import { isSolved, move, parsePuzzle } from "./puzzle.ts";

const corridor = parsePuzzle("Corridor", [
  "#######",
  "#@ $ .#",
  "#######",
]);

Deno.test("walking onto floor moves the player and counts a move", () => {
  const after = move(corridor, "right");
  assertEquals(after.player, { x: 2, y: 1 });
  assertEquals(after.moves, 1);
});

Deno.test("walking into a wall returns the very same puzzle", () => {
  assertStrictEquals(move(corridor, "up"), corridor);
});

Deno.test("walking into a crate pushes it one tile", () => {
  const after = move(move(corridor, "right"), "right");
  assertEquals(after.player, { x: 3, y: 1 });
  assertEquals(after.crates, [{ x: 4, y: 1 }]);
});

Deno.test("a crate cannot be pushed into a wall", () => {
  const stuck = parsePuzzle("Stuck", ["#####", "#@$##", "#. ##", "#####"]);
  assertStrictEquals(move(stuck, "right"), stuck);
});

Deno.test("moving leaves the earlier puzzle untouched", () => {
  move(corridor, "right");
  assertEquals(corridor.player, { x: 1, y: 1 });
  assertEquals(corridor.moves, 0);
});

Deno.test("a puzzle is solved when every crate sits on a goal", () => {
  const pushed = ["right", "right", "right"] as const;
  const solved = pushed.reduce(move, corridor);
  assertEquals(isSolved(corridor), false);
  assertEquals(isSolved(solved), true);
});
