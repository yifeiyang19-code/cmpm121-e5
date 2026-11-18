import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Session } from "../core/mod.ts";
import { App } from "./App.tsx";
import "./style.css";

// The model is made once, outside React, and handed to the view.
const session = new Session();

// A handle for the browser console and for browser-driving tools:
// try session.getState() or session.dispatch({ kind: "restart" }).
Object.assign(globalThis, { session });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App session={session} />
  </StrictMode>,
);
