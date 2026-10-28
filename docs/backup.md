# Database backup

The backup reads `DATABASE_URL`. That is the database the site uses. On this machine that is `localhost` port `5434`, database `travelwithmoeen`. The dump runs `pg_dump` in a Postgres client container. `localhost` is reached as `host.docker.internal` so the client can see that database. The script does not use `docker compose exec`.

The folder `backups/` is not committed and is not under `public/`.

## Every day

On this Mac the job `com.travelwithmoeen.db-backup` runs at 02:15. It calls `scripts/backup-db.sh`. The log is `backups/backup.log`. Install the same job on the machine that holds the database:

```bash
sh scripts/install-daily-backup.sh
```

A restore is used only when the data is damaged. Tell the client before restoring the live database.

## Restore onto a copy

```bash
npm run db:restore-copy
```

That loads `backups/travelwithmoeen-YYYY-MM-DD.sql` into `travelwithmoeen_restore_copy`, prints the table counts, and removes the copy. To restore the live database, stop the site and load that file into `travelwithmoeen` only after the copy looks right and the client has been told. That load replaces the live data.

## Backups from the office

The nightly backup and each Back up now in Office → Backups are `.json` files in private storage. They are not the `.sql` files above, and `npm run db:restore-copy` does not read them. Restore them with `scripts/restore-backup.ts`.

`npm run db:restore -- <file.json> --yes` empties every table in the database that `DATABASE_URL` points at, then loads the backup. Run it on a copy first. The command reads `.env` only when `DATABASE_URL` is not already set, so the copy is chosen on the command line and `.env` is not changed.

1. Download the backup from Office → Backups. Only the Owner sees that page. The file holds logins and guest details, so keep it off shared folders and delete it when you are done.
2. Make an empty copy database and give it the tables. Replace the user and the address with the ones in `.env`, with the database name changed to the copy:

   ```bash
   docker compose exec postgres createdb -U <user> travelwithmoeen_restore_copy
   DATABASE_URL=postgres://<user>:<password>@localhost:5434/travelwithmoeen_restore_copy npx drizzle-kit push --force
   ```

   In PowerShell, set `DATABASE_URL` first and clear it after:

   ```powershell
   docker compose exec postgres createdb -U <user> travelwithmoeen_restore_copy
   $env:DATABASE_URL = "postgres://<user>:<password>@localhost:5434/travelwithmoeen_restore_copy"
   npx drizzle-kit push --force
   Remove-Item Env:DATABASE_URL
   ```

3. Restore into the copy and read the counts it prints, one line per table, such as `tours: 32 rows`. Check them against the live site:

   ```bash
   DATABASE_URL=postgres://<user>:<password>@localhost:5434/travelwithmoeen_restore_copy npm run db:restore -- <file.json> --yes
   ```

   In PowerShell:

   ```powershell
   $env:DATABASE_URL = "postgres://<user>:<password>@localhost:5434/travelwithmoeen_restore_copy"
   npm run db:restore -- <file.json> --yes
   Remove-Item Env:DATABASE_URL
   ```

   The first line names the database it is writing to. Stop if it is not the copy. If any table fails, nothing is restored.
4. Restore the real database only after the copy looks right and the client has been told (BR-55). Stop the site, run the same command with the live `DATABASE_URL`, then start the site. In PowerShell, run `Remove-Item Env:DATABASE_URL` first, so the command reads the live address from `.env`. Remove the copy with `docker compose exec postgres dropdb -U <user> travelwithmoeen_restore_copy`.

## Tried on 8 October 2026

The daily job wrote `backups/travelwithmoeen-2026-10-08.sql` (294,726 bytes). `npm run db:restore-copy` loaded that file into `travelwithmoeen_restore_copy`.

| | Live database | Copy |
|---|---|---|
| Tables | 20 | 20 |
| Users | 3 | 3 |

The copy was removed after the check. The live database was not replaced.
