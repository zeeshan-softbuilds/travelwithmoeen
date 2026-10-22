"use client";

import Link from "next/link";
import { useState } from "react";
import { photoStyle } from "@/components/office/content/media";
import { Badge, type BadgeTone } from "@/components/office/ui/Badge";
import { Button } from "@/components/office/ui/Button";
import { EmptyState } from "@/components/office/ui/EmptyState";
import { Icon, type IconName } from "@/components/office/ui/Icon";

export type ListRecord = {
  key: string;
  href: string;
  title: string;
  sub?: string;
  thumb?: string;
  badges?: { label: string; tone: BadgeTone }[];
  note?: string;
  stars?: number;
  span?: "tall" | "wide" | "large";
  search: string;
  filters?: Record<string, string>;
  sort?: Record<string, string | number>;
};

export type ListFilter = { key: string; label: string; options: { value: string; label: string }[] };
// value is "field:asc" or "field:desc". An empty value keeps the order the records came in.
export type ListSort = { value: string; label: string };

type RecordListProps = {
  records: ListRecord[];
  layout?: "rows" | "grid";
  currentKey?: string;
  searchLabel: string;
  noun: string;
  filters?: ListFilter[];
  sorts?: ListSort[];
  emptyIcon: IconName;
  emptyTitle: string;
};

export function Stars({ rating }: { rating: number }) {
  const whole = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="stars" aria-label={`${whole} out of 5`}>
      {"★".repeat(whole)}
      <span className="stars-off">{"★".repeat(5 - whole)}</span>
    </span>
  );
}

function compare(left: string | number | undefined, right: string | number | undefined) {
  if (typeof left === "number" && typeof right === "number") return left - right;
  return String(left ?? "").localeCompare(String(right ?? ""));
}

// Links do not prefetch: each record opens a full server page, and a long list would ask for all of them.
// The prototype list: search, filters, sort, a live count, and a "No matches" state.
export function RecordList({ records, layout = "rows", currentKey, searchLabel, noun, filters = [], sorts = [], emptyIcon, emptyTitle }: RecordListProps) {
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [sort, setSort] = useState(sorts[0]?.value ?? "");

  if (records.length === 0) {
    return (
      <div className="card">
        <EmptyState icon={emptyIcon} title={emptyTitle} />
      </div>
    );
  }

  const words = query.trim().toLowerCase();
  const shown = records
    .filter((record) => !words || record.search.toLowerCase().includes(words))
    .filter((record) => filters.every((filter) => !chosen[filter.key] || record.filters?.[filter.key] === chosen[filter.key]));
  if (sort) {
    const [field, direction] = sort.split(":");
    shown.sort((left, right) => compare(left.sort?.[field], right.sort?.[field]) * (direction === "desc" ? -1 : 1));
  }
  const narrowed = Boolean(words) || Object.values(chosen).some(Boolean);

  const clear = () => {
    setQuery("");
    setChosen({});
  };

  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <Icon name="search" />
          <input
            className="input"
            type="search"
            placeholder={searchLabel}
            aria-label={searchLabel}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {filters.map((filter) => (
          <span key={filter.key}>
            <label className="sr-only" htmlFor={`filter-${filter.key}`}>
              {filter.label}
            </label>
            <select
              className="select select-sm"
              id={`filter-${filter.key}`}
              value={chosen[filter.key] ?? ""}
              onChange={(event) => setChosen((current) => ({ ...current, [filter.key]: event.target.value }))}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
        ))}
        {sorts.length > 1 ? (
          <>
            <label className="sr-only" htmlFor={`sort-${noun}`}>
              Sort
            </label>
            <select className="select select-sm" id={`sort-${noun}`} value={sort} onChange={(event) => setSort(event.target.value)}>
              {sorts.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        ) : null}
        <span className="filter-count" aria-live="polite">
          {narrowed ? `${shown.length} of ${records.length} ${noun}` : `${records.length} ${noun}`}
        </span>
      </div>

      {shown.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="search"
            title="No matches"
            action={
              <Button size="sm" onClick={clear}>
                Clear filters
              </Button>
            }
          >
            Try another search or filter.
          </EmptyState>
        </div>
      ) : layout === "grid" ? (
        <ul className="photogrid">
          {shown.map((record) => (
            <li key={record.key} className={record.span ? `span-${record.span}` : undefined}>
              <Link className="photo" href={record.href} scroll={false} prefetch={false} style={photoStyle(record.thumb)} aria-current={record.key === currentKey ? "true" : undefined}>
                <span className="photo-cap">
                  <b>{record.title}</b>
                  {record.sub ? <small>{record.sub}</small> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="rowlist">
          {shown.map((record) => (
            <li key={record.key}>
              <Link className="row" href={record.href} scroll={false} prefetch={false} aria-current={record.key === currentKey ? "true" : undefined}>
                {record.thumb !== undefined ? <span className="row-thumb" style={photoStyle(record.thumb)} aria-hidden="true" /> : null}
                <span className="row-main">
                  <b>{record.title}</b>
                  {record.sub ? <small>{record.sub}</small> : null}
                </span>
                <span className="row-meta">
                  {record.stars !== undefined ? <Stars rating={record.stars} /> : null}
                  {record.note ? <small>{record.note}</small> : null}
                  {record.badges?.map((badge) => (
                    <Badge key={badge.label} tone={badge.tone}>
                      {badge.label}
                    </Badge>
                  ))}
                </span>
                <Icon name="chevR" className="row-chev" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
