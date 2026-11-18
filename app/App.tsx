import { useEffect, useState } from "react";
import { isSolved, LEVELS, type Session } from "../core/mod.ts";
import { Board } from "./Board.tsx";
import { CONTROLLERS, initialController } from "./controllers.ts";
import { ControlsPicker } from "./ControlsPicker.tsx";
import { LevelPicker } from "./LevelPicker.tsx";
import { StatusBar } from "./StatusBar.tsx";
import { TileClicks } from "./tileClicks.ts";
import { useSessionState } from "./useSessionState.ts";

// Composite: the whole screen is one component made of smaller ones, each of
// which may be made of smaller ones still (Board is made of Tiles).
export function App({ session }: { session: Session }) {
  const state = useSessionState(session);
  const [controller, setController] = useState(initialController);
  const [clicks] = useState(() => new TileClicks());

  // Attach the chosen controller; detach it when the choice changes or the
  // app goes away.
  useEffect(
    () => CONTROLLERS[controller].attach(session, clicks),
    [session, controller, clicks],
  );

  const solved = isSolved(state.puzzle);
  const last = state.level === LEVELS.length - 1;

  return (
    <main className="app">
      <header>
        <h1>Crate Expectations</h1>
        <LevelPicker
          current={state.level}
          onChoose={(level) =>
            session.dispatch({ kind: "choose-level", level })}
        />
      </header>
      <Board puzzle={state.puzzle} clicks={clicks} />
      <aside>
        <StatusBar puzzle={state.puzzle} par={LEVELS[state.level].par.length} />
        {solved && (
          <p className="banner" role="status">
            Solved in {state.puzzle.moves} moves. {!last && (
              <button
                type="button"
                onClick={() =>
                  session.dispatch({
                    kind: "choose-level",
                    level: state.level + 1,
                  })}
              >
                Next level
              </button>
            )}
          </p>
        )}
        <button
          type="button"
          onClick={() => session.dispatch({ kind: "restart" })}
        >
          Restart
        </button>
        <ControlsPicker current={controller} onChoose={setController} />
      </aside>
    </main>
  );
}
