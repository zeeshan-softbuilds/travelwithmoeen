"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { formatDateTime, relativeTime } from "@/components/office/format";
import { RequestDetail } from "@/components/office/requests/RequestDetail";
import {
  KIND_LABEL,
  REQUEST_KINDS,
  REQUEST_STATUSES,
  STATUS_LABEL,
  StatusBadge,
  guestName,
  initialOf,
  messagePreview,
  type RequestKind,
  type RequestStatus,
} from "@/components/office/requests/request-labels";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { EmptyState } from "@/components/office/ui/EmptyState";
import { Icon } from "@/components/office/ui/Icon";
import { postOfficeForm } from "@/lib/http/office-client";
import type { OfficeRequestRow } from "@/lib/http/office-session";

type Sort = "newest" | "oldest";
type Notice = { tone: "success" | "danger"; text: string } | null;

type RequestsInboxProps = {
  rows: OfficeRequestRow[];
  now: number;
  canUpdateStatus: boolean;
  canDelete: boolean;
  initialStatus: RequestStatus | "";
  initialId: number | null;
};

function searchText(row: OfficeRequestRow) {
  return `${row.name} ${row.phone} ${row.email} ${row.message}`.toLowerCase();
}

// Keeps the address bar in step with the filter and the open request, so a reload or a
// shared link opens the same view. The list itself is already loaded.
function writeAddress(status: RequestStatus | "", id: number | null) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (id) params.set("id", String(id));
  const query = params.toString();
  window.history.replaceState(null, "", query ? `/office/requests?${query}` : "/office/requests");
}

export function RequestsInbox({ rows, now, canUpdateStatus, canDelete, initialStatus, initialId }: RequestsInboxProps) {
  const router = useRouter();
  const [status, setStatus] = useState<RequestStatus | "">(initialStatus);
  const [kind, setKind] = useState<RequestKind | "">("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [selectedId, setSelectedId] = useState<number | null>(initialId);
  const [focusDetail, setFocusDetail] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [saving, startSaving] = useTransition();
  const detailHeadingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const words = query.trim().toLowerCase();
  const shown = rows
    .filter((row) => !status || row.status === status)
    .filter((row) => !kind || row.kind === kind)
    .filter((row) => !words || searchText(row).includes(words));
  if (sort === "oldest") shown.reverse();

  const selected = selectedId === null ? null : rows.find((row) => row.id === selectedId) ?? null;
  const position = selected ? shown.findIndex((row) => row.id === selected.id) : -1;
  const filtered = Boolean(status || kind || words);

  useEffect(() => {
    if (focusDetail) detailHeadingRef.current?.focus();
  }, [focusDetail, selectedId]);

  const choose = (id: number | null) => {
    setSelectedId(id);
    setFocusDetail(id !== null);
    setNotice(null);
    writeAddress(status, id);
  };

  const chooseStatus = (next: RequestStatus | "") => {
    setStatus(next);
    writeAddress(next, selectedId);
  };

  const clearFilters = () => {
    setKind("");
    setQuery("");
    chooseStatus("");
  };

  const backToList = () => {
    const id = selectedId;
    choose(null);
    requestAnimationFrame(() => listRef.current?.querySelector<HTMLElement>(`[data-request="${id}"]`)?.focus());
  };

  // Resolves true when the server saved it. The server checks the role on every call.
  const send = (path: string, fields: Record<string, string>, done: string, after?: () => void) =>
    new Promise<boolean>((resolve) => {
      const form = new FormData();
      for (const [name, value] of Object.entries(fields)) form.set(name, value);
      startSaving(async () => {
        const result = await postOfficeForm(path, form);
        if (!result.ok) {
          setNotice({ tone: "danger", text: result.error });
          resolve(false);
          return;
        }
        setNotice({ tone: "success", text: done });
        after?.();
        router.refresh();
        resolve(true);
      });
    });

  const saveStatus = (id: number, next: RequestStatus) =>
    send("/api/office/requests/status", { id: String(id), status: next }, `Status saved: ${STATUS_LABEL[next]}.`);

  const deleteRequest = (id: number) =>
    send("/api/office/requests/delete", { id: String(id) }, "Request deleted.", () => {
      setSelectedId(null);
      writeAddress(status, null);
    });

  if (rows.length === 0) {
    return (
      <div className="card">
        <EmptyState icon="inbox" title="No requests yet">
          Contacts, custom trips, and bookings from the website appear here.
        </EmptyState>
      </div>
    );
  }

  const countOf = (value: RequestStatus | "") => (value ? rows.filter((row) => row.status === value).length : rows.length);

  return (
    <>
      <div className="tabs" role="group" aria-label="Status">
        {(["", ...REQUEST_STATUSES] as const).map((value) => (
          <button className="tab" type="button" key={value || "all"} aria-pressed={status === value} onClick={() => chooseStatus(value)}>
            {value ? STATUS_LABEL[value] : "All"}
            <span className="tab-n">{countOf(value)}</span>
          </button>
        ))}
      </div>

      {notice ? (
        <Alert tone={notice.tone} title={notice.text} role={notice.tone === "danger" ? "alert" : "status"} />
      ) : null}

      <div className={selected || selectedId !== null ? "inbox has-detail" : "inbox"}>
        <div className="inbox-list-wrap">
          <div className="toolbar">
            <div className="search-box">
              <Icon name="search" />
              <input
                className="input"
                type="search"
                placeholder="Search requests"
                aria-label="Search name, phone, email, or message"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <label className="sr-only" htmlFor="request-kind">
              Type
            </label>
            <select className="select select-sm" id="request-kind" value={kind} onChange={(event) => setKind(event.target.value as RequestKind | "")}>
              <option value="">All types</option>
              {REQUEST_KINDS.map((value) => (
                <option key={value} value={value}>
                  {KIND_LABEL[value]}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="request-sort">
              Sort
            </label>
            <select className="select select-sm" id="request-sort" value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <span className="filter-count" aria-live="polite">
              {filtered ? `${shown.length} of ${rows.length} requests` : `${rows.length} requests`}
            </span>
          </div>

          {shown.length ? (
            <ul className="rowlist inbox-list" ref={listRef}>
              {shown.map((row) => (
                <li key={row.id}>
                  <button
                    className="row"
                    type="button"
                    data-request={row.id}
                    aria-current={row.id === selectedId ? "true" : undefined}
                    onClick={() => choose(row.id)}
                  >
                    <span className="avatar" aria-hidden="true">
                      {initialOf(guestName(row))}
                    </span>
                    <span className="row-main">
                      <b>
                        {guestName(row)}
                        {row.status === "new" ? <span className="unread" aria-hidden="true" /> : null}
                      </b>
                      <small>
                        {KIND_LABEL[row.kind]} · {messagePreview(row.message)}
                      </small>
                    </span>
                    <span className="row-meta">
                      <small title={formatDateTime(row.createdAt)}>{relativeTime(row.createdAt, now)}</small>
                      <StatusBadge status={row.status} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card">
              <EmptyState
                icon="search"
                title="No requests here"
                action={
                  <Button variant="secondary" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              >
                Try another status, type, or search.
              </EmptyState>
            </div>
          )}
        </div>

        <section className="inbox-detail card" aria-label="Request detail">
          {selected ? (
            <>
              <Button variant="ghost" size="sm" icon="chevL" className="only-mobile" onClick={backToList}>
                <span>All requests</span>
              </Button>
              <RequestDetail
                key={`${selected.id}-${selected.status}`}
                row={selected}
                headingRef={detailHeadingRef}
                position={position >= 0 ? { index: position, total: shown.length } : null}
                onPrevious={position > 0 ? () => choose(shown[position - 1].id) : null}
                onNext={position >= 0 && position < shown.length - 1 ? () => choose(shown[position + 1].id) : null}
                canUpdateStatus={canUpdateStatus}
                canDelete={canDelete}
                saving={saving}
                onStatus={(next) => saveStatus(selected.id, next)}
                onDelete={() => deleteRequest(selected.id)}
              />
            </>
          ) : selectedId !== null ? (
            <>
              <Button variant="ghost" size="sm" icon="chevL" className="only-mobile" onClick={backToList}>
                <span>All requests</span>
              </Button>
              <EmptyState icon="inbox" title="Request not found">
                It may have been deleted.
              </EmptyState>
            </>
          ) : (
            <EmptyState icon="inbox" title="Choose a request">
              Its message, contact details, and status appear here.
            </EmptyState>
          )}
        </section>
      </div>
    </>
  );
}
