"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/office/ui/Button";

export type Keyed<T> = { key: number; value: T };

// A list of blocks, such as days or sections, each with a stable key. A stable key keeps a chosen
// file with its own block when a block above it is removed or moved.
export function useKeyedList<T>(initial: T[]) {
  const next = useRef(initial.length);
  const [items, setItems] = useState<Keyed<T>[]>(() => initial.map((value, index) => ({ key: index, value })));
  return {
    items,
    add: (value: T) => setItems((current) => [...current, { key: next.current++, value }]),
    remove: (key: number) => setItems((current) => current.filter((item) => item.key !== key)),
    update: (key: number, patch: Partial<T>) =>
      setItems((current) => current.map((item) => (item.key === key ? { ...item, value: { ...item.value, ...patch } } : item))),
    move: (key: number, step: -1 | 1) =>
      setItems((current) => {
        const from = current.findIndex((item) => item.key === key);
        const to = from + step;
        if (from < 0 || to < 0 || to >= current.length) return current;
        const copy = [...current];
        [copy[from], copy[to]] = [copy[to], copy[from]];
        return copy;
      }),
  };
}

type RepeatItemProps = {
  label: string;
  index: number;
  count: number;
  onMove: (step: -1 | 1) => void;
  onRemove: () => void;
  children: React.ReactNode;
};

export function RepeatItem({ label, index, count, onMove, onRemove, children }: RepeatItemProps) {
  const name = `${label} ${index + 1}`;
  return (
    <fieldset className="rep-item">
      <legend className="rep-head">{name}</legend>
      <div className="rep-tools">
        <Button variant="ghost" size="sm" iconOnly icon="arrowUp" disabled={index === 0} onClick={() => onMove(-1)}>
          <span className="sr-only">Move {name} up</span>
        </Button>
        <Button variant="ghost" size="sm" iconOnly icon="arrowDown" disabled={index === count - 1} onClick={() => onMove(1)}>
          <span className="sr-only">Move {name} down</span>
        </Button>
        <Button variant="ghost" size="sm" icon="trash" onClick={onRemove}>
          Remove<span className="sr-only"> {name}</span>
        </Button>
      </div>
      {children}
    </fieldset>
  );
}
