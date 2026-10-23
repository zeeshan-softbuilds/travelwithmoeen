import Link from "next/link";
import { redirect } from "next/navigation";
import { ROLE_NAME } from "@/components/office/office-nav";
import { formatDateTime, greetingAt, hoursSince, relativeTime, requestTime } from "@/components/office/format";
import { StatusBadge, guestName, initialOf, messagePreview } from "@/components/office/requests/request-labels";
import { Alert } from "@/components/office/ui/Alert";
import { buttonClass } from "@/components/office/ui/Button";
import { Card } from "@/components/office/ui/Card";
import { EmptyState } from "@/components/office/ui/EmptyState";
import { Icon, type IconName } from "@/components/office/ui/Icon";
import { PageHead } from "@/components/office/ui/PageHead";
import { Stat, Stats } from "@/components/office/ui/Stat";
import { getOfficeBackups, getOfficeRequests, getOfficeSession } from "@/lib/http/office-session";
import { getRateDesk, getTours } from "@/lib/http/site-content";

type Todo = {
  tone: "info" | "warning" | "success";
  icon: IconName;
  text: string;
  href: string;
  action: string;
};

const NEW_REQUEST_WAIT_HOURS = 24;
const IN_PROGRESS_WAIT_HOURS = 72;
const BACKUP_AGE_HOURS = 26;

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

export default async function OfficeDashboardPage() {
  const user = await getOfficeSession();
  if (!user) redirect("/office/login");

  // Each read runs only for a role that may call its route.
  const [requests, desk, backups, tours] = await Promise.all([
    getOfficeRequests(),
    user.canEditRates ? getRateDesk() : null,
    user.canRunBackup ? getOfficeBackups() : null,
    user.canEditRates ? null : getTours(),
  ]);
  const now = requestTime();

  const waiting = requests.filter((row) => row.status === "new");
  const inProgress = requests.filter((row) => row.status === "in_progress");
  const closed = requests.filter((row) => row.status === "closed");
  const latest = requests.slice(0, 5);
  const lastBackup = backups?.[0] ?? null;

  const todos: Todo[] = [];
  const oldNew = waiting.filter((row) => hoursSince(row.createdAt, now) > NEW_REQUEST_WAIT_HOURS).length;
  if (oldNew) {
    todos.push({ tone: "warning", icon: "inbox", text: `${plural(oldNew, "new request has", "new requests have")} waited more than a day`, href: "/office/requests?status=new", action: "Reply" });
  }
  const stale = inProgress.filter((row) => hoursSince(row.createdAt, now) > IN_PROGRESS_WAIT_HOURS).length;
  if (stale) {
    todos.push({ tone: "info", icon: "clock", text: `${plural(stale, "request has", "requests have")} been in progress for more than 3 days`, href: "/office/requests?status=in_progress", action: "Review" });
  }
  if (desk) {
    const hotelsOff = desk.hotels.filter((row) => !row.offered).length;
    const vehiclesOff = desk.vehicles.filter((row) => !row.live).length;
    const jeepsOff = desk.jeeps.filter((row) => !row.live).length;
    if (hotelsOff) todos.push({ tone: "info", icon: "tag", text: `${plural(hotelsOff, "hotel rate is", "hotel rates are")} not offered to guests`, href: "/office/rates", action: "Check" });
    if (vehiclesOff) todos.push({ tone: "info", icon: "tag", text: `${plural(vehiclesOff, "vehicle is", "vehicles are")} switched off`, href: "/office/rates/vehicles", action: "Check" });
    if (jeepsOff) todos.push({ tone: "info", icon: "tag", text: `${plural(jeepsOff, "jeep line is", "jeep lines are")} switched off`, href: "/office/rates/jeeps", action: "Check" });
  }
  if (backups) {
    if (!lastBackup) {
      todos.push({ tone: "warning", icon: "database", text: "There is no backup yet", href: "/office/backup", action: "Back up" });
    } else if (hoursSince(lastBackup.uploadedAt, now) > BACKUP_AGE_HOURS) {
      todos.push({ tone: "warning", icon: "database", text: "The last backup is more than a day old", href: "/office/backup", action: "Back up" });
    } else {
      todos.push({ tone: "success", icon: "database", text: `Backup made ${relativeTime(lastBackup.uploadedAt, now).toLowerCase()}`, href: "/office/backup", action: "View" });
    }
  }
  const openTodos = todos.filter((todo) => todo.tone !== "success").length;

  return (
    <>
      <PageHead
        title={greetingAt(now)}
        description={`${formatDateTime(new Date(now).toISOString(), { dateStyle: "full" })} · signed in as ${ROLE_NAME[user.role]}.`}
      />
      {/* Placeholder until S-9: one example trip where the dashboard does not match the costing file. */}
      <Alert tone="info" title="Costing file">
        The mismatch with the costing file is being checked.
      </Alert>

      <Stats>
        <Stat
          icon="inbox"
          label="New requests"
          value={waiting.length}
          meta={waiting.length ? `Oldest ${relativeTime(waiting[waiting.length - 1].createdAt, now).toLowerCase()}` : "All caught up"}
          href="/office/requests?status=new"
        />
        <Stat icon="clock" label="In progress" value={inProgress.length} meta="Waiting on you or the guest" href="/office/requests?status=in_progress" />
        {user.canEditRates ? (
          <Stat icon="tag" label="Profit margin" value={desk ? `${desk.seasonPercent}%` : "Not loaded"} meta="Guests see this on the total" href="/office/rates/margin" />
        ) : (
          <Stat
            icon="map"
            label="Tours live"
            value={tours?.length ?? 0}
            meta={`${tours?.filter((tour) => tour.featured).length ?? 0} featured`}
            href="/office/tours"
          />
        )}
        {user.canRunBackup ? (
          <Stat
            icon="database"
            label="Last backup"
            value={lastBackup ? formatDateTime(lastBackup.uploadedAt, { timeStyle: "short" }) : "None"}
            meta={lastBackup ? formatDateTime(lastBackup.uploadedAt, { dateStyle: "medium" }) : "No backup yet"}
            href="/office/backup"
          />
        ) : (
          <Stat icon="checkCircle" label="Closed" value={closed.length} meta="Requests done" href="/office/requests?status=closed" />
        )}
      </Stats>

      <div className="dash-grid">
        <Card
          title="Latest requests"
          description="Newest first"
          flush
          actions={
            <Link className={buttonClass({ variant: "ghost", size: "sm" })} href="/office/requests">
              Open inbox
            </Link>
          }
        >
          {latest.length ? (
            <ul className="mini-list">
              {latest.map((row) => (
                <li key={row.id}>
                  <Link href={`/office/requests?id=${row.id}`}>
                    <span className="avatar" aria-hidden="true">
                      {initialOf(guestName(row))}
                    </span>
                    <span className="mini-main">
                      <b>{guestName(row)}</b>
                      <small>{messagePreview(row.message)}</small>
                    </span>
                    <span className="mini-meta">
                      <small title={formatDateTime(row.createdAt)}>{relativeTime(row.createdAt, now)}</small>
                      <StatusBadge status={row.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon="inbox" title="No requests yet">
              Contacts, custom trips, and bookings from the website appear here.
            </EmptyState>
          )}
        </Card>

        <Card title="Needs attention" description={openTodos ? "Things to look at today" : "Nothing waiting"} flush>
          <ul className="todo">
            {todos.length ? (
              todos.map((todo) => (
                <li className={`todo-${todo.tone}`} key={todo.text}>
                  <span className="todo-ic">
                    <Icon name={todo.tone === "success" ? "checkCircle" : todo.icon} />
                  </span>
                  <span className="todo-t">{todo.text}</span>
                  <Link className={buttonClass({ variant: "ghost", size: "sm" })} href={todo.href}>
                    {todo.action}
                    <span className="sr-only">: {todo.text}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="todo-success">
                <span className="todo-ic">
                  <Icon name="checkCircle" />
                </span>
                <span className="todo-t">All clear</span>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </>
  );
}
