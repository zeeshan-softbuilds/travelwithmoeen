"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState, useTransition } from "react";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { EmptyState } from "@/components/office/ui/EmptyState";
import { Icon } from "@/components/office/ui/Icon";
import { Table } from "@/components/office/ui/Table";
import { postOfficeForm } from "@/lib/http/office-client";

export type RateColumn = {
  key: string;
  label: string;
  // text: shown, not edited. money and count: digits only, checked by the server. name: free text.
  // switch: on or off, sent as "on" when on.
  type: "text" | "money" | "count" | "name" | "switch";
};

export type RateRow = { id: number; values: Record<string, string | number | boolean> };

type RateTableProps = {
  kind: "hotel" | "vehicle" | "jeep";
  noun: string;
  columns: RateColumn[];
  rows: RateRow[];
  // Columns that get a filter list, such as place and grade.
  filters?: string[];
  searchLabel?: string;
  // The columns that name a row in labels and messages, such as place, start city, and grade.
  nameKeys: string[];
};

type Draft = Record<number, Record<string, string | boolean>>;
const LEAVE_QUESTION = "Leave without saving? Your rate changes will be lost.";

function asDraftValue(value: string | number | boolean) {
  return typeof value === "boolean" ? value : String(value);
}

// The prototype rate table: every row editable, one save bar. Save sends each changed row as its
// own POST /api/office/rates with the fields the server reads, and the server checks every amount.
export function RateTable({ kind, noun, columns, rows, filters = [], searchLabel = `Search ${noun}`, nameKeys }: RateTableProps) {
  const rowName = (row: RateRow) => nameKeys.map((key) => String(row.values[key])).join(", ");
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState("");
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  const valueOf = (row: RateRow, key: string) => draft[row.id]?.[key] ?? asDraftValue(row.values[key]);
  const changedIds = Object.keys(draft)
    .map(Number)
    .filter((id) => {
      const row = rows.find((item) => item.id === id);
      return row && Object.entries(draft[id]).some(([key, value]) => value !== asDraftValue(row.values[key]));
    });

  // Ask before leaving with unsaved changes, both for a link in the office and for the browser.
  useEffect(() => {
    if (changedIds.length === 0) return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest?.("a[href]");
      if (!link || link.getAttribute("target") === "_blank") return;
      if (!window.confirm(LEAVE_QUESTION)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const onUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    document.addEventListener("click", onClick, true);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [changedIds.length]);

  const edit = (id: number, key: string, value: string | boolean) => {
    setSaved("");
    setDraft((current) => ({ ...current, [id]: { ...current[id], [key]: value } }));
  };

  const save = () =>
    start(async () => {
      const failed: Record<number, string> = {};
      let savedCount = 0;
      for (const id of changedIds) {
        const row = rows.find((item) => item.id === id);
        if (!row) continue;
        const form = new FormData();
        form.set("kind", kind);
        form.set("id", String(id));
        for (const column of columns) {
          if (column.type === "text") continue;
          const value = valueOf(row, column.key);
          if (column.type === "switch") {
            if (value === true) form.set(column.key, "on");
          } else {
            form.set(column.key, String(value));
          }
        }
        const result = await postOfficeForm("/api/office/rates", form);
        if (result.ok) savedCount += 1;
        else failed[id] = result.error;
      }
      // The saved rows take the stored values from the refreshed page in the same update.
      startTransition(() => {
        setErrors(failed);
        setDraft((current) => Object.fromEntries(Object.entries(current).filter(([id]) => failed[Number(id)])));
        setSaved(savedCount ? `${savedCount} ${savedCount === 1 ? "row" : "rows"} saved.` : "");
        router.refresh();
      });
    });

  const words = query.trim().toLowerCase();
  const shown = rows.filter(
    (row) =>
      (!words || columns.some((column) => column.type !== "money" && column.type !== "count" && String(row.values[column.key]).toLowerCase().includes(words))) &&
      filters.every((key) => !chosen[key] || String(row.values[key]) === chosen[key]),
  );
  const failedIds = Object.keys(errors).map(Number);

  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <Icon name="search" />
          <input className="input" type="search" placeholder={searchLabel} aria-label={searchLabel} value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        {filters.map((key) => {
          const column = columns.find((item) => item.key === key);
          const options = [...new Set(rows.map((row) => String(row.values[key])))];
          return (
            <span key={key}>
              <label className="sr-only" htmlFor={`rate-filter-${key}`}>
                {column?.label}
              </label>
              <select className="select select-sm" id={`rate-filter-${key}`} value={chosen[key] ?? ""} onChange={(event) => setChosen((current) => ({ ...current, [key]: event.target.value }))}>
                <option value="">All {column?.label.toLowerCase()}s</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </span>
          );
        })}
        <span className="filter-count" aria-live="polite">
          {shown.length === rows.length ? `${rows.length} ${noun}` : `${shown.length} of ${rows.length} ${noun}`}
        </span>
      </div>

      {failedIds.length ? (
        <Alert tone="danger" title={`${failedIds.length} ${failedIds.length === 1 ? "row was" : "rows were"} not saved`} role="alert">
          {failedIds.map((id) => {
            const row = rows.find((item) => item.id === id);
            return row ? `${rowName(row)}: ${errors[id]} ` : "";
          })}
        </Alert>
      ) : null}

      {shown.length === 0 ? (
        <div className="card">
          <EmptyState icon="search" title="No matches">
            Try another search or filter.
          </EmptyState>
        </div>
      ) : (
        <Table label={`${noun} you can edit`}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th scope="col" key={column.key} className={column.type === "money" ? "r" : undefined}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => {
              const name = rowName(row);
              const error = errors[row.id];
              return (
                <tr key={row.id} className={error ? "is-error" : undefined}>
                  {columns.map((column, index) => {
                    const value = valueOf(row, column.key);
                    const changed = draft[row.id]?.[column.key] !== undefined && value !== asDraftValue(row.values[column.key]);
                    const label = `${column.label}, ${name}`;
                    const cellClass = [column.type === "money" ? "r" : "", changed ? "is-changed" : ""].filter(Boolean).join(" ") || undefined;
                    return (
                      <td key={column.key} data-label={index === 0 ? undefined : column.label} className={cellClass}>
                        {column.type === "text" ? (
                          index === 0 ? <b>{String(value)}</b> : String(value)
                        ) : column.type === "switch" ? (
                          <label className="switch">
                            <input type="checkbox" role="switch" aria-label={label} checked={value === true} disabled={pending} onChange={(event) => edit(row.id, column.key, event.target.checked)} />
                            <span className="track" aria-hidden="true">
                              <span className="thumb" />
                            </span>
                          </label>
                        ) : column.type === "name" ? (
                          <input className="input input-sm" value={String(value)} aria-label={label} disabled={pending} onChange={(event) => edit(row.id, column.key, event.target.value)} />
                        ) : (
                          <span className={column.type === "money" ? "money money-sm" : "count-cell"}>
                            {column.type === "money" ? (
                              <span className="affix" aria-hidden="true">
                                Rs
                              </span>
                            ) : null}
                            <input
                              className={column.type === "money" ? "input" : "input input-sm seats"}
                              inputMode="numeric"
                              autoComplete="off"
                              value={String(value)}
                              aria-label={label}
                              aria-invalid={error ? true : undefined}
                              disabled={pending}
                              onChange={(event) => edit(row.id, column.key, event.target.value)}
                            />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <div className="savebar">
        <span className={saved && changedIds.length === 0 ? "sb-msg is-saved" : "sb-msg"} role="status">
          {changedIds.length ? (
            <>
              <span className="sb-dot" aria-hidden="true" />
              {changedIds.length} {changedIds.length === 1 ? "row" : "rows"} changed
            </>
          ) : (
            saved || "Change a rate, then save. Each row is checked by the server."
          )}
        </span>
        <div className="sb-actions">
          <Button
            variant="ghost"
            disabled={pending || changedIds.length === 0}
            onClick={() => {
              setDraft({});
              setErrors({});
            }}
          >
            Discard
          </Button>
          <Button variant="primary" disabled={pending || changedIds.length === 0} busy={pending} onClick={save}>
            Save {changedIds.length > 1 ? `${changedIds.length} rows` : "changes"}
          </Button>
        </div>
      </div>
    </>
  );
}
