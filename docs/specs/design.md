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
| Air extra | Islamabad ticket, Lahore add, Karachi add, welcome pack, entry, infant extra, sticker. From T-48, the Lahore and Karachi adds are read from the start city instead. |
| Pricing rules | Guide per day, arrival breakfast, child fare percent, lap infant fare, seat infant fare, people per room. One row. Added in T-47. Section 12. |
| Meal rate | Grade, dinner per night, lunch per day. One row for each guest grade. Added in T-47. Section 12. |
| Start city | Name, road or not, air or not, air extra, long-route extra. Added in T-48. Section 12. |
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
- Rooms, when nobody types a count, equal the number of seats divided by 3, rounded up. From T-47, the 3 is the people-per-room pricing rule.
- From T-55, the hotel rate is per room. The rooms that hold a third guest use the 3-share rate, and the other rooms use the twin rate. The number of 3-share rooms is seats minus twice the rooms, from 0 up to the number of rooms. With 5 seats in 2 rooms that is 1 room at 3-share and 1 at twin. With 6 seats in 2 rooms, both are 3-share. Lap infants take no room, as above. A typed share of twin or triple still prices every room at that rate. Before T-55, every room used the 3-share rate when there were more than two people per room.
- Meals and arrival breakfast are per adult and per child. Infants are not included.
- The child air fare is 75 percent of the adult fare. The adult fare is the Islamabad ticket plus the Lahore or Karachi extra, when that start city applies. From T-47, the 75 is a pricing rule. From T-48, the extra is the start city's air extra.

### Order of the starting quote

1. Nights equal days minus 1. A one-day trip has no hotel night.
2. Vehicle count equals seats needed, divided by the seats on that vehicle, rounded up, unless a count is typed.
3. Vehicle cost equals the vehicle count times ((daily rent plus daily fuel) times days, plus the toll once). The toll is once per vehicle, not once for the whole trip.
4. Hotel cost equals, for each night, the 3-share rate times the 3-share rooms plus the twin rate times the twin rooms. A night edit that types a rate uses that rate for every room that night, as today. From T-55, the hotel line's working shows both, for example "1 room × 28,000 3-share + 1 room × 24,000 twin × 4 nights".
5. Guide, if selected, is 5,000 rupees times days. From T-47, the 5,000 is the guide pricing rule. On the public builder, a Coaster 4c or Coaster 5c selects the guide. The office can turn it off. The test quote has no guide.
6. Meals, if selected, use the grade rate times nights times adults and children. From T-47, this is Dinner, at the grade's dinner rate. Lunch, if selected, is the grade's lunch rate times days times adults and children.
7. A road trip longer than one day adds arrival breakfast of 500 rupees times adults and children. From T-47, the 500 is the breakfast pricing rule.
8. A Lahore road trip longer than three days adds 5,000 rupees times (days minus 3) times the vehicle count. This is not added to an air quote. From T-48, the start city, the 3 days, and the 5,000 come from the start city's long-route extra.
9. An air quote adds, for each adult and each child, a welcome pack of 1,500 and entry tickets of 4,000. Each infant adds 800. The sticker is 500 times vehicles, from T-55. Before T-55 it was 500 times rooms. Tickets are the adult fare times adults, 75 percent of that fare times children, 1,000 for each lap infant, and 5,000 for each infant with a seat. From T-47, the 75 percent, the 1,000, and the 5,000 are pricing rules. From T-49, an office quote with tickets turned off has no ticket line, and the welcome pack, entry, infant extra, and sticker stay.
10. A jeep line that is turned on, and that matches the place and road or air, is added once for each group of six adults and children, at the full amount on the line. From T-55, infants are not counted. Before T-55, every traveler was counted. Do not multiply 90,000 by 3.
11. Subtotal is the sum of those lines. Total equals subtotal times (1 plus the profit margin). The margin is a whole percent from 0 to 100. The Skardu test uses 20 percent, which is 1.20. Do not divide by 1.20.

The guest builder keeps today's minimum trip length for each place. That limit is not applied to an office quote. The Skardu test is 5 days even though the public road minimum for Skardu is 6.

The test quote is Islamabad, Skardu Valley, 5 days, 2 adults, Gli car, Deluxe, no guide, no meals, a profit margin of 20 percent, and no night or day edit. The package includes a hotel and transport. The total must be 140,400. That is a subtotal of 117,000 times 1.20.

### Hotel package

The quote has three hotel choices. With hotel is the default and includes a hotel and other services. No hotel keeps the other services and drops the hotel line, nights, rooms, meals, stickers, and the road breakfast. Hotel only asks for the city and the number of nights, and drops the vehicle, day edits, toll, jeeps, guide, extras, breakfast, the Lahore extra, and, on air, the tickets, welcome pack, entry, sticker, and infant extra. Under With hotel, Same hotel all nights is the default: one catalog pick for every night. Change per night is one click and shows the catalog pick on each night. A package with neither a hotel nor other services is refused. Guests get the same three choices and see only the final total. Staff see the lines and one total for each mode. Hotel cost, when a catalog pick has been changed, follows city, then hotel, then room, then occupancy. Grade is a label on the hotel. Until that pick is changed, the untouched quote uses the published twin rate so the Skardu test stays 140,400. Moeen approved these defaults on 13 November 2026, sign-off rows S-3 to S-8. The live office builds the three choices in T-37h. Until the catalog is built in T-39, a hotel night uses the grade rate, which is BR-84.

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
- From T-51, the browser uploads the file straight to the media store, which is section 14. Before T-51, the file is saved with `put` from `@vercel/blob`, `access: "public"`, under `media/` plus one file name, using `MEDIA_READ_WRITE_TOKEN` for this environment. The page stores the returned public URL and loads that URL. `del` deletes it. Backups stay on this environment's private store, `put` with `access: "private"` under `backups/`, using `BLOB_READ_WRITE_TOKEN`. A media URL cannot read a backup. A missing `MEDIA_READ_WRITE_TOKEN` fails the save. `public/uploads` on the server disk is not the store. A PDF is at most 10 MB. Preview and Production do not share a Blob store or a Neon database.

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

Built after rows S-3 to S-8 in the tasks file are Approved or Changed. The rules are section 5, "Hotel package". Add one input to the quote function, the hotel choice: with, none, or only. Keep the default in one constant in `lib/quote.ts`, so a change from Moeen is one line plus its check. Same hotel all nights is the starting quote in BR-45. Change per night opens the night lines in BR-46, with a grade or a typed rate on each night, which is BR-84. The hotel catalog is not built. That is T-39.

### When Moeen changes something

1. Update the row in the sign-off table in `docs/specs/tasks.md`.
2. Change the requirement and this design in the same pull request.
3. If the change is to the look, update the prototype source and rebuild `meadow.html` in that pull request too, so the reference stays true.
4. Then change the code. A task that is already merged gets a small follow-up pull request that names the S row.

## 12. Costing desk feedback, T-47 to T-49

Requirements section 8b. The reference is the team's costing desk, `Trip-Casting-Desk-v1.2`, which stays in the feedback folder and never enters the repository. Read the rules from the requirements, not from the desk. Where the desk differs, rows S-10 to S-12 in the tasks file decide.

Build T-47, then T-48, then T-49, one pull request each, into the fork `main`. Each one adds an additive migration in `drizzle/` and the matching `lib/db/schema.ts` change. A migration that adds starting rows is run on the Preview database before that change is deployed, as with `0003`, because the Preview build only pushes the schema.

### Pricing rules, T-47

Two new tables:

| Table | Columns |
|---|---|
| `pricing_rules` | `id` serial, `guide_per_day`, `breakfast_per_person`, `child_fare_percent`, `lap_infant_fare`, `seat_infant_fare`, `people_per_room`. All integers. One row. |
| `meal_rates` | `id` serial, `grade` text unique, `dinner` integer, `lunch` integer. One row each for Deluxe, Executive, Luxury, and Ultra Luxury. |

- The migration, `drizzle/0004_pricing_rules.sql`, creates both tables and inserts the starting values in BR-87, only when a table is empty.
- `RateCatalog` in `lib/quote.ts` gains `rules` and `meals`, loaded with the other rates in `lib/rates.ts`. Remove the constants `GUIDE_PER_DAY`, `BREAKFAST_PER_PERSON`, `LAP_INFANT_TICKET`, `SEAT_INFANT_TICKET`, `MEAL_PER_NIGHT`, the fixed 75 percent, and the fixed 3 people per room. The math in section 5 stays in `buildQuote`.
- `QuoteInput` gains `lunch`. Its line is labelled Lunch, and the Meals line is labelled Dinner. `POST /api/quote` accepts `lunch` only from an Owner or a Manager, the same way it accepts night edits. A saved quote keeps it in a new `quotes.lunch` column, default false, in the same migration.
- The Pricing rules tab is `/office/rates/rules`, next to Profit margin. It saves through `POST /api/office/rates` with new kinds, such as `pricing_rule` and `meal_rate`, checked in `lib/office/rates.ts`. Each save writes one activity row in area `rates`.
- Add `pricing_rules` and `meal_rates` to `BACKUP_TABLES` before `activity`.

### Places and start cities, T-48

One new table:

| Table | Columns |
|---|---|
| `start_cities` | `id` serial, `name` text unique, `road` boolean, `air` boolean, `air_extra` integer, `long_route_after_days` integer or null, `long_route_per_vehicle_day` integer default 0, `sort_order` integer. |

- The migration, `drizzle/0005_start_cities.sql`, creates the table and inserts Islamabad, Lahore, and Karachi as in BR-91. The Lahore and Karachi air extras are copied from `air_extras.lahore_add` and `air_extras.karachi_add`. Those two columns stay in the table, because the migration is additive, and nothing reads them after this change. The Air extras tab stops showing them.
- `buildQuote` reads the adult fare as the Islamabad ticket plus the start city's air extra, and the long-route extra from the start city. Remove `LAHORE_ROAD_PER_DAY` and the fixed Karachi and Lahore checks. A road quote from a start city with `road` false is refused, which keeps the Karachi rule.
- Road rate rows keep the start city as text, as today. Air rate rows keep `Air`. Renaming a start city updates `start_city` on its hotel and vehicle rate rows in the same transaction.
- The Hotels tab and the Vehicles tab each get an Add rate drawer. A new place name in that drawer adds the place. Renaming a place updates `place` on its hotel rates, vehicle rates, and jeep lines in one transaction. The public `places` table is not touched.
- The place list for a quote comes from one `lib/` function: places with an offered hotel rate and a live vehicle rate for the mode and start city. The office Quote screen uses it. The guest builder keeps `data/calculator-options.ts` for now. The start city list is the start cities with `road` or `air` true for the chosen mode.
- The Start cities tab is `/office/rates/start-cities`. Saves go through `POST /api/office/rates` with kinds such as `start_city`, `hotel_rate_add`, `vehicle_rate_add`, and `place_rename`. Each save writes one activity row in area `rates`.
- Add `start_cities` to `BACKUP_TABLES` before `activity`.

### Quote screen v2, T-49

- `QuoteLine` gains `working`, a short text built in `buildQuote` from the same numbers as the amount, as in BR-93. The guest response still leaves out the lines.
- `QuoteInput` gains `tickets`, default true. With `tickets` false on an air quote, the ticket line is left out. `POST /api/quote` accepts `tickets` and `vehicleCount` only from an Owner or a Manager. A guest's room count stays as today.
- A saved quote keeps the typed room count, the typed vehicle count, and `tickets`, in new nullable columns on `quotes`, in `drizzle/0006_quote_counts.sql`.
- The screen sections are Route (place, travel by, start city, days), Party (adults, children, lap infants, infants with a seat, rooms, vehicles), and Stay and services (grade, Air tickets on air only, Tour guide, Dinner, Lunch). The night and day edits, the paid extra, and Other follow in one section. Rooms and vehicles show the automatic count with an Auto tag. Typing a number changes the tag to Typed. Back to auto counts clears both.
- The breakdown lists every line with its working and amount, then the subtotal, the profit, and the guest total.

## 13. Progress feedback, T-50

Requirements section 8c. No route, table, or role changes, so the route list in requirements section 13 stays the same. Read the Next 16 guides in `node_modules/next/dist/docs/` for `loading.js`, `Link`, and `useLinkStatus` before building this.

- **Page moves.** One client component, `components/ui/NavigationProgress.tsx`, placed once in `app/layout.tsx`, so the public site and the office share it. It starts when a same-site link is followed or the code calls `router.push`, and it ends when the path or the search changes. Build the start on the Next 16 `Link` and router hooks, not on a timer alone. It waits 150 milliseconds before it shows. It is hidden from screen readers, and the page announces "Loading page" once through a polite live region.
- **Office loading.** While a move to another office page takes longer than 150 milliseconds, `OfficeFrame` shows placeholder blocks, `components/office/OfficePlaceholder.tsx`, in place of the page, so the side menu and the top bar stay. A link that only changes `?edit=` keeps the page. Do not add a `loading.tsx` under `app/office/`: a loading boundary makes the office pages stream, so a role redirect and a not-found page answer 200 instead of a redirect or a 404, which breaks `scripts/check-step3.ts` and changes a server rule. This was found in the T-50 pull request. A move that is cancelled, such as a Cancel on the unsaved-changes question, stops the bar and the placeholder at once. The placeholder style goes in `components/office/meadow.css` with the Meadow tokens. The public site gets no placeholder pages, only the bar.
- **Uploads.** Built on the direct upload in section 14, T-51. The `upload()` call from `@vercel/blob/client` reports progress with `onUploadProgress` and stops with `abortSignal`. One `UploadProgress` component in `components/office/content/` shows the bar, the amounts, and Cancel. Every form with an upload in the section 7c table uses it. Cancel stops the upload before the save is sent, so the site stores nothing and writes no activity row.
- **Busy state.** `postOfficeForm` takes a short label, such as "Saving photo", and reports the start and the end to one shared busy store that the office top bar reads. The top bar shows the newest label with "…" while it works, then the saved message or the error for 4 seconds, in a polite live region. Every office action button passes `busy`, including the rate tables, the profit margin, the air extras, the quote screen, request moves, users, backups, and delete cards.
- **No full reload.** After a save, replace `window.location.reload()` with `router.refresh()`, and `window.location.assign()` with `router.push()`, from `next/navigation`. This covers `officeFormAction` and the photo, review, and slide forms. The saved message from `rememberSaved` shows the same way as today.
- **Reduced motion.** Under `prefers-reduced-motion: reduce`, the bar fills without moving, the spinner stands still, and the placeholder blocks do not shimmer.
- **Tests.** T-50 changes no server rule, so it adds no `scripts/check-step3.ts` case, and `npm run check:step3` still passes. The pull request lists the browser checks in BR-95 to BR-100, done in Chrome with the network set to Slow 4G.

## 14. Large uploads, T-51

Requirements section 8d. Vercel refuses a request body over 4.5 MB before the site runs, so a file cannot pass through an office save. The browser uploads it to the media store with the client upload in `@vercel/blob`, and the save sends only the stored URL. Read the `@vercel/blob` client upload guide and `node_modules/@vercel/blob/dist/client.d.ts` before building this.

- **Token route.** `app/api/office/uploads/route.ts` calls `handleUpload` from `@vercel/blob/client` with `MEDIA_READ_WRITE_TOKEN`. The role check and the rules are in one `lib/office/media.ts` function. In `onBeforeGenerateToken`, refuse a person who is not an Owner or an Editor. The client payload names the kind, `image` or `pdf`. An image gets `allowedContentTypes` JPEG, PNG, and WebP, and `maximumSizeInBytes` 5 MB. A PDF gets `application/pdf` and 10 MB. The path must be `media/upload.` plus `jpg`, `png`, `webp`, or `pdf`, with `addRandomSuffix` on, so the stored name has no folder and cannot be chosen. `validUntil` is 10 minutes. Do not use `onUploadCompleted`. It needs a public callback URL, which a local run does not have, and the save does the check instead.
- **Screens.** On Save, the form first uploads each chosen file with `upload()` from `@vercel/blob/client`, with `handleUploadUrl` set to `apiPath("/api/office/uploads")` and `access: "public"`. It then posts the save with each returned URL in the field the server reads, such as `photoUploaded`, and without the file. A file is uploaded only when Save is pressed, not when it is chosen. If an upload fails, the save is not sent and the form keeps what was typed. One helper in `components/office/content/` does this for every form in the section 7c table.
- **Save check.** One `lib/office/media.ts` function, such as `checkUploadedFile(url, kind)`, runs in each save before the record changes. The URL must pass `officeMediaPath`. `head` from `@vercel/blob`, with this environment's token, must find it, which proves it is in this store, and its size must be under the limit. Read its first 16 bytes with a `Range` request and use the same `imageKind` and `isPdf` checks as today. A file that fails is deleted with `del`, and the save is refused with the same messages as today, such as "Use a JPEG, PNG, or WebP file." A file that passes joins the save's stored list, so a refused save deletes it, as T-40 does.
- **The old file field.** The saves still accept a file in the form, as today, so a small file and the `check-step3` cases still work. The office screens stop sending files that way.
- **Local runs.** The upload goes to the store named by `MEDIA_READ_WRITE_TOKEN` in `.env`. Nothing waits for a callback. From T-56, it is the local stand-in in section 14a, never a Vercel store.
- **Tests.** In `scripts/check-step3.ts`: the token route refuses no session with 401 and a Manager with 403, and gives an Editor a token. It refuses a path with a folder, a kind that is not `image` or `pdf`, and an SVG type. A save naming a URL that is not in this store, or not under `media/`, is refused and the record does not change. A file uploaded as `image/jpeg` whose bytes are not an image is refused and deleted. A 4.8 MB JPEG and a 9 MB PDF save through the direct upload, and both files are deleted at the end of the check. From T-56, they run against the local stand-in in section 14a. The pull request lists a 4.8 MB photo and a 9 MB tour PDF saved on the preview site.

## 14a. Local media stand-in, T-56

On 5 November 2026 Vercel suspended all four TWM Blob stores, the preview and production media and backup stores, for going over the Hobby plan limits. Hobby limits count for the whole Vercel account, so a new store on the TWM account would stop with the others. Local runs and `check-step3` used the preview media store, and each run since T-51 uploaded a 4.8 MB and a 9 MB file and made many writes and deletes. Testing uses only TWM resources or the developer's own machine, so local runs and `check-step3` use a local stand-in for the Blob service and never a Vercel store.

- **The stand-in.** `scripts/blob-stand-in.ts`, started with `npm run blob:local`, is a small `node:http` server on `http://localhost:3100`, with no new package. It keeps files in `.local-blob/`, which is in `.gitignore`. It answers the requests `@vercel/blob` 2.8.1 makes for what the site uses: `put`, `head`, `del`, `list`, and the browser `upload()` with a client token. It serves each stored file at its URL, `http://localhost:3100/<pathname>`, with `Range` support. Read `node_modules/@vercel/blob/dist` for the request and reply shapes, and match them.
- **Same refusals as Vercel.** For a client token upload, the stand-in reads the token's payload and refuses a file that breaks its `allowedContentTypes`, `maximumSizeInBytes`, `validUntil`, or pathname, and adds the random suffix when `addRandomSuffix` is on, as `upload-<suffix>.<ext>`. It checks the token's signature with the local read-write token.
- **Pointing the site at it.** `@vercel/blob` sends its requests to `VERCEL_BLOB_API_URL`, and in the browser to `NEXT_PUBLIC_VERCEL_BLOB_API_URL`, when they are set. Locally both are `http://localhost:3100`, and `MEDIA_READ_WRITE_TOKEN` is the made-up token `vercel_blob_rw_localtest_notasecret`. `BLOB_READ_WRITE_TOKEN` stays empty locally. None of these is set on Vercel.
- **Local file addresses.** `checkUploadedFile` requires `https://` today. It also accepts the stand-in's origin, but only when `VERCEL_BLOB_API_URL` is set and its host is `localhost` or `127.0.0.1`. Everything else in the check, the upload name, the 15 minutes, `head`, the size, and the first 16 bytes, is the same.
- **Extension matches the kind.** Found in the T-51 review: an upload made under a PDF permission, `upload-<suffix>.pdf` stored as `application/pdf`, whose bytes are a JPEG, passed the check as a gallery photo, and an image-named upload with PDF bytes passed as a tour PDF. `checkUploadedFile` also requires the extension to fit the kind, `jpg`, `png`, or `webp` for an image and `pdf` for a PDF. A fresh upload that fails is the uploader's own, so it is refused and deleted like any other failed fresh upload.
- **The guard.** `scripts/check-step3.ts` stops before its first request unless `VERCEL_BLOB_API_URL` is a `localhost` or `127.0.0.1` address and the store id in `MEDIA_READ_WRITE_TOKEN`, its fourth part split on `_`, is `localtest`. A non-empty `BLOB_READ_WRITE_TOKEN` also stops it. The message is "check-step3 runs only against the local media stand-in. See design section 14a." Print the store id, never the token. The large cases cost nothing locally, so the 4.8 MB JPEG and the 9 MB PDF cases run on every check.
- **Clean up.** Every file the check uploads is deleted in a `finally`, so a failed run leaves nothing in `.local-blob/`.
- **`.env.example`.** It gives the local values above, with a comment that a Vercel token never goes in a local `.env`.
- **What only the preview site can show.** Vercel's 4.5 MB request limit, and the real store. The 4.8 MB photo and 9 MB PDF check on the preview site stays, once the TWM stores are back.

## 14b. Fewer Blob operations, T-57

The TWM team moved to the Vercel Pro plan on 13 November 2026 after the Hobby limits stopped the Blob stores on 5 November. Each Blob operation now counts against the plan, so the site does not repeat one it does not need.

- **Backup list.** The office dashboard shows the last backup to the Owner, and the Backups page lists them. Both read the list through one cached function in `lib/office/backup.ts`, made with `unstable_cache`, tag `office-backups`, kept for 6 hours. The backups change only when `runBackup` saves one, from Back up now or the nightly run, so `runBackup` clears the tag with `revalidateTag("office-backups", { expire: 0 })` and the next visit lists the store again.
- **What is cached.** `unstable_cache` stores JSON, so a `Date` comes back as text. The cached function returns each backup as its name, size, and `uploadedAt` as an ISO string, already sorted newest first.
- **Role checks.** The cache holds only the file list. The Owner check in `listBackupsAs` runs on every request, outside the cache.
- **Downloads.** `readBackupAs` still reads the chosen file each time. A download is rare and is not cached.
- **Testing.** Local runs use the stand-in in section 14a, never a Vercel store. To see the backup list locally, set `BLOB_READ_WRITE_TOKEN` to the stand-in token for that check only, and leave it empty for `check-step3`, whose guard refuses it.
