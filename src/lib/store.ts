import { useSyncExternalStore } from "react";
import { DEMO_STATEMENTS } from "./demo-data";
import type { Statement } from "./types";

const KEY = "oabsa-state-v1";

type State = {
  statements: Statement[];
  clearedDuplicateIds: string[];
  lastStatementId: string | null;
};

const initialState: State = {
  statements: DEMO_STATEMENTS,
  clearedDuplicateIds: [],
  lastStatementId: DEMO_STATEMENTS[0]?.id ?? null,
};

let state: State = initialState;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — keep working in memory */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      if (Array.isArray(parsed.statements)) {
        state = {
          statements: parsed.statements,
          clearedDuplicateIds: parsed.clearedDuplicateIds ?? [],
          lastStatementId: parsed.lastStatementId ?? parsed.statements[0]?.id ?? null,
        };
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  hydrate();
  return () => listeners.delete(listener);
}

function getSnapshot(): State {
  return state;
}

function getServerSnapshot(): State {
  return initialState;
}

export function useAppState(): State {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function setState(next: State) {
  state = next;
  persist();
  emit();
}

export function addStatement(statement: Statement) {
  setState({
    ...state,
    statements: [statement, ...state.statements],
    lastStatementId: statement.id,
  });
}

export function deleteStatement(id: string) {
  const statements = state.statements.filter((s) => s.id !== id);
  setState({
    ...state,
    statements,
    lastStatementId: state.lastStatementId === id ? (statements[0]?.id ?? null) : state.lastStatementId,
  });
}

export function clearDuplicate(pairId: string) {
  if (state.clearedDuplicateIds.includes(pairId)) return;
  setState({ ...state, clearedDuplicateIds: [...state.clearedDuplicateIds, pairId] });
}

export function restoreDuplicate(pairId: string) {
  setState({
    ...state,
    clearedDuplicateIds: state.clearedDuplicateIds.filter((id) => id !== pairId),
  });
}

export function restoreDemoStatements() {
  setState({ ...state, statements: DEMO_STATEMENTS, clearedDuplicateIds: [] });
}
