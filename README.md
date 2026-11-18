# E5: Crate Expectations

A small [Sokoban](https://en.wikipedia.org/wiki/Sokoban)-style puzzle game: push every crate onto a goal. The game's rules are plain TypeScript; the screen is drawn with [React](https://react.dev). Assignment instructions are on Canvas.

Install [Deno](https://docs.deno.com/runtime/getting_started/installation/) and [Git](https://git-scm.com/downloads). Create your own repository from this template, clone it, open a terminal in that folder, and run `deno task setup` once. Run `deno task dev` and open the local URL printed in the terminal (normally `http://localhost:3000`). Arrow keys or WASD move. Open the repository folder itself in VS Code, not a parent folder, and accept the recommended Deno extension.

**This starter is clean on purpose.** E4 was the messiest codebase of the quarter; this one is meant to be pleasant to work in. `deno task ci` passes on the untouched starter, and the commit hook keeps it that way.

## Model, view, controller

The code is split three ways. The split is old: it was named Model–View–Controller in Smalltalk around 1979. React does not claim to be MVC, and this project does not force it to be; MVC is a useful lens for seeing who owns what.

- **Model: `core/`.** The rules and the truth. `puzzle.ts` says what one move does; `session.ts` holds one sitting at the game (the current level and its puzzle), turns `Command` objects into new states, and tells subscribers when the state changes; `levels.ts` is the level set as data. No browser, no React. Tests drive it directly.
- **View: the React components in `app/`.** `App.tsx` lays out the screen; `Board.tsx`, `StatusBar.tsx`, `LevelPicker.tsx`, and `ControlsPicker.tsx` each draw part of it from the current state. A view reads state and renders; it never edits state.
- **Controller: `app/controllers.ts` and `app/replay.ts`.** Each controller turns some kind of input into `Command`s for the game. The app attaches one at a time; the Controls panel switches between them.

React blurs one line on purpose: a button's `onClick` is a tiny controller living inside a view. The Restart button and the level picker work that way.

**The one rule:** `core/` never imports anything from outside `core/`, including React. `deno task boundary` checks it.

## Patterns you are already using

Named so you can read about them. Each also appears in a comment where it is used. The first three are the ones the "Gang of Four" book (Gamma, Helm, Johnson, and Vlissides, _Design Patterns_, 1994) uses to explain Smalltalk's MVC.

- [Observer](https://refactoring.guru/design-patterns/observer): `Session` notifies subscribers; `useSessionState` subscribes a component through React's [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore). The board announces tile clicks to the attached controller the same way (`app/tileClicks.ts`).
- [Composite](https://refactoring.guru/design-patterns/composite): the screen is a tree of components; `App` contains `Board`, which contains `Tile`s.
- [Strategy](https://refactoring.guru/design-patterns/strategy): every controller has the same `attach` method, so they are interchangeable.
- [Command](https://gameprogrammingpatterns.com/command.html): keys, buttons, tests, and the replay all drive the game with the same `Command` objects.
- [Facade](https://refactoring.guru/design-patterns/facade): `core/mod.ts` is the one way into the model.
- [Immutable](https://react.dev/learn/updating-objects-in-state) state: `move()` returns a new `Puzzle` and never edits the old one. React relies on this to notice changes cheaply.

## The replay check

Every level carries a par route: a shortest known solution. `deno task replay` plays them all through the model and prints one line:

```
[replay] solved=5/5 moves=96
```

Choose **Replay par routes** in the Controls panel (or open the page with `?replay`) to watch the same routes play in the browser; the same line appears in the developer console at the end. As long as the rules are unchanged, the line is unchanged. In the browser console, `session.getState()` shows the current state.

## Tasks

| Task                 | What it does                                                      |
| -------------------- | ----------------------------------------------------------------- |
| `deno task setup`    | Install dependencies and turn on the commit hook (once per clone) |
| `deno task dev`      | Run the game locally                                              |
| `deno task test`     | Run the model's tests                                             |
| `deno task replay`   | Print the replay line                                             |
| `deno task check`    | Type-check `core/` and `app/`                                     |
| `deno task boundary` | Check that `core/` imports nothing from outside `core/`           |
| `deno task fmt`      | Fix formatting                                                    |
| `deno task lint`     | Lint                                                              |
| `deno task build`    | Build the site into `dist/`                                       |
| `deno task ci`       | Formatting, lint, types, tests, boundary, and build, in order     |

Pushing to `main` runs `deno task ci` on GitHub and, if it passes, publishes the game with GitHub Pages (enable Pages with source **GitHub Actions** in your repository's settings).

## If blocked

Read the first failing command in the output, fix what it reports, and rerun `deno task ci`. If a hook or tool stalls you, ask course staff with the failing command and its error text.

## Credits

Tooling adapted from the instructor's D3 starter. Session and levels were instructor-authored with authorized Anthropic Claude agent assistance; par routes were found by breadth-first search. Dependencies retain their respective licenses.
