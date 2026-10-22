// Where the editor sits among the records of its list.
export type EditorFrame = {
  closeHref: string;
  previousHref: string | null;
  nextHref: string | null;
  position: { index: number; total: number };
};

// Previous and next for a record at index, in the order the list was loaded.
export function frameFor<T>(items: T[], index: number, closeHref: string, hrefOf: (item: T) => string): EditorFrame {
  return {
    closeHref,
    previousHref: index > 0 ? hrefOf(items[index - 1]) : null,
    nextHref: index >= 0 && index < items.length - 1 ? hrefOf(items[index + 1]) : null,
    position: { index: Math.max(index, 0), total: items.length },
  };
}
