import { redirect } from "next/navigation";
import { BackupNow } from "@/components/office/backups/BackupNow";
import { formatDateTime } from "@/components/office/format";
import { Alert } from "@/components/office/ui/Alert";
import { buttonClass } from "@/components/office/ui/Button";
import { EmptyState } from "@/components/office/ui/EmptyState";
import { Icon } from "@/components/office/ui/Icon";
import { PageHead } from "@/components/office/ui/PageHead";
import { Table } from "@/components/office/ui/Table";
import { apiPath } from "@/lib/http/api-path";
import { getOfficeBackups, getOfficeSession } from "@/lib/http/office-session";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function BackupPage() {
  const actor = await getOfficeSession();
  if (!actor?.canRunBackup) redirect("/office");
  const rows = await getOfficeBackups();

  return (
    <>
      <PageHead
        title="Backups"
        description="A backup also runs every night. The newest 30 are kept in private storage, not on the website."
        actions={<BackupNow />}
      />
      <Alert tone="info" title="Restoring a backup">
        Download the file, then follow &quot;Backups from the office&quot; in docs/backup.md. Restore onto a copy first, never the live database.
      </Alert>
      {rows.length === 0 ? (
        <div className="card">
          <EmptyState icon="database" title="No backups yet">
            The nightly backup and each Back up now appear here.
          </EmptyState>
        </div>
      ) : (
        <Table label="Backups">
          <thead>
            <tr>
              <th scope="col">Made</th>
              <th scope="col">File</th>
              <th scope="col" className="r">
                Size
              </th>
              <th scope="col" className="r">
                <span className="sr-only">Download</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td className="nowrap">
                  <b>{formatDateTime(row.uploadedAt)}</b>
                  <small className="cell-sub">Pakistan time</small>
                </td>
                <td data-label="File" className="mono clip">
                  {row.name}
                </td>
                <td data-label="Size" className="r">
                  {formatSize(row.size)}
                </td>
                <td data-label="Download" className="r">
                  <a className={buttonClass({ size: "sm" })} href={apiPath(`/api/office/backup/file?name=${encodeURIComponent(row.name)}`)}>
                    <Icon name="download" />
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
