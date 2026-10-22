# Requirements

**Spec:** TWM-SPEC-REQ  
**Proposal:** TWM-SOW-001, version 1.3, September 29, 2026  
**Status:** Baseline and office media are built. The next sprint is the Meadow office, promised to Moeen. Phase 2 starts after that. Phase 3 starts after Phase 2.

This file says what the first delivery must do, and what is planned after it. What is already in the code is listed in `docs/audit/after-step03.md`.

**Also read:** `docs/specs/design.md`, `docs/specs/tasks.md`, `docs/rules/project-structure.md`, and `docs/rules/coding-standards.md`

The public website stays. The office gets a private area on that same site. Guests do not log in.

## 1. Roles

| ID | Requirement |
|---|---|
| BR-01 | There are three roles: Owner, Manager, and Editor. Each login has one role. |
| BR-02 | Only the Owner can create a login, remove a login, or change a role. A seed script may create the first Owner on a development machine. That password is not stored in the repo. |
| BR-03 | Only the Owner can delete a price row or a guest request. The Owner and the Editor can delete a tour. A Manager cannot. |
| BR-04 | The Owner and the Manager can edit hotel rates, vehicle rates, air extras, and jeep lines. They can turn a vehicle on or off for a route, add an Other vehicle, add a paid extra, and set the profit margin to any whole percent from 0 to 100. |
| BR-05 | The Owner and the Editor can edit tours, day plans, places, blog posts, the gallery, reviews, home slides, and the phone, address, and social links. They can mark a tour as featured. The Editor can read guest requests. The Owner and the Manager can update a guest request status. The Editor cannot. |
| BR-06 | The Editor cannot change any rupee amount and cannot delete a guest request. The Editor can delete a tour. |
| BR-07 | The Manager cannot edit public page text and cannot create logins. |
| BR-08 | A person who is not logged in cannot open the office area. |

## 2. Public site

| ID | Requirement |
|---|---|
| BR-09 | The public pages keep the same job they have today: home, tours, tour page, places, blog, gallery, package price, custom trip, contact, and Book Now. |
| BR-10 | The pages in BR-09 read from the office system, not from the fixed files in `data/`. About, FAQ, and the legal pages in BR-58 stay on their current pages. |
| BR-11 | A tour card shows the Deluxe couple price: 2 adults, 1 twin room, start city Islamabad, that tour's days and road or air choice, no guide, no meals, and the active profit margin. If that price cannot be calculated, the card shows `basePrice`. Ratti Gali, code 201, shows 150,000. The package builder is the full quote for any group size. |
| BR-12 | The contact form saves the message. It must not clear the message and then lose it. |
| BR-13 | Book Now saves a booking request and still opens `https://wa.me/923339981177`. Do not use `tel:+1234567890`. |
| BR-14 | The custom trip form saves the request. |
| BR-15 | Guest names, phone numbers, and messages are not shown on the public site. |
| BR-16 | The public site stays in the language it uses today. Office screens are in US English. |

## 3. Prices

| ID | Requirement |
|---|---|
| BR-17 | The first prices are loaded from `Trip Cost Calculator Final - Copy.xlsx`. After that load, the office system is the live price list. The Excel file is not deleted. |
| BR-18 | Hotel grades offered to guests are Deluxe, Executive, Luxury, and Ultra Luxury. Premier is stored if the sheet has it, and it is not offered. |
| BR-19 | Road trips start from Lahore or Islamabad only. A guest from Karachi joins a road trip in one of those two cities. |
| BR-20 | Air trips start from Karachi, Lahore, or Islamabad. |
| BR-21 | Until the office changes them, the Islamabad air ticket is 60,000 rupees, the Lahore air extra is 10,000 rupees, and the Karachi air extra is 30,000 rupees on top of the Islamabad ticket. |
| BR-22 | The profit margin is any whole percent from 0 to 100. Only the Owner and the Manager can change it. The active margin is shown on the quote screen. The Meadow prototype starts at 20 percent. That default is pending Moeen sign-off. Until the Meadow office is live, the running site still uses 15 or 20. |
| BR-23 | Prado is the preferred vehicle where that car is offered. The Excel name Parado is the same car. Other vehicles can be turned on for a route. |
| BR-24 | The office can choose Other and type a mix, for example a Gli car plus a jeep. |
| BR-25 | A quote can add a paid extra on top of the main vehicle. The office types the name and the amount. Examples are a musical night, a BBQ and bonfire, fireworks, a honeymoon setup, or flowers. |
| BR-26 | A jeep price is the full amount for the days written on the line. The system does not multiply that amount by the number of days again. |
| BR-27 | Jeep lines are Kalash and Chitral road 90,000, Minimarg road 90,000, Kumrat road 16,200, and Fairy Meadows road and air 18,200. One jeep is added for each group of six travelers. The Manager can turn a line off. |
| BR-28 | The Neelum Taobat Arang Kel rates are replaced with the Swat rates. The old 6,000 deluxe twin is not the live Taobat rate. Taobat does not get a new public tour page in the first delivery. |
| BR-29 | Naran keeps the Naran rates already in the Excel file, for now. Swat is not copied over Naran. |
| BR-30 | Ratti Gali, tour code 201, keeps the price already on the website. Neelum, Naran, and Swat are not copied onto it. |

## 4. How a starting quote is worked out

These rules fill the quote before anyone edits a single night or a single day.

| ID | Requirement |
|---|---|
| BR-31 | When the package includes a hotel, hotel nights equal days minus one. A one-day trip has no hotel night. Hotel only asks for the city and the number of nights instead. No hotel has no hotel nights. |
| BR-32 | When the package includes transport, vehicle cost equals the number of vehicles times ((daily rent plus daily fuel) times the number of days, plus the toll once). The toll is once per vehicle. Hotel only does not include transport, so it has no vehicle cost. |
| BR-33 | If the group needs more seats than one vehicle has, the quote adds more vehicles. |
| BR-34 | If the office does not type a room count, rooms equal the people who need a seat, divided by 3, rounded up. A seat is each adult, each child, and each infant with their own seat. An infant on a lap is not a seat. |
| BR-35 | When the package includes a hotel, hotel cost is the nightly rate times nights times rooms. Until the hotel catalog is built, the nightly rate is the grade rate in BR-84. When the catalog is built, in task T-39, hotel cost follows the catalog chain: city, then hotel, then room, then occupancy. The nightly rate is that catalog row, including an extra mattress when occupancy asks for one. Grade is a label on the hotel, not the price. Until the catalog pick is changed, the untouched quote uses the published twin rate for the grade label. The Meadow prototype shows the catalog with sample hotels. That default is pending Moeen sign-off. |
| BR-36 | A guide, if selected, is 5,000 rupees per day. |
| BR-37 | Meals, if selected, are per adult and per child, per night: Deluxe 1,200, Executive 2,000, Luxury 2,500, Ultra Luxury 3,000. |
| BR-38 | When the package includes transport and a hotel, on a road trip longer than one day, arrival breakfast is 500 rupees per adult and per child. No hotel does not add it. Hotel only does not add it. |
| BR-39 | When the package includes transport, an air quote adds a welcome pack of 1,500 rupees and entry tickets of 4,000 rupees for each adult and each child, plus 800 rupees for each infant. Hotel only does not add the welcome pack or the entry tickets. |
| BR-40 | A child air ticket is 75 percent of the adult fare. An infant on a lap is 1,000 rupees. An infant with a seat is 5,000 rupees. |
| BR-41 | When the package includes transport and a hotel, the air sticker is 500 rupees times the number of rooms. No hotel does not add the sticker. Hotel only does not add it. |
| BR-42 | When the package includes transport, if a road trip starts in Lahore and is longer than three days, the quote adds 5,000 rupees for each day after day three, for each vehicle. Hotel only does not add it. |
| BR-43 | Profit is added last, at the active profit margin. The margin is a whole percent from 0 to 100. |
| BR-44 | Before live prices are switched, this example must total 140,400 rupees. The profit margin in this test is 20 percent: Islamabad, Skardu Valley, 5 days, 2 adults, Gli car, Deluxe, no guide, no meals, with a hotel and with transport. No one-night or one-day edit is applied to this test. |

### Hotel package, pending Moeen sign-off

These defaults are pending Moeen sign-off. The Meadow prototype uses them so Moeen can sign off before the live office changes.

- With hotel is the default. The package includes a hotel and other services.
- No hotel keeps the other services. It has no hotel line, no nights, no rooms, no meals, no stickers, and no road breakfast.
- Hotel only asks for the city and the number of nights. It has no vehicle, day edit, toll, jeep, guide, extra, breakfast, or Lahore extra. On air it has no tickets, welcome pack, or entry, and it does not add the sticker or the infant extra.
- Under With hotel, Same hotel all nights is the default. One catalog pick covers every night. Change per night is one click and shows a catalog pick on each night.
- A package with neither a hotel nor other services is refused. Hotel only with no nights is that package.
- Guests on the website get the same three choices. They see only the final total. Staff see the lines and one total for each mode.
- Until the catalog pick is changed, the untouched Skardu quote still uses the published Deluxe twin rate, so the test total stays 140,400 at a profit margin of 20 percent.
- The profit margin starts at 20 percent. It is a whole percent from 0 to 100.
- The dashboard note about the costing file is a placeholder while that mismatch is checked.
- Hotel only still counts rooms from the party already on the quote. Two adults use one room.

## 5. One night or one day

| ID | Requirement |
|---|---|
| BR-45 | The starting quote uses one hotel rate on every night and one vehicle on every day. |
| BR-46 | The Manager, and the Owner, can set a different hotel rate on one night. The other nights stay as they were. |
| BR-47 | The Manager, and the Owner, can remove the vehicle on one day, set a jeep on one day, or set a higher vehicle on one day. |
| BR-48 | The quote screen shows the average nightly rate. That average is the hotel rates for the nights, added up and divided by the number of nights. An average of 20,000 is shown with the 20,000 hotel category. If no grade is an exact match, the screen still shows the average and the nearest grade. |
| BR-49 | After an edit, the total follows the edited nights and days, then the profit margin. |
| BR-50 | The guest package builder uses the starting quote only. The guest gets With hotel, No hotel, and Hotel only, and sees one total for the choice they make. The guest does not see each line and does not see the profit. Guests cannot edit one night or one day. A staff member who is logged in sees each line, the profit, and one total for each mode. |

## 6. Excel load rules

| ID | Requirement |
|---|---|
| BR-51 | A vehicle row with rent, fuel, and seats, and a blank place name, is attached to the place named on the nearest row above it. |
| BR-52 | A row stored as zero is not a live fare. |
| BR-53 | The Skardu and Hunza air hotel row with no grade name, twin 24,000 and 3-share 28,000, is loaded as Executive. |
| BR-54 | The load does not invent a price. Rows that still cannot be placed are reported. |

## 7. Care of the system

| ID | Requirement |
|---|---|
| BR-55 | The database is backed up every day. A restore is used only when the data is damaged, and the client is told. |
| BR-56 | Before Step 3 is closed, the office gets three short sessions, one each for Owner, Manager, and Editor, and a short written guide in plain US English. The Manager session includes a change to one night or one day. |
| BR-57 | The office screens and the public site are checked on current Chrome, Edge, Firefox, and Safari, on a computer and on a phone. |
| BR-58 | About, FAQ, cancellation, terms, privacy, and traveler instructions stay as they are. They are not office-edited in the first delivery. |

## 8. Not in the first delivery

The first delivery is the baseline. These items stay out of it.

- A new look for the public site.
- A new public tour page for Taobat.
- Kashmir, Swat, and Chitral jeep packages by air and by road. These are Phase 2.
- Hours on each stop, and the labels Comfort, Luxury, Adventure, and Exploration. These are Phase 2.
- Card payment on the website.
- A login for guests.
- Deleting the Excel file.
- Office media controls beyond the three screens that already upload. Those controls are section 8a. They are the next sprint, with the Meadow prototype. They are not part of the first delivery.

## 8a. Office media, before Phase 2 and Phase 3

Asked for on 13 October 2026. Office media is built. The next sprint is BR-82, the Meadow office promised to Moeen. Do not start Phase 2 or Phase 3 while BR-82 is open.

A path may stay in the field. The office must also be able to upload a file and to remove that file. Removing a picture takes it off the page and deletes the stored file when this office saved that file. A picture that shipped with the site, under `/images/` or `/pdfs/`, is unlinked only. It is not deleted from the repo.

Preview and Production each have their own Vercel Blob stores and their own Neon database. A token or a connection string from one environment is never copied into the other.

Pictures and PDFs use the public media store for that environment, through `@vercel/blob` and `MEDIA_READ_WRITE_TOKEN`. A picture or a PDF is saved with `access: "public"` and a name `media/` plus one file name, such as `media/1710000000000-ab12cd34ef567890.jpg`. The file name has no slash. The database stores the public URL that `put` returns. `del` removes it. Backups use the private backup store for that environment, `BLOB_READ_WRITE_TOKEN`, and `access: "private"` under `backups/`. A media URL cannot read a backup. If `MEDIA_READ_WRITE_TOKEN` is missing, the save fails and says storage is not connected. Do not write the file under `public/uploads`, and do not commit it.

`DATABASE_URL` on Preview points at the Preview Neon database. Production gets its own Neon database and its own `DATABASE_URL` when this app is what Production deploys. The two databases are not the same database.

| ID | Requirement |
|---|---|
| BR-75 | An office upload of a picture still follows BR-59: JPEG, PNG, or WebP, read from the bytes, 5 MB or under. It is stored as a public Vercel Blob under `media/` in that environment's media store, and the page stores that public URL. The Owner or the Editor may upload. The Manager is refused. |
| BR-76 | A tour PDF upload is a PDF, read from the bytes, 10 MB or under. Any other type is refused. |
| BR-77 | Tour extra photos, the tour PDF, the place banner, each place section photo, the blog cover, each blog section photo, and the review avatar can be uploaded. A path can still be typed. |
| BR-78 | One tour extra photo, one place section, one blog section, the place banner, the blog cover, and the review avatar can be removed without deleting the tour, the place, the post, or the review. A place section can already be added. A blog section can be added and removed. |
| BR-79 | Replacing or removing an office-uploaded file deletes that stored file. This includes a gallery photo, a home slide, a tour main photo, a tour extra photo, a tour PDF, and the files on a place section or a blog section. Deleting a tour deletes the office files that tour used. A save that is refused deletes any file it stored for that save, which is task T-40. A path under `/images/` or `/pdfs/` is not deleted from the repo. |
| BR-80 | The public page shows the new file on the preview site after a refresh. The page layout does not change. |
| BR-81 | The Meadow prototype is the clickable file `docs/office-design/meadow.html`. On the preview site it is also `https://new.travelwithmoeen.com/meadow`. That path is not `/office`. The Owner, Manager, and Editor links match BR-01 to BR-07. The Owner and the Editor can delete a tour. A Manager cannot. Profit margin is any whole percent from 0 to 100, with a slider. The hotel catalog is city, then hotel, then room, then occupancy, and the rate fills from that row. Grade is a label on the hotel. With hotel can use one catalog pick for every night, or a catalog pick on each night, in one click. The quote has With hotel, No hotel, and Hotel only. Each mode has one guest total. Guests on the website get those three choices and see only the final total. A package with neither a hotel nor other services is refused. A tour has a Places multi-select, and the place page lists Tours at this place. The dashboard says the mismatch with the costing file is being checked. A day edit changes a transport quote. Changing the number of days on a hotel-included quote sets hotel nights to days minus one. Trip plans show Phase 2 and Phase 3 for review, including the Season by month table. The layout fits a computer and a phone. The zip is that same folder. Moeen receives this file before the live office is rebuilt. |
| BR-82 | The next sprint builds the Meadow look into the live office at `/office`. The screens match `docs/office-design/meadow.html`. The public site look does not change. Login, roles, quotes, guest requests, and media uploads stay as they are. The prototype bar that switches role without a password is not part of the live office. |
| BR-83 | The Owner and the Editor can add a tour from `/office/tours`, amend a tour from that list, and delete a tour. A Manager cannot. A price row and a guest request stay with the Owner, which is BR-03 and BR-06. A tour can link to one or more places. The office and the public tour page list those places, and the office and the public place page list those tours. The tour name stays on the tour. The place title stays on the place. Saving a tour does not rewrite the place guide. Saving a place title updates a linked tour's location line only when that tour links to this place alone and that line is the previous title. |
| BR-84 | Until the hotel catalog in T-39 is built, a hotel night in the live office and on the website uses the loaded hotel rate for the place, start city, and grade: the twin rate for two or fewer in a room, and the 3-share rate for more. Change per night picks a grade, or types a rate, on that night. This is the night edit in BR-46. The live office does not show the sample catalog hotels from the prototype. |
| BR-85 | The Meadow office is built in parts. The look and the screens are built before Moeen signs off. A price rule that is pending Moeen sign-off is built only after the matching row in the sign-off table in `docs/specs/tasks.md` is Approved or Changed. If Moeen changes a rule, the requirement and the design change first, then the code. |
| BR-86 | The office records who saved what, and when. Each successful office save writes one activity row: the time, the signed-in login, the area, the record, and a short line such as "Saved tour 5 Days Trip to Skardu". A failed or refused save writes no row. A row does not hold a password, a token, a secret, or a guest phone or message. The dashboard lists recent rows. A person sees only rows for areas their role can open. Each content and rate screen shows "Saved by" and the time of the last save on that record. Rows are kept for 365 days. |

Creating a new tour, place, or blog post is not part of the office-media work. Adding a tour from the tours list is BR-83. Deleting a price row stays BR-03 and is not part of this work. The prototype changes no running route, so it does not repeat the four security tests. T-35 does.

## 9. Phase 3, after the baseline, office media, and Phase 2

These were asked for on September 29, 2026. They are kept in the plan. They are sprint 4. They are not built in the baseline or in office media. The Meadow file shows them on Trip plans so they can be reviewed. They are not part of the live office until Phase 2 and Phase 3. Phase 2 is accepted before Phase 3 starts. Office media is accepted. The Meadow office, BR-82, is accepted before Phase 2 starts.

- Season plans by month. Blossom is in April, and the exact April dates still need to be named. Summer is May through September. Autumn is 10 October through 30 November. Winter is 1 December through 30 March.
- Fuel by kilometers. A Gli car uses 1 liter for each 14 km. A Prado uses 1 liter for each 5 km. One petrol rate and one diesel rate update every quote.
- A guide price the office can edit by area. Islamabad and Murree can cost less than Skardu and Hunza.
- Entry tickets added from the day's plan, instead of one air entry amount.
- A tracking code on each quote a guest builds or downloads.
- A no-price copy for the driver and field team, with services, dates, flights, vehicles, and hotels.
- A PDF or image download of the guest quote.
- A download of the live prices back to Excel.

In sprint 4, the air sticker follows the number of vehicles. Until then it stays 500 rupees times the number of rooms.

## 10. Done when

Step 1 is done when an Editor can change a tour title and a photo and the public page shows both, an Editor cannot open a price, and an Owner can create an Editor login and a Manager login.

Step 2 is done when the test quote equals 140,400 rupees at 20 percent, 15 percent changes only the profit, Premier is not offered, a road quote cannot start from Karachi, a Karachi air quote includes 30,000 rupees, Taobat uses Swat rates, Naran still uses the Naran rates for now, Ratti Gali still shows the website price, a night-two hotel edit changes only that night and the average, removing one day's vehicle removes that day's rent, and BR-59, BR-68, BR-70, and BR-71 through BR-74 pass. Step 2 is not done if a renamed text file or an oversized file can still be saved as a photo, or if an 11th failed sign-in inside 15 minutes is still accepted.

Step 3 is done when a test contact and a test booking stay in the office list, WhatsApp still opens, an Editor can read the list and cannot delete an item, an Owner can delete a test item, and a public page response does not include the test phone number.

Office media is done when BR-75 to BR-80 pass. An Editor can upload and remove a tour extra photo, a tour PDF, a place banner, a place section photo, a blog cover, a blog section photo, and a review avatar. A blog section can be added and removed. A place section can be removed. A Manager upload is refused. A file that is not a PDF is refused in the PDF field. A PDF over 10 MB is refused. A picture over 5 MB is refused. The public page on the preview site shows the file. Replacing or removing an office file deletes that file, including the office files on a deleted tour. A path under `/images/` or `/pdfs/` still loads.

The Meadow prototype file is done. BR-81 passes on `main`. Moeen still needs that file. The live Meadow office is done when BR-82 and BR-84 to BR-86 pass: `/office` matches `docs/office-design/meadow.html`, the public site look is unchanged, a person cannot change role without signing in, and rows S-1 to S-8 in the sign-off table in `docs/specs/tasks.md` are Approved or Changed.

## 11. Security

The source is the [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/) and the [OWASP Top 10](https://owasp.org/www-project-top-ten/): broken access control, cryptographic failure, injection, identification failures, and security misconfiguration. ISO/IEC 25010 is why the product must stay secure. The rows below are the project rules. They are not a second copy of the whole OWASP text.

Each rule closes in the step that opens the hole. A later step does not leave it for the step after that. A later step does not weaken a check that an earlier step already closed.

These rules hold on every step, including Step 1:

| ID | Requirement |
|---|---|
| BR-60 | Authenticate, then check the role, then check the input, then write. The role check runs inside the function that writes. A hidden button or a direct call to `app/api` cannot skip it. A missing or bad session returns 401. A signed-in person with the wrong role returns 403. Bad input returns 400. Step 1 may still return 400 for a wrong role. Task T-27 in Step 2 sets 401 and 403. That change does not wait for Step 3. |
| BR-61 | Secrets stay in `.env`. A page, a log line, and an error response do not print `DATABASE_URL`, `SESSION_SECRET`, a password, or a stack trace. `.env` is not committed. |
| BR-62 | A new office save goes through `app/api` and `lib/`. Do not add a server action for a save. |
| BR-67 | Passwords are hashed with bcrypt, at least 12 rounds. A new password is at least 8 characters. The login error is the same text for an unknown email and a wrong password. Login sets a new cookie. Logout clears it. The cookie is `httpOnly`, `SameSite=Lax`, and `Secure` in production. It expires in 7 days. It is signed. The role is read from the database, not from the cookie body. `proxy.ts` only checks that a cookie exists. The signed check stays in the session read. |
| BR-69 | Database calls use the query builder. Do not build SQL by joining strings. |

Step 1 opened login and photo upload. The cookie and the password hash in BR-67 are already required. Step 2 closes what Step 1 left open: upload bytes, login throttling, and the 401 and 403 codes.

| ID | Requirement |
|---|---|
| BR-59 | Check an office upload from the file bytes, not from the browser file type. Accept only JPEG, PNG, and WebP. Refuse SVG and any other type. Refuse a file larger than 5 MB. The stored name has no folder path. Task T-26. Part of Step 2. |
| BR-63 | The Excel import reads cell values only. It does not run a macro, follow an external link, or write a file under `public/`. This closes in T-10. |
| BR-68 | After 10 failed sign-ins for the same email within 15 minutes, refuse the next sign-in until that window ends. Record the failure in the database so a second server sees the same count. The log line has the email and the time. It does not have the password. Task T-27. Part of Step 2. |
| BR-70 | Reject blank, negative, and non-numeric money and counts. A rupee amount is at most 10,000,000. A tour is at most 60 days. A review rating is 1 to 5. This closes with the quote and rate screens in Step 2. |

Step 3 opens guest names, phones, and messages. Step 3 closes that in T-19 and T-22. Sprint 4 does not become the first time those fields are checked. BR-15 still applies: guest names, phone numbers, and messages are not shown on the public site.

| ID | Requirement |
|---|---|
| BR-64 | A guest name is at most 200 characters, a phone is at most 40, an email is at most 200, and a message is at most 4,000. Store them as text. Do not render them as HTML. |

The backup closes in T-23. Sprint 4 downloads close in the same sprint that builds them.

| ID | Requirement |
|---|---|
| BR-65 | A backup file is not committed and is not placed under `public/`. |
| BR-66 | The driver copy has no rupee amounts. A guest PDF or image has the guest total only, not the staff lines and not the profit. The Excel download of live prices is limited to the Owner and the Manager. |

## 12. Security tests

Four tests are the minimum. The same four run at the end of Step 2, again before Step 3 is accepted, again before T-25 is accepted, again before T-35 is accepted, and again before T-37 is accepted. Sprint 4 does not replace them with a different set. A step is not done if any of the four fails. Do not hide a failure with an ignore flag unless the step note names the package, the finding, and why it cannot be fixed in that step.

| ID | Test | Minimum |
|---|---|---|
| BR-71 | SAST. Static check of the code before it runs. | `npm run lint` passes. The pre-commit hook already runs it on staged TypeScript. It must also pass on the whole project before the step is accepted. A new forbidden import, a server action, or a Prisma import fails the step. |
| BR-72 | SCA. Check of third-party packages. | `npm run check:sca` passes. That command is `npm audit --omit=dev --audit-level=high`. A high or critical finding in a production dependency fails the step. |
| BR-73 | DAST. Check of the running site from the outside. | With `npm run dev` running, the OWASP ZAP baseline scan below finishes with no High alert. Exit code 2 fails the step. Warnings are written in the step note. `docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:3000 -I` |
| BR-74 | IAST. Check from inside the running app while a test drives it. | This project does not add a paid agent. The minimum is the step script against the live server. Every run keeps the cases already listed below and adds the new step's cases. It does not delete an old case. |

The four tests cover the whole project, not only one screen.

SAST, every pull request and every step close. `npm run lint` must pass, including these rules: no `eval`, no `new Function`, and no `dangerouslySetInnerHTML`. The pre-commit check must still reject `.env`, `resources/`, `public/uploads/` except `.gitkeep`, and Prisma. A secret in a tracked file fails the same way as a lint error.

SCA, every step close. `npm run check:sca` checks production dependencies for high and critical findings. The lockfile in git is the list of packages. A pull request that adds a dependency names that package in the pull request text. Do not run `npm audit fix --force` to hide a finding.

DAST, every step close, from outside the running site. The ZAP baseline must request the public home page and `/office/login`. A High alert fails the step. An office action with no cookie is not a ZAP job. The step script checks that, because ZAP is not logged in.

IAST, every step close, from inside the running site. The script keeps these cases forever:

- No cookie on an office save returns 401.
- The wrong role returns 403.
- The login error text is the same for a bad email and a bad password.
- A response body does not contain `SESSION_SECRET` or a password.

Step 2 adds, and later runs keep them: a renamed text file is refused, a file over 5 MB is refused, and the 11th failed sign-in inside 15 minutes is refused.

Step 3 adds, and later runs keep them: a message over 4,000 characters is refused, and the public home page does not contain the test guest phone.

Office media adds, and later runs keep them: a Manager upload returns 403, a file that is not a PDF is refused in the PDF field, and the public page shows an Editor upload.

The Meadow office, T-37, adds, and later runs keep them: an Editor margin save returns 403, a margin of 101 or 12.5 is refused, a guest quote response has no lines and no profit in each hotel choice, a package with neither a hotel nor other services is refused, and a Manager does not receive content rows from `GET /api/office/activity`.

Sprint 4 adds: the driver copy has no rupee amount. The guest download has one total. An Editor cannot download the live price Excel file.

## 13. Who may call what

This list is the whole project. A new office route is added to this list in the same change that adds the route. A route that is not on the list is refused. Public pages stay open. Guests do not get an office session.

| Call | Who |
|---|---|
| Public pages, including home, tours, places, blog, gallery, calculator, contact, and custom trip | Anyone. No session. |
| `GET /meadow` | Anyone. No session. The clickable Meadow prototype. It is not the office and it does not read the database. |
| `POST /api/quote` | Anyone. A guest response is one total and uses the profit margin saved in the office. A signed-in Owner, Manager, or Editor also receives the lines and the profit. Only an Owner or a Manager can send a different margin, a night edit, or a day edit. A package with neither a hotel nor other services is refused. |
| `POST /api/requests` | Anyone. No session. Saves a contact, a custom trip, or a booking. The response does not include the name, phone, email, or message. |
| `GET /api/content/tours`, `/tours/[id]`, `/places`, `/places/[slug]`, `/posts`, `/posts/[slug]`, `/photos`, `/reviews`, `/slides`, `/site` | Anyone. No session. Read only. The same data the public pages show. |
| `POST /api/office/login` | Anyone. The failure rules in BR-67 and BR-68 apply. |
| `POST /api/office/logout` and `GET /api/office/session` | A signed-in Owner, Manager, or Editor. The session reply also carries the number of new guest requests for the sidebar, which every signed-in role may read. |
| Tour, place, post, photo, review, slide, and site-detail writes | Owner or Editor. |
| `POST /api/office/tours/create` | Owner or Editor. Adds a tour. It does not set a rupee amount. |
| Rates, profit margin, vehicles, jeep lines, paid extras, and the live price Excel download | Owner or Manager. |
| `POST /api/office/tours/delete` | Owner or Editor. Deletes a tour. A Manager is refused. |
| Create a login, remove a login, change a role, delete a price row, delete a guest request | Owner only. |
| `GET /api/office/requests` | A signed-in Owner, Manager, or Editor. |
| `GET /api/office/activity` | A signed-in Owner, Manager, or Editor. Returns only rows for areas that role can open, which is BR-86. Read only. |
| `GET /api/office/rates` | Owner or Manager. |
| `POST /api/office/requests/status` | Owner or Manager. |
| `POST /api/office/requests/delete` | Owner only. |
| `GET /api/office/backup`, `POST /api/office/backup`, and `GET /api/office/backup/file` | Owner only. Lists, takes, and downloads database backups. A backup is kept in private storage and is never under `public/`. |
| `POST /api/backup` | The nightly scheduled run only. It must send the backup secret. No session. |
| Read guest requests | Owner, Manager, or Editor. |
| Change a guest request status | Owner or Manager. |
| Guest PDF or image | The guest sees one total. Staff lines and profit stay off that file. |
