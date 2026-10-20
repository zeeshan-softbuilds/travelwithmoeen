# Design

**Spec:** TWM-SPEC-DESIGN  
**Requirements:** `docs/specs/requirements.md`  
**Tasks:** `docs/specs/tasks.md`  
**Proposal:** TWM-SOW-001, version 1.3  
**Also read:** `docs/rules/project-structure.md` and `docs/rules/coding-standards.md`  

This file says how the first delivery sits on the site that already exists. The public pages stay. The words and prices move into a database. The office edits that database. The public pages read it.

## 1. What stays

The site is a Next.js App Router app. These public routes stay, and their content moves to the database:

- `/` home
- `/tours` and `/tours/[id]`
- `/tours/[id]/template`
- `/destinations` and `/destinations/[id]`
- `/blog` and `/blog/[id]`
- `/gallery`
- `/customize-trip`
- `/contact`
- `/calculator`

`/tours/[id]/template` also calls `calculatePackagePrice`. It currently lists Premier. Move it onto the same quote function, and do not offer Premier there.

### Where the current data lives

| What | File |
|---|---|
| Tours and day plans | `data/tours.ts` |
| Places | `data/destinations.ts` |
| Blog | `data/blog.ts` |
| Gallery | `data/gallery.ts` |
| Reviews | `data/testimonials.ts` |
| Rates used by the live site | `data/pricing.ts` and `lib/calculatePackagePrice.ts` |
| Home slides | Seed list in `scripts/seed-content.ts`. `components/FanGallery1.tsx` only draws the cards it is given. |
| Phone, email, address, social links | `components/Navbar.tsx`, `components/Footer.tsx`, `components/home/SocialMediaSection.tsx`, `app/contact/page.tsx` |
| Tour card price | `components/TourCard.tsx` calls `calculatePackagePrice` with Deluxe and Islamabad, and falls back to `basePrice` |
| Package builder | `components/home/PackageCalculator.tsx`, also used by `app/calculator/page.tsx` |

These pages stay as they are. The office does not edit them in the first delivery:

- `/about`
- `/faq-page`
- `/Cancellation`
- `/TermsAndConditions`
- `/PrivacyPolicy`
- `/TravelersInstructions`

The look of the public pages does not change in the first delivery. The components stay. Tours, places, posts, gallery, reviews, and prices move to the database. About, FAQ, and the legal pages do not.

Today the tours, places, posts, gallery, reviews, and prices are read from files in `data/`. After cutover, those records are read from the database. The files stay in the repo as the record of what was on the site. They are not the live source. About, FAQ, and the legal pages are not part of that move.

Contact saves the request and does not send email. The custom trip form saves the request and keeps the email send already on that page. Book Now saves the request and opens `https://wa.me/923339981177`.

## 2. Shape

The screens and the rules must be able to deploy as two services later. Today they may run in one Next.js process. The only door between them is the API.

```text
Browser
  public pages and office screens
        |
        |  HTTP JSON, host from API_BASE_URL
        v
app/api
  thin routes
        |
        v
lib
  auth, content, office rules, quote
        |
        v
PostgreSQL
```

There is one quote function in `lib/`. The guest package builder and the office quote screen both reach it through the API. The guest call does not send night edits or day edits. The office call can.

Role checks run in `lib/`, on the server. Hiding a button in the browser is not enough.

Office screens are in US English. The public site is not translated.

## 3. Office area

The office area lives at `/office`. A person who is not logged in is sent to `/office/login`.

| Screen | Who | Job |
|---|---|---|
| Login | all staff | Email and password. One person, one login. |
| Users | Owner | Create, remove, and change a role. |
| Tours | Editor, Owner | Title, text, days, photos, featured flag. |
| Places | Editor, Owner | Place guides. |
| Blog, gallery, reviews, home slides | Editor, Owner | Public content. |
| Site details | Editor, Owner | Phone, address, social links. |
| Rates | Manager, Owner | Hotels, vehicles, air extras, jeep lines, profit margin. |
| Quote | Manager, Owner | Build a quote, then edit one night or one day. |
| Requests | all three roles | Read the list. The Owner and the Manager can update status. Only the Owner can delete. The Editor cannot change status or delete. |

The Editor does not get a link that opens a rupee field. The server still refuses the save if they try.

## 4. Data

Main records:

| Record | Holds |
|---|---|
| User | Email, password hash, role. |
| Tour | The fields the public tour page already shows, plus a price source. |
| Tour day | Day number, title, description, highlights. |
| Place, post, photo, review, slide | The public content the Editor edits. |
| Site settings | Phone, address, social links. |
| Hotel rate | Place, start city, grade, twin, 3-share, hotel name, offered or not. |
| Vehicle rate | Place, start city, road or air, vehicle, rent, fuel, toll, seats, on or off. |
| Air extra | Islamabad ticket, Lahore add, Karachi add, welcome pack, entry, infant extra, sticker. |
| Jeep line | Place, road or air, label, people per jeep, amount, on or off. |
| Profit margin | A whole percent from 0 to 100. One active value. The prototype default is 20 percent, pending Moeen sign-off. |
| Quote | The inputs, the night lines, the day lines, the extras, the total. |
| Guest request | Contact, custom trip, or booking. Status. |
| Activity | Who saved what in the office, and when. Added in T-37k. Section 11. |

Tour price source is either `excel` or `website`. Ratti Gali, code 201, is `website` and keeps the price already stored on the tour. Other tours use `excel`.

Premier rows can be stored. `offered` is false, so guests never see Premier.

A zero vehicle row is stored and marked not live. The quote skips it.

## 5. Quote function

One function. Do not keep a second copy of the math in the React components. Do not keep the old constants in `lib/calculatePackagePrice.ts` (welcome pack 1,400, entry 2,500, sticker 600). Those are the old website numbers. The first delivery uses the amounts below.

### Who counts

- A seat is used by each adult, each child, and each infant with their own seat.
- An infant on a lap does not use a seat and does not take a room.
- Rooms, when nobody types a count, equal the number of seats divided by 3, rounded up.
- More than two people in a room uses the 3-share rate. Two or fewer uses the twin rate.
- Meals and arrival breakfast are per adult and per child. Infants are not included.
- The child air fare is 75 percent of the adult fare. The adult fare is the Islamabad ticket plus the Lahore or Karachi extra, when that start city applies.

### Order of the starting quote

1. Nights equal days minus 1. A one-day trip has no hotel night.
2. Vehicle count equals seats needed, divided by the seats on that vehicle, rounded up, unless a count is typed.
3. Vehicle cost equals the vehicle count times ((daily rent plus daily fuel) times days, plus the toll once). The toll is once per vehicle, not once for the whole trip.
4. Hotel cost equals the nightly rate times nights times rooms.
5. Guide, if selected, is 5,000 rupees times days. On the public builder, a Coaster 4c or Coaster 5c selects the guide. The office can turn it off. The test quote has no guide.
6. Meals, if selected, use the grade rate times nights times adults and children.
7. A road trip longer than one day adds arrival breakfast of 500 rupees times adults and children.
8. A Lahore road trip longer than three days adds 5,000 rupees times (days minus 3) times the vehicle count. This is not added to an air quote.
9. An air quote adds, for each adult and each child, a welcome pack of 1,500 and entry tickets of 4,000. Each infant adds 800. The sticker is 500 times rooms. Tickets are the adult fare times adults, 75 percent of that fare times children, 1,000 for each lap infant, and 5,000 for each infant with a seat.
10. A jeep line that is turned on, and that matches the place and road or air, is added once for each group of six travelers, at the full amount on the line. Do not multiply 90,000 by 3.
11. Subtotal is the sum of those lines. Total equals subtotal times (1 plus the profit margin). The margin is a whole percent from 0 to 100. The Skardu test uses 20 percent, which is 1.20. Do not divide by 1.20.

The guest builder keeps today's minimum trip length for each place. That limit is not applied to an office quote. The Skardu test is 5 days even though the public road minimum for Skardu is 6.

The test quote is Islamabad, Skardu Valley, 5 days, 2 adults, Gli car, Deluxe, no guide, no meals, a profit margin of 20 percent, and no night or day edit. The package includes a hotel and transport. The total must be 140,400. That is a subtotal of 117,000 times 1.20.

### Hotel package, pending Moeen sign-off

The quote has three hotel choices. With hotel is the default and includes a hotel and other services. No hotel keeps the other services and drops the hotel line, nights, rooms, meals, stickers, and the road breakfast. Hotel only asks for the city and the number of nights, and drops the vehicle, day edits, toll, jeeps, guide, extras, breakfast, the Lahore extra, and, on air, the tickets, welcome pack, entry, sticker, and infant extra. Under With hotel, Same hotel all nights is the default: one catalog pick for every night. Change per night is one click and shows the catalog pick on each night. A package with neither a hotel nor other services is refused. Guests get the same three choices and see only the final total. Staff see the lines and one total for each mode. Hotel cost, when a catalog pick has been changed, follows city, then hotel, then room, then occupancy. Grade is a label on the hotel. Until that pick is changed, the untouched quote uses the published twin rate so the Skardu test stays 140,400. These defaults are pending Moeen sign-off. The live office builds the three choices in T-37h, after sign-off. Until the catalog is built in T-39, a hotel night uses the grade rate, which is BR-84.

### Couple price on a tour card

Use the same function with Deluxe, 2 adults, 1 twin room, Islamabad, the tour's days, the tour's road or air choice, no guide, no meals, and the active profit margin. This is what `components/TourCard.tsx` does today. The road vehicle for 2 adults is Gli car. The air vehicle for 2 adults is Prado. If the function returns no price, show `basePrice`.

Ratti Gali, code 201, does not use this function for the card. Show the stored website price, 150,000, until the office changes that tour.

### Edits

An office save can replace the rate on one night line, and the hotel name on that night, or replace or clear the vehicle on one day line. Other lines stay. The total is calculated again from the lines, then the profit margin is applied.

Average nightly rate equals the sum of the rates saved on the night lines, after edits, divided by the number of nights. The screen shows that number next to the hotel category it sits in. The match uses the twin rate on the loaded hotel table for that place. If no grade is an exact match, the screen still shows the average and the nearest grade. The example is 20,000 with the 20,000 category.

The guest builder never sends these edits. The guest sees one total only. A staff member who is logged in sees each line and the profit.

Road start cities in the guest builder are Lahore and Islamabad. Karachi is not in that list. Air start cities are Karachi, Lahore, and Islamabad.

### Guest buttons

- Contact: save the request. The live form does not send today. Do not only clear the form.
- Custom trip: save the request, and keep the email send that is already on the page.
- Book Now: save the request, and open `https://wa.me/923339981177`. Do not copy the placeholder `tel:+1234567890` from the navbar.

## 6. First load from Excel

The workbook is `resources/Trip Cost Calculator Final - Copy.xlsx`. That folder is not in git. Do not commit it. Do not open or copy `resources/Important-Notes.txt`.

Read the rate sheets `Road_DB ISB`, `Road_DB LHE`, `Air_DB`, and `by air ticket fare`. The sheets `BY ROAD` and `BY AIR` are examples of a finished quote. They are not the rate lists.

One import writes hotel rates, vehicle rates, air extras, and the four jeep lines. It does not delete the file.

A seed script creates the first Owner login on the developer's machine. Do not put that password in the repo. After week 1, the real Owner replaces it from the Users screen.

Rules:

- Blank place name on a vehicle row that has rent, fuel, and seats: use the place on the nearest row above.
- Zero rows: store them as not live.
- Skardu and Hunza air row with twin 24,000, 3-share 28,000, and no grade name: Executive.
- Neelum Taobat Arang Kel rates are replaced with the Swat rates under the Taobat place. Do not keep the 6,000 deluxe twin as the live Taobat rate. Do not create a Taobat tour page.
- Naran rows: copy as stored, for now. Do not replace them with Swat.
- Parado in the sheet is stored as Prado for the office label.
- Premier: store, do not offer.
- Rows that still have no place: write them to an import report. Do not invent a number.
- Read cell values only. Do not run a macro, follow an external link, or write a file under `public/`.

After a successful import, new quotes use the database. The Excel file can stay on disk as the client's copy.

## 7. Login

Passwords are hashed with bcrypt, at least 12 rounds. A new password is at least 8 characters. Staff do not share one password. The Owner removes a login when someone leaves. The last Owner cannot be removed.

The login error is one sentence for an unknown email and for a wrong password. Do not say which one failed.

A session cookie is enough. Guests never get a session for the office. Login sets a new cookie. Logout clears it. The cookie name is `twm_office`. It is `httpOnly`, `SameSite=Lax`, and `Secure` when the site is in production. It expires in 7 days. The value is signed. The role is loaded from the database on each request. Do not store the role inside the cookie and trust it.

`proxy.ts` only checks that a cookie exists. The signed check stays in the session read. Do not drop that check in a later step.

Step 2, task T-27, records failed sign-ins in the database. After 10 failures for the same email within 15 minutes, the next sign-in is refused until that window ends. A missing session is 401. A wrong role is 403. Step 1 may still use 400 for a wrong role. T-27 changes that. Do not leave it for Step 3.

Database calls use the query builder. Do not build SQL by joining strings.

## 7a. Uploads

Step 1 stores a photo when the browser says the file is an image. Step 2, task T-26, replaces that check. Read the file bytes. Accept JPEG, PNG, and WebP only, at 5 MB or under. Refuse SVG. The saved name has no folder path. Do not move this task to Step 3 or sprint 4.

## 7b. Security tests

Task T-28 is part of Step 2. It runs four tests: lint on the code, `npm run check:sca` on production packages, an OWASP ZAP baseline scan of the running site with no High alert, and the step script against that same running site. The script must see 401, 403, a refused upload, and the login lock. Later steps run the same four tests again. The script keeps the old cases and adds the new step's cases. It does not drop an old case.

The route list in requirements section 13 is the authorization list for the whole project. A new office route is added to that list in the same change. A route that is not on the list is refused.

## 7c. Office media

Office media is built. The rules are BR-75 to BR-80. The Meadow file, T-36 and BR-81, is on `main`. The next sprint builds that look into `/office`, rule BR-82, before Phase 2 and Phase 3.

What the office can do today:

| Screen | Path | Upload | Remove |
|---|---|---|---|
| Tour main photo | Yes | Yes | Clear the path, or the Owner deletes the tour. The file stays. |
| Tour extra photos | One path per line | No | Delete a line. The file stays. |
| Tour PDF | Yes | No | Clear the path. |
| Place banner and section photo | Yes | No | A section can be added. It cannot be removed. |
| Blog cover and section photo | Yes | No | A section cannot be added or removed. |
| Gallery | Yes | Yes | Remove photo. The file stays. |
| Home slide | Yes | Yes | Remove slide. The file stays. |
| Review avatar | Yes | No | Remove deletes the whole review. |

What this build adds:

- The same upload control on every row that is missing it in the table above.
- Remove on a tour extra photo, a place section, a blog section, a banner, a cover, and a review avatar. The tour, place, post, and review stay.
- Add and remove for a blog section. A place section can already be added. This build adds remove.
- A stored file that this office uploaded is deleted when that picture is replaced or removed. The same delete runs for a gallery photo, a home slide, a tour extra photo, a tour PDF, a section photo, and every office file on a tour when that tour is deleted.
- The file is saved with `put` from `@vercel/blob`, `access: "public"`, under `media/` plus one file name, using `MEDIA_READ_WRITE_TOKEN` for this environment. The page stores the returned public URL and loads that URL. `del` deletes it. Backups stay on this environment's private store, `put` with `access: "private"` under `backups/`, using `BLOB_READ_WRITE_TOKEN`. A media URL cannot read a backup. A missing `MEDIA_READ_WRITE_TOKEN` fails the save. `public/uploads` on the server disk is not the store. A PDF is at most 10 MB. Preview and Production do not share a Blob store or a Neon database.

These saves use the office routes that already exist: tours, places, posts, photos, reviews, and slides. A new route is added to requirements section 13 in the same change. The role check stays in `lib/`. The screen does not import `lib/office` or `lib/auth`. An Editor or the Owner may upload and remove these files. A Manager is refused. The Owner or an Editor may delete a whole tour. A Manager may not.

## 8. Guest requests

| Form | Save | Also |
|---|---|---|
| Contact | Yes | |
| Custom trip | Yes | |
| Book Now | Yes | Open `https://wa.me/923339981177` |

The office list shows status. The Manager and the Owner can change status. Only the Owner can delete.

A guest name is at most 200 characters, a phone is at most 40, an email is at most 200, and a message is at most 4,000. Store the message as text. A public page does not render it as HTML and does not show the phone, the email, or the message.

## 9. Backups

The database is backed up once a day. A restore is done only when the data is damaged, and the client is told. The backup file is not committed and is not placed under `public/`. Preview backups go to the Preview private store. Production backups go to the Production private store. Each environment also has its own public media store and its own Neon database.

The first delivery does not promise a new uptime number. If the site is down, check the host, fix a fault that is inside this work, and restore from the daily backup if the data is damaged.

## 10. Later phases

The next sprint is the Meadow office, BR-82. Moeen gets `docs/office-design/meadow.html` first. Then `/office` is rebuilt to match that file. The public site look stays. The prototype control that switches Owner, Manager, and Editor without a password stays out of the live office. This sprint is accepted before Phase 2. Section 11 says how it is built.

Phase 2 is sprint 3. It is hours per stop, the labels Comfort, Luxury, Adventure, and Exploration, and the Kashmir, Swat, and Chitral jeep products. The four jeep lines in BR-27 stay in the baseline. Phase 2 does not start until BR-82 is accepted.

Phase 3 is sprint 4. These are not built in the baseline, in the next sprint, or in Phase 2. The Meadow file shows them on Trip plans for review. The live office does not.

- Season trip plans by month. Blossom is in April. Summer is May through September. Autumn is 10 October through 30 November. Winter is 1 December through 30 March. The exact April dates are still to be named.
- Fuel by kilometers. Gli uses 1 liter for each 14 km. Prado uses 1 liter for each 5 km. One petrol rate and one diesel rate update every quote.
- Guide price by area. Islamabad and Murree can cost less than Skardu and Hunza.
- Entry tickets by stop
- A tracking code on a guest quote
- A no-price field copy, with services, dates, flights, vehicles, and hotels, and no rupee amounts
- PDF or image download of a guest quote. The guest file shows one total, not the staff lines and not the profit
- Excel download of the live prices. Only the Owner and the Manager can download it

In sprint 4, the sticker follows the number of vehicles. In the baseline it stays 500 rupees times rooms.

## 11. Meadow office, T-37

The prototype is the reference for the look. It is not code to copy. It is plain HTML and JavaScript built from `docs/office-design/src/`. The live office is Next.js, React, and Tailwind 4. Rebuild each screen as React, and read the data from the API routes that already exist. The prototype data in `build.mjs` is sample data. Do not load it into the database.

Run `node docs/office-design/src/build.mjs` and open `docs/office-design/meadow.html` to compare a screen. The preview copy is `https://new.travelwithmoeen.com/meadow`.

### Look

- Tokens. Copy the custom properties in `base.css` and `meadow.css` into one office stylesheet, such as `components/office/meadow.css`. Scope every rule under one office root class on the office layout, so no token or class reaches a public page. Do not add them to the Tailwind `@theme`, because that is global.
- Classes. Port the prototype classes the screens use, such as `card`, `btn`, `field`, `tbl`, `badge`, `alert`, `stat`, `seg-status`, and `drawer`, into the same scoped stylesheet. Wrap them in small components under `components/office/ui/`. A screen uses those components, not new one-off styles.
- Icons. The prototype draws each icon from one path list, `IC` in `core.js`. Port it as one `Icon` component with the same paths.
- High contrast. The prototype has a `data-theme="hc"` mode. It is not part of T-37.
- Phone. The prototype sidebar becomes a menu on a phone. Keep that, and keep the quote form full width on a phone.

### Shell and roles

`OfficeShell` becomes the prototype shell: sidebar, top bar, and phone menu. The sidebar uses the groups in the prototype `NAV`: Overview, Sales, Content, and Admin. Each link shows only when the session allows it:

| Link | Shown when |
|---|---|
| Dashboard, Requests | Any signed-in role |
| Rates and quotes | `canEditRates` |
| Tours, Places, Blog, Gallery, Reviews, Home slides, Site details | `canEditContent` |
| Users | `canManageUsers` |
| Backups | `canRunBackup` |

Trip plans is not a live link. The role switch bar at the top of the prototype is not on the live office. The role comes from the session, as in section 7. Hiding a link does not replace the server check.

### Screens

| Prototype | Live route | Reads and writes | Note |
|---|---|---|---|
| `#/login` | `/office/login` | `POST /api/office/login` | Same login rules. Only the look changes. |
| `#/dashboard` | `/office` | `GET /api/office/requests`, `GET /api/office/rates`, `GET /api/office/backup`, `GET /api/office/activity` | New requests, the active margin, the last backup, and recent activity, each only for a role that may read it. The activity feed comes in T-37k. The costing-file note stays a placeholder. |
| `#/requests` | `/office/requests` | `GET /api/office/requests`, `POST .../status`, `POST .../delete` | List, filters, and detail. |
| `#/rates/*` | `/office/rates` | `GET` and `POST /api/office/rates` | Hotels, vehicles, jeep lines, air extras, and the margin. Tabs may become sub-routes. |
| `#/rates/quote` | `/office/rates`, quote tab | `POST /api/quote` | Night and day edits stay. Hotel choices come in T-37h. |
| `#/tours`, `#/places`, `#/blog`, `#/gallery`, `#/reviews`, `#/slides`, `#/site` | The same `/office/...` routes | The office content routes that already exist | Keep every upload and remove control, and the tour and place links. |
| `#/users` | `/office/users` | `/api/office/users/*` | Owner only. |
| `#/backups` | `/office/backup` | `/api/office/backup` and `/backup/file` | Owner only. |
| `#/plans`, `#/system` | None | None | Prototype only. |

A screen that needs data no route returns asks for the route in its pull request, and adds it to requirements section 13 in the same change. The only new route in T-37 is `GET /api/office/activity`, in T-37k.

### Activity record, T-37k

One new table, `activity`:

| Column | Holds |
|---|---|
| `id` | Serial key. |
| `at` | Time of the save, with time zone. |
| `user_id` | The login that saved. No foreign key, so removing a login does not remove its old rows. |
| `user_email` | The email at the time of the save. |
| `area` | One of `content`, `rates`, `requests`, `users`, `backups`. It decides who may read the row. |
| `kind` | The record type, such as `tour`, `place`, `post`, `photo`, `review`, `slide`, `site`, `hotel_rate`, `vehicle_rate`, `jeep_line`, `air_extra`, `margin`, `request`, `user`, `backup`. |
| `record_id` | The record key, such as the tour id or the place slug. Empty for a single record such as the margin. |
| `text` | One short line for people, such as "Saved tour 5 Days Trip to Skardu" or "Changed the profit margin to 22 percent". |

- Write the row inside the same `lib/` function that saves, after the save succeeds, in the same database transaction where the save already uses one. Add one helper, such as `recordActivity` in `lib/office/activity.ts`. Do not write rows from a route or a screen.
- The text names the record. It never holds a password, a token, a secret, or a guest phone or message. A request row says "Moved request 12 to In progress", not the guest name.
- Who reads what: Owner reads every area. Manager reads `rates` and `requests`. Editor reads `content` and `requests`. `users` and `backups` are Owner only. The filter runs in `lib/`, using the role checks in `lib/auth/permissions.ts`. The route calls a `lib/` function and does not import `lib/auth/permissions` itself, which the standards check refuses.
- "Saved by" on a screen is the newest row for that `kind` and `record_id`. No column is added to the content tables.
- Rows older than 365 days are deleted by `recordActivity` when it writes a new row. The backup run does not delete data.
- Add `activity` to the end of `BACKUP_TABLES` in `lib/office/backup.ts`, so a backup and a restore keep it.

### Profit margin, T-37f

The `seasons` table keeps one row. Its `percent` becomes any whole percent from 0 to 100. The `quotes.season_percent` column keeps its name, so old quotes still read. In code, the name becomes margin. The `SeasonPercent` type of 15 or 20 in `lib/quote.ts` and `lib/rates.ts` becomes a number checked from 0 to 100. The save stays on `POST /api/office/rates`, with the Owner and Manager check in `lib/`. The guest quote uses the saved margin. The starting value is 20 percent.

### Hotel choices, T-37h

Built after rows S-3 to S-8 in the tasks file are Approved or Changed. The rules are section 5, "Hotel package, pending Moeen sign-off". Add one input to the quote function, the hotel choice: with, none, or only. Keep the default in one constant in `lib/quote.ts`, so a change from Moeen is one line plus its check. Same hotel all nights is the starting quote in BR-45. Change per night opens the night lines in BR-46, with a grade or a typed rate on each night, which is BR-84. The hotel catalog is not built. That is T-39.

### When Moeen changes something

1. Update the row in the sign-off table in `docs/specs/tasks.md`.
2. Change the requirement and this design in the same pull request.
3. If the change is to the look, update the prototype source and rebuild `meadow.html` in that pull request too, so the reference stays true.
4. Then change the code. A task that is already merged gets a small follow-up pull request that names the S row.
