// T-50 (BR-98, design section 13): one shared busy store for the office. An action reports when it
// starts, with a short label such as "Saving photo", and when it ends, with the saved message or the
// error. The office top bar shows the newest working label with "…", then the result for 4 seconds.

export type BusyState = {
  working: string | null;
  result: { ok: boolean; text: string } | null;
};

const RESULT_MS = 4000;

let active: { id: number; label: string }[] = [];
let result: BusyState["result"] = null;
let resultTimer: ReturnType<typeof setTimeout> | null = null;
let nextId = 1;
let state: BusyState = { working: null, result: null };
const listeners = new Set<() => void>();

function publish() {
  state = { working: active.at(-1)?.label ?? null, result };
  for (const listener of listeners) listener();
}

export function subscribeBusy(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function busySnapshot() {
  return state;
}

const IDLE: BusyState = { working: null, result: null };
export function busyServerSnapshot() {
  return IDLE;
}

// Returns the function that ends this piece of work.
export function startBusy(label: string) {
  const id = nextId++;
  active = [...active, { id, label }];
  if (resultTimer) clearTimeout(resultTimer);
  result = null;
  publish();
  let ended = false;
  return (outcome: { ok: boolean; text: string } | null) => {
    if (ended) return;
    ended = true;
    active = active.filter((item) => item.id !== id);
    if (outcome) {
      result = outcome;
      if (resultTimer) clearTimeout(resultTimer);
      resultTimer = setTimeout(() => {
        result = null;
        resultTimer = null;
        publish();
      }, RESULT_MS);
    }
    publish();
  };
}
