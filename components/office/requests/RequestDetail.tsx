"use client";

import { useState, type Ref } from "react";
import { formatDateTime } from "@/components/office/format";
import { KIND_LABEL, REQUEST_STATUSES, STATUS_LABEL, guestName, type RequestStatus } from "@/components/office/requests/request-labels";
import { Alert } from "@/components/office/ui/Alert";
import { Button, buttonClass } from "@/components/office/ui/Button";
import { Icon } from "@/components/office/ui/Icon";
import { SegmentedControl } from "@/components/office/ui/SegmentedControl";
import type { OfficeRequestRow } from "@/lib/http/office-session";

// No ?, &, or # in the address, so a mailto: link cannot carry extra fields such as cc.
const EMAIL_PATTERN = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/;

type RequestDetailProps = {
  row: OfficeRequestRow;
  headingRef: Ref<HTMLHeadingElement>;
  position: { index: number; total: number } | null;
  onPrevious: (() => void) | null;
  onNext: (() => void) | null;
  canUpdateStatus: boolean;
  canDelete: boolean;
  saving: boolean;
  onStatus: (status: RequestStatus) => Promise<boolean>;
  onDelete: () => void;
};

function phoneDigits(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

// wa.me needs the number with the country code and no plus sign. A local 03xx number is Pakistani.
function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
}

export function RequestDetail({
  row,
  headingRef,
  position,
  onPrevious,
  onNext,
  canUpdateStatus,
  canDelete,
  saving,
  onStatus,
  onDelete,
}: RequestDetailProps) {
  const [shownStatus, setShownStatus] = useState<RequestStatus>(row.status);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const name = guestName(row);
  const phone = row.phone.trim();
  const email = row.email.trim();
  const whatsapp = whatsappNumber(phone);
  const greeting = `Assalam o Alaikum ${name.split(" ")[0]}, this is Travel With Moeen about your ${KIND_LABEL[row.kind].toLowerCase()} request.`;

  return (
    <div className="req-detail">
      <div className="req-head">
        <div>
          <h2 ref={headingRef} tabIndex={-1}>
            {name}
          </h2>
          <p className="desc">
            {KIND_LABEL[row.kind]} · <time dateTime={row.createdAt}>{formatDateTime(row.createdAt)}</time>
          </p>
        </div>
        {position ? (
          <div className="req-nav">
            <span className="req-pos">
              {position.index + 1} of {position.total}
            </span>
            <Button variant="ghost" size="sm" iconOnly icon="chevU" disabled={!onPrevious} onClick={onPrevious ?? undefined}>
              <span className="sr-only">Previous request</span>
            </Button>
            <Button variant="ghost" size="sm" iconOnly icon="chevD" disabled={!onNext} onClick={onNext ?? undefined}>
              <span className="sr-only">Next request</span>
            </Button>
          </div>
        ) : null}
      </div>

      <div className="contact-actions">
        {phone ? (
          <a className={buttonClass({ size: "sm" })} href={`tel:${phoneDigits(phone)}`}>
            <Icon name="phone" />
            <span>Call</span>
          </a>
        ) : null}
        {whatsapp ? (
          <a
            className={buttonClass({ size: "sm" })}
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(greeting)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" />
            <span>WhatsApp</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
        {EMAIL_PATTERN.test(email) ? (
          <a className={buttonClass({ size: "sm" })} href={`mailto:${email}?subject=${encodeURIComponent("Your request to Travel With Moeen")}`}>
            <Icon name="mail" />
            <span>Email</span>
          </a>
        ) : null}
      </div>

      <dl className="dl">
        {phone ? (
          <>
            <dt>Phone</dt>
            <dd>{phone}</dd>
          </>
        ) : null}
        {email ? (
          <>
            <dt>Email</dt>
            <dd>{email}</dd>
          </>
        ) : null}
        <dt>Type</dt>
        <dd>{KIND_LABEL[row.kind]}</dd>
        <dt>Received</dt>
        <dd>{formatDateTime(row.createdAt, { dateStyle: "full", timeStyle: "short" })}</dd>
      </dl>

      {/* Guest text is shown as text, never as HTML (BR-64). */}
      <div className="message">
        <span className="message-k">Message</span>
        {row.message}
      </div>

      {canUpdateStatus ? (
        <>
          <div className="status-row">
            <SegmentedControl
              name={`request-status-${row.id}`}
              legend="Status"
              disabled={saving}
              value={shownStatus}
              options={REQUEST_STATUSES.map((value) => ({ value, label: STATUS_LABEL[value] }))}
              onChange={(value) => {
                const next = value as RequestStatus;
                if (next === shownStatus) return;
                const before = shownStatus;
                setShownStatus(next);
                void onStatus(next).then((saved) => {
                  if (!saved) setShownStatus(before);
                });
              }}
            />
            {canDelete && !confirmingDelete ? (
              <Button variant="danger-outline" size="sm" icon="trash" onClick={() => setConfirmingDelete(true)}>
                Delete request
              </Button>
            ) : null}
          </div>
          {confirmingDelete ? (
            <div className="alert a-danger" role="alertdialog" aria-label="Delete this request?">
              <Icon name="alert" />
              <div className="confirm-row">
                <b>Delete this request? It cannot be undone.</b>
                <Button variant="danger" size="sm" busy={saving} disabled={saving} onClick={onDelete}>
                  Delete
                </Button>
                <Button variant="ghost" size="sm" disabled={saving} onClick={() => setConfirmingDelete(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
          <p className="help">Status saves as soon as you choose it.</p>
        </>
      ) : (
        <Alert tone="info" title="Read only">
          You can read requests. The Owner or a Manager changes the status.
        </Alert>
      )}
    </div>
  );
}
