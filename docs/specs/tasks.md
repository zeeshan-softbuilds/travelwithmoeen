# Tasks

**Spec:** TWM-SPEC-TASKS  
**Requirements:** `docs/specs/requirements.md`  
**Design:** `docs/specs/design.md`  
**Proposal:** TWM-SOW-001, version 1.3  
**Also read:** `docs/rules/project-structure.md` and `docs/rules/coding-standards.md`  

The plan is four sprints of two weeks, plus the Meadow office before Phase 2. Sprints 1 and 2 are the baseline. Those tasks are built. Office media, T-29 through T-35, is built. The Meadow file, T-36, is on `main`. T-36a updated that prototype for Moeen's sign-off and is accepted. The next build sprint is T-37: share that file with Moeen, then build that look into `/office`. Sprint 3 is Phase 2. Sprint 4 is Phase 3. T-37 is accepted before Phase 2 starts. Phase 2 is accepted before Phase 3 starts. Read the requirements and the design before a new task. The quote math is in design section 5. Do not invent a second formula.

T-01 through T-36, and T-36a, are accepted. Do not reopen them. Do not start Phase 2 or Phase 3 until T-37 is accepted. The four security tests in section 12 run again before T-37 is accepted. Follow `docs/rules/project-structure.md` and `docs/rules/coding-standards.md` on every change. Step 1 office saves, and every later save, go through `app/api` and `lib/`. Do not add a server action for a new save. Security checks close in the step named in `docs/specs/requirements.md` section 11. The four security tests in section 12 run at the end of Step 2, Step 3, T-25, T-35, and T-37. Do not move a check into the next step. T-36a does not repeat the four security tests.

## Step 1. Office can edit public pages

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-01 | Add PostgreSQL and the content tables: user, tour, tour day, place, post, photo, review, slide, site settings. | BR-09, BR-10 | A local database starts, and the tables exist. |
| T-02 | Add email and password login at `/office/login`, with a hashed password and a session. | BR-08 | A wrong password is refused. A right password opens `/office`. |
| T-03 | Add Owner, Manager, and Editor. Enforce each action on the server. | BR-01 to BR-07 | An Editor save of a price is refused. A Manager save of a tour title is refused. |
| T-04 | Owner screen to create a login, remove a login, and change a role. A seed script creates the first Owner. | BR-02 | The Owner can create one Editor and one Manager. The seed password is not in the repo. |
| T-05 | Copy tours, days, places, posts, gallery, reviews, home slides, and site details into the database from the files named in design section 1. Leave those files in the repo. | BR-09, BR-10 | The row counts match those files. Phone, email, address, and social links match the navbar and footer. |
| T-06 | Point the public content pages at the database. Do not change the page layout. Leave about, FAQ, and the legal pages as they are. | BR-09, BR-10, BR-58 | Home, tours, a tour page, places, blog, and gallery render the loaded content. About, FAQ, and the legal pages still render as they do today. |
| T-07 | Editor screens for tours, days, places, blog, gallery, reviews, home slides, and site details. Include the featured flag. | BR-05 | An Editor changes a tour title and a photo, and the public tour page shows both. |
| T-08 | Step 1 check with the three roles. | BR-01 to BR-10 | The Step 1 checks in the requirements file all pass. Prices on the site may still be today's prices. |

## Step 2. Prices and quotes

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-09 | Add hotel rate, vehicle rate, air extra, jeep line, and season tables. | Storage for BR-17 to BR-27 | The tables match the design file. The price rules are proved in T-12 and T-15. |
| T-10 | Write the Excel import, including blank-name rows, zero rows, the Executive air row, Swat rates for Taobat, Naran left as stored for now, and Prado for Parado. Read cell values only. | BR-17, BR-28, BR-29, BR-51 to BR-54, BR-63 | The import report lists only rows that still have no place. The live Taobat deluxe twin is not 6,000. The import does not write under `public/` and does not run a macro. |
| T-11 | Mark tour 201, Ratti Gali, as the website price. Do not create a Taobat tour page. | BR-28, BR-30 | The public Ratti Gali card still shows the price already on the site. |
| T-12 | Build the one quote function in design section 5, with no night or day edits. Delete the old extra amounts in `lib/calculatePackagePrice.ts` from the live path. | BR-26, BR-31 to BR-43 | The Skardu test quote is 140,400 at 20 percent, from a subtotal of 117,000. Switching to 15 percent changes only the profit. A jeep amount is not multiplied by the number of days again. |
| T-13 | Add night lines and day lines, office edits, and the average nightly rate. | BR-45 to BR-49 | Changing night two changes only that night and the average. Clearing one day removes that day's rent. |
| T-14 | Point `components/home/PackageCalculator.tsx`, `app/calculator/page.tsx`, `components/TourCard.tsx`, `app/tours/[id]/page.tsx`, and `app/tours/[id]/template/page.tsx` at the same function. Couple cards use the Deluxe couple-price rule in design section 5. Hide Karachi as a road start. Do not send night or day edits from the guest builder. | BR-11, BR-19, BR-20, BR-50 | A guest quote matches the office starting quote for the same inputs. Ratti Gali still shows 150,000. |
| T-15 | Manager screens for rates, the season switch, vehicle on or off, Other, paid extras, and jeep lines. Reject blank, negative, and non-numeric amounts. | BR-04, BR-22 to BR-27, BR-70 | Premier is not in the guest grade list. A jeep line can be turned off. A negative rate is refused. |
| T-16 | Offer only Deluxe, Executive, Luxury, and Ultra Luxury on the tour page, the tour template page, and the builder. | BR-18 | Premier cannot be booked. `app/tours/[id]/template/page.tsx` no longer lists Premier. |
| T-17 | Step 2 check, including Karachi air 30,000, no Karachi road start, Taobat, Naran, and Ratti Gali. | BR-19 to BR-21, BR-28 to BR-30, BR-44, BR-59, BR-68 | The Step 2 checks in the requirements file all pass, including T-26 and T-27. |
| T-26 | Harden office uploads. Step 1 saves a photo and does not check it. This task is part of Step 2. Do it with T-09 through T-17. Do not leave it for Step 3. | BR-59 | A text file renamed to `.jpg` is refused. A file over 5 MB is refused. A real JPEG, PNG, or WebP at or under 5 MB still saves. SVG is refused. |
| T-27 | Harden login and session. Keep the Step 1 cookie rules in BR-67. Add the failure count and the 401 and 403 codes. This task is part of Step 2. Do not leave it for Step 3. | BR-60, BR-67, BR-68 | The 11th failed sign-in for one email inside 15 minutes is refused. The error text is the same for an unknown email and a wrong password. The log has no password. Logout clears the cookie. A wrong role returns 403. A missing session returns 401. |
| T-28 | Run the four security tests in requirements section 12, including the route list in section 13. This task is part of Step 2. Run the same four again before Step 3 is accepted, and again before T-25 is accepted. Each run keeps the older script cases and adds the new ones. | BR-71 to BR-74 | `npm run lint` passes, including no `eval` and no raw HTML insert. `npm run check:sca` passes. The ZAP baseline reports no High alert and reached `/office/login`. The Step 2 script, against the running site, proves 401, 403, the bad upload, and the login lock. |

## Step 3. Guest requests

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-18 | Add the guest request table and statuses. | BR-12 to BR-14 | A request can be saved and read back. |
| T-19 | Save the contact form and the custom trip form. Stop losing the contact message. Apply the length limits in BR-64. | BR-12, BR-14, BR-64 | A test contact stays in the office list. A message longer than 4,000 characters is refused. |
| T-20 | Save Book Now and still open `https://wa.me/923339981177`. | BR-13 | A test booking is in the list, and that WhatsApp link opens. The placeholder `tel:+1234567890` is not used. |
| T-21 | Office request list. The Editor can read and cannot delete or change status. The Manager can update status. The Owner can update status and can delete. | BR-03, BR-05, BR-15 | Those checks pass on one test item. |
| T-22 | Confirm guest details are not rendered on any public page. | BR-15, BR-64 | A public page response does not include the test phone number. The stored message is text, not HTML. |

## Close of the first delivery

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-23 | Daily database backup, and a written note of how a restore is run. | BR-55, BR-65 | One backup file exists, and a restore was tried on a copy. The backup is not in git and not under `public/`. |
| T-24 | Check office and public screens on current Chrome, Edge, Firefox, and Safari, on a computer and on a phone. | BR-57 | The Step 1, 2, and 3 paths work on those browsers. |
| T-25 | Short office guide in plain US English, and the three training sessions: Owner, Manager, and Editor. | BR-16, BR-56 | The guide matches the screens, including one night and one day on a quote. Office screens are in US English. |

## Next sprint. Office media and the design prototype

Do this before Phase 2. Office media is design section 7c and BR-75 to BR-80. T-36 is already accepted.

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-29 | Store an office upload in Vercel Blob with `put`, `access: "public"`, under `media/` plus one file name. Save the returned public URL. Use `MEDIA_READ_WRITE_TOKEN` for this environment. Do not use `BLOB_READ_WRITE_TOKEN`, `backups/`, or `access: "private"`. Use the existing office save routes. `del` removes an office file on replace or remove. A path under `/images/` or `/pdfs/` is not deleted. | BR-59, BR-65, BR-75, BR-79, BR-80 | A file uploaded on the preview site is still on the public page after a new deployment. Replacing it removes the previous office file. A media URL cannot read a backup. A missing token fails the save. |
| T-30 | Upload and remove one tour extra photo. Upload a tour PDF of at most 10 MB. | BR-76, BR-77, BR-78, BR-79 | An Editor adds one extra photo from a file, removes that photo, and the tour stays. That photo's office file is deleted. A PDF opens on the tour page. A renamed text file is refused. A PDF over 10 MB is refused. |
| T-31 | Upload a place banner and a section photo. Remove a section. | BR-77, BR-78, BR-79 | The place page shows the uploaded banner. Removing a section removes that section and its office file. The place stays. |
| T-32 | Upload a blog cover and a section photo. Add a section and remove a section. | BR-77, BR-78, BR-79 | The post page shows the uploaded cover. A new section can be added and then removed, and its office file is deleted. The post stays. |
| T-33 | Upload a review avatar. Clear the avatar without deleting the review. | BR-77, BR-78, BR-79 | The review stays after the avatar is cleared, and that office file is deleted. Remove review still deletes the whole review. |
| T-34 | When a gallery photo, a home slide, a tour main photo, or a whole tour is replaced or removed, delete the office files. | BR-79 | The old office file is gone. Deleting a tour also deletes its office extra photos and office PDF. A photo that still uses `/images/` still loads. |
| T-35 | Add these cases to the step script that already runs Step 3, and run the four security tests again. Update `docs/office-guide.md` so it matches the new controls. A new route is added to requirements section 13 in the same change. | BR-75, BR-62, BR-71 to BR-74 | The script still runs the Step 1, 2, and 3 cases. It refuses a Manager upload, accepts an Editor JPEG, refuses a non-PDF in the PDF field, and shows the file on the public page. `npm run lint`, `npm run check:sca`, and the ZAP baseline pass. |
| T-36 | Meadow design prototype. Accepted on `main` in pull request 11. | BR-81 | Done. `docs/office-design/meadow.html` is on `main`. The Owner, Manager, and Editor links match BR-01 to BR-07. The Quote tab has the night edit and the day edit. The zip matches that folder in git. No file under `app/`, `components/`, or `lib/` changed. This task does not repeat the four security tests. |
| T-36a | Accepted on `main` in pull request 15. Update the Meadow prototype for Moeen's sign-off. Prototype only. Do not change `app/`, `components/`, `lib/`, or `drizzle/`, and do not change the database. Do not deploy. | BR-81, BR-03, BR-04, BR-06, BR-11, BR-22, BR-31, BR-32, BR-35, BR-38, BR-41, BR-42, BR-43, BR-44, BR-83 | The Skardu test is still 140,400 at a profit margin of 20 percent. No hotel and Hotel only each show one guest total. A package with neither a hotel nor other services is refused. Same hotel all nights and Change per night switch in one click. An Editor can delete a tour and a Manager cannot. Tour and place links show on both screens. Profit margin is a whole percent from 0 to 100. The Season by month table stays. The layout fits a phone. The zip matches the folder. The new defaults are marked pending Moeen sign-off. No file outside the allowed list changes. |

## Next sprint. Meadow office for Moeen

Promised to Moeen. Do this before Phase 2. The clickable file is T-36. This task builds that look into the live office. Design section 11 says how.

Moeen has the prototype at `https://new.travelwithmoeen.com/meadow`. On 20 October 2026 he was asked for a final go-ahead on the points in the sign-off table below. T-37 is split so the look can be built while he answers. A task marked **Now** starts now. A task marked **After sign-off** starts only when every sign-off row it names is Approved or Changed.

### Moeen sign-off

This table is the record of what Moeen decided. The numbers match the WhatsApp message of 20 October 2026, so his reply maps to a row. When he answers, update the row first. If he asks for a change, write the change in the Decision column, and change the requirement and design text in the same pull request. A task reads its rule from the requirement, not from chat.

| Row | Point | Status | Decision | Gates |
|---|---|---|---|---|
| S-1 | Overall look and screens: Dashboard, Requests, Rates and quotes, Tours, Places, Users, Backups | Asked | | T-37j |
| S-2 | Profit margin starts at 20 percent and is any whole percent from 0 to 100 | Asked | | T-37f starting value only |
| S-3 | Hotel choice on a quote: With hotel (default), No hotel, Hotel only | Asked | | T-37h |
| S-4 | With hotel: Same hotel all nights is the default, and Change per night is one click | Asked | | T-37h |
| S-5 | No hotel keeps the other services, with no hotel, rooms, meals, or breakfast | Asked | | T-37h |
| S-6 | Hotel only asks for the city and nights, with no vehicle, guide, tickets, or extras | Asked | | T-37h |
| S-7 | A package with neither a hotel nor other services is refused | Asked | | T-37h |
| S-8 | Guests on the website get the same three choices and see one total. Staff see the lines and the profit | Asked | | T-37h |
| S-9 | One example trip where the dashboard does not match the costing file | Asked 14 October 2026 | | Not T-37. The dashboard note stays a placeholder. |

Status is Asked, Approved, or Changed. A look change Moeen asks for on one screen goes into that screen's task. A change to a price rule goes into the requirement first.

### T-37 tasks

Build in the order of the table, except T-37k, which comes after T-37b and T-37c. One pull request per task, into the fork `main`. Each pull request names its task, such as T-37a. The public site look does not change in any of them, except that T-37h adds the three hotel choices to the guest package builder, which is BR-50. A task that changes behavior, T-37f, T-37h, and T-37k, adds its cases to `scripts/check-step3.ts` in its own pull request, as the coding standards ask. `npm run check:step3` passes at the end of each one.

| ID | Gate | Task | Covers | Done when |
|---|---|---|---|---|
| T-37a | Now | Meadow tokens and the office shell. Port the colors, spacing, type, radius, and focus tokens from `docs/office-design/src/base.css` and `meadow.css` into an office-only stylesheet. Rebuild `OfficeShell` as the prototype sidebar, top bar, and phone menu. Restyle `/office/login`. | BR-82, BR-08, BR-16 | Every office page renders inside the new shell. The sidebar groups and links match the prototype `NAV` for each role. A link a role cannot use is not shown. The login page matches the prototype login. A public page still renders the same as before. The layout fits a phone. |
| T-37b | Now | Dashboard and Requests. The dashboard shows what the database already holds: new requests, the active profit margin, and the last backup. Requests gets the prototype list, filters, and detail view. | BR-82, BR-03, BR-05, BR-15 | The request status rules still hold: Editor reads only, Manager and Owner change status, Owner deletes. The dashboard note about the costing file stays a placeholder (S-9). The activity feed comes in T-37k. |
| T-37c | Now | Content screens: Tours, Places, Blog, Gallery, Reviews, Home slides, and Site details. Use the prototype list, form, and preview frame. Keep every upload and remove control from T-29 to T-35, and the tour and place links from T-38. | BR-82, BR-05, BR-75 to BR-80, BR-83 | An Editor still uploads and removes each file type. A Manager is still refused. Add, amend, and delete a tour still work. The links show on both the tour and the place. |
| T-37d | Now | Users and Backups. | BR-82, BR-02 | Only the Owner sees and uses both. The last Owner still cannot be removed. Back up now and Download still work. |
| T-37e | Now | Rates screens: hotels, vehicles, jeep lines, and air extras, in the prototype layout. | BR-82, BR-04, BR-70 | A Manager saves a rate. An Editor cannot open the screen and the server refuses the save. A blank, negative, or non-numeric amount is refused. |
| T-37f | Now | Profit margin. Replace the 15 or 20 season choice with one whole percent from 0 to 100, with a slider, on the Rates screen and the Quote screen. Moeen asked for this on 14 October 2026 and was told it is in the current work. | BR-22, BR-43, BR-44, BR-70 | 16 and 30 percent can be saved. 101, -1, and 12.5 are refused. The Skardu test is still 140,400 at 20 percent. Changing the margin changes only the profit. The starting value is 20 percent until S-2 is answered. |
| T-37g | Now | Quote screen look, with the night and day edits that already exist. | BR-82, BR-45 to BR-49 | A night-two edit still changes only that night and the average. Clearing one day still removes that day's rent. The guest still sees one total. |
| T-37h | After sign-off: S-3 to S-8 | Hotel choices. Add With hotel, No hotel, and Hotel only to `lib/quote.ts`, the office Quote screen, `POST /api/quote`, and the guest package builder. Add Same hotel all nights and Change per night under With hotel. | BR-31, BR-32, BR-38, BR-39, BR-41, BR-42, BR-50, design section 5 | Each mode has one guest total. A package with neither a hotel nor other services is refused with 400. The Skardu test is still 140,400 with With hotel. The guest builder shows the three choices and one total. A guest response has no lines and no profit. |
| T-37i | Now, last | Close T-37. Run the full `scripts/check-step3.ts` with the cases T-37f, T-37h, and T-37k added. Update `docs/office-guide.md` to the new screens. Run the browser check in BR-57 on the office. When S-1 is Approved, remove `GET /meadow` and its row in requirements section 13. | BR-71 to BR-74, BR-56, BR-57 | The four security tests pass. The office guide matches the screens. The script proves the new margin, hotel-choice, and activity cases, including that a Manager cannot read content activity. `/meadow` is gone after S-1 is Approved. |
| T-37j | After sign-off: S-1 | Look changes Moeen asks for in S-1, on the screens they name. | BR-82 | Each change in the S-1 Decision column is on the live screen. |
| T-37k | Now, after T-37b and T-37c | Activity record and "saved by". Add the `activity` table in design section 11. Each office save writes one row in the same `lib/` function that saves. Add `GET /api/office/activity`. Show the feed on the dashboard, and "Saved by" with the time on each content and rate screen. | BR-86, BR-60, BR-61 | An Editor saves a tour, and the dashboard and the tour screen show who saved it and when. A Manager sees rate and request rows and does not see content rows. An Editor does not see rate rows. A failed save writes no row. No row holds a password, a token, a secret, or a guest phone or message. |

T-37 is accepted when T-37a to T-37k are done, and rows S-1 to S-8 are Approved or Changed. S-9 does not hold up T-37.

## Not in T-37

- The hotel catalog: city, then hotel, then room, then occupancy, with its own rates. The prototype shows it with sample hotels. It needs a new table and real hotel data, and Moeen was told on 14 October 2026 that it is an enhancement after this phase. Until it is built, a hotel night uses the grade rate from the loaded rate table, which is BR-84. It is task T-39 below.
- Trip plans and the Season by month table. Those are Phase 2 and Phase 3.
- The prototype role switch and the design system page. They stay in the prototype only.
- A new place or blog post. A new tour is T-38.
- Delete a price row. That remains BR-03.
- Phase 2 or Phase 3.

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-39 | Hotel catalog. Not started. Plan it with Moeen after T-37 is accepted. It needs the list of hotels, rooms, and rates from the TWM team. | BR-35 | To be written when it is planned. |

## Tours and places, 14 October 2026

Asked for on the live office, not on the Meadow prototype. This does not rebuild the office look.

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-38 | From `/office/tours`, the Owner and the Editor can add a tour, amend a tour, and delete a tour. A Manager cannot. A tour links to its place or places. The office and the public site show the link on both the tour and the place. | BR-83, BR-03, BR-05, BR-06 | An Editor adds a tour and deletes it. A Manager cannot add, amend, or delete a tour. A renamed place title shows on the linked tour. A renamed tour shows on the place. The place guide is not replaced by the tour. `npm run check:step3` still passes. |

## Found in the T-37c review, 22 October 2026

Not part of the office look. Do it after T-37c is merged, in its own pull request. It does not wait for Moeen.

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-40 | A refused content save deletes the files it stored. Today `lib/office/forms.ts` stores an uploaded photo or PDF first, and the save in `lib/office/content-writes.ts` checks the input afterwards. When that check refuses the save, the new file stays in the media store with nothing pointing at it. Delete every file the refused save stored, in the same `lib/` function. Cover every content save that takes a file: tour add and amend, place, post, gallery photo, home slide, and review. Add the case to `scripts/check-step3.ts`. | BR-79, BR-62 | Adding a tour with no location and a new photo is refused, and that photo is not in the media store afterwards. A save that is accepted still keeps its file. The other office media cases in `check-step3.ts` still pass. |

Sprint 3, Phase 2. Starts after T-37 is accepted.

- Hours on each stop
- Comfort, Luxury, Adventure, Exploration
- Kashmir, Swat, and Chitral jeep products

Sprint 4, Phase 3:

- Season plans by month. Blossom in April. Summer from May through September. Autumn from 10 October through 30 November. Winter from 1 December through 30 March.
- Fuel by kilometers. Gli at 1 liter per 14 km. Prado at 1 liter per 5 km. One petrol rate and one diesel rate.
- Guide price by area
- Entry tickets by stop
- Quote tracking codes
- A no-price copy for the driver and field team. That copy has no rupee amounts (BR-66).
- PDF or image download of a guest quote. The guest file has one total, not the staff lines and not the profit (BR-66).
- Excel download of live prices. Only the Owner and the Manager can download it (BR-66).
- A sticker counted by vehicles, replacing the room count from the baseline

Card payment, a guest login, and a new public look stay out of the baseline, office media, Phase 2, and Phase 3.
