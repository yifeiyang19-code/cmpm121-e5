import { useSyncExternalStore } from "react";
import type { Session, SessionState } from "../core/mod.ts";

/**
 * Observer, React side: subscribes the calling component to a Session, so it
 * renders again whenever the session state changes.
 * https://react.dev/reference/react/useSyncExternalStore
 */
export function useSessionState(session: Session): SessionState {
  return useSyncExternalStore(session.subscribe, session.getState);
}
