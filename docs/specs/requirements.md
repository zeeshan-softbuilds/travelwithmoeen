# Requirements

**Spec:** TWM-SPEC-REQ  
**Proposal:** TWM-SOW-001, version 1.3, September 29, 2026  
**Status:** Ready to build  

This file says what the first delivery must do.

**Also read:** `docs/specs/design.md`, `docs/specs/tasks.md`, `docs/rules/project-structure.md`, and `docs/rules/coding-standards.md`

The public website stays. The office gets a private area on that same site. Guests do not log in.

## 1. Roles

| ID | Requirement |
|---|---|
| BR-01 | There are three roles: Owner, Manager, and Editor. Each login has one role. |
| BR-02 | Only the Owner can create a login, remove a login, or change a role. A seed script may create the first Owner on a development machine. That password is not stored in the repo. |
| BR-03 | Only the Owner can delete a tour, a price row, or a guest request. |
| BR-04 | The Owner and the Manager can edit hotel rates, vehicle rates, air extras, and jeep lines. They can turn a vehicle on or off for a route, add an Other vehicle, add a paid extra, and switch the season profit between 15 percent and 20 percent. |
| BR-05 | The Owner and the Editor can edit tours, day plans, places, blog posts, the gallery, reviews, home slides, and the phone, address, and social links. They can mark a tour as featured. The Editor can read guest requests. The Owner and the Manager can update a guest request status. The Editor cannot. |
| BR-06 | The Editor cannot change any rupee amount and cannot delete a tour or a guest request. |
| BR-07 | The Manager cannot edit public page text and cannot create logins. |
| BR-08 | A person who is not logged in cannot open the office area. |

## 2. Public site

| ID | Requirement |
|---|---|
| BR-09 | The public pages keep the same job they have today: home, tours, tour page, places, blog, gallery, package price, custom trip, contact, and Book Now. |
| BR-10 | The pages in BR-09 read from the office system, not from the fixed files in `data/`. About, FAQ, and the legal pages in BR-58 stay on their current pages. |
| BR-11 | A tour card shows the Deluxe couple price: 2 adults, 1 twin room, start city Islamabad, that tour's days and road or air choice, no guide, no meals, and the active season profit. If that price cannot be calculated, the card shows `basePrice`. Ratti Gali, code 201, shows 150,000. The package builder is the full quote for any group size. |
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
| BR-22 | Off-season profit is 15 percent. In-season profit is 20 percent. Only the Owner and the Manager can switch it. The active rate is shown on the quote screen. |
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
| BR-31 | Hotel nights equal days minus one. A one-day trip has no hotel night. |
| BR-32 | Vehicle cost equals the number of vehicles times ((daily rent plus daily fuel) times the number of days, plus the toll once). The toll is once per vehicle. |
| BR-33 | If the group needs more seats than one vehicle has, the quote adds more vehicles. |
| BR-34 | If the office does not type a room count, rooms equal the people who need a seat, divided by 3, rounded up. A seat is each adult, each child, and each infant with their own seat. An infant on a lap is not a seat. |
| BR-35 | Hotel cost uses the twin rate. If more than two people share a room, it uses the 3-share rate. Then it multiplies by nights and by rooms. |
| BR-36 | A guide, if selected, is 5,000 rupees per day. |
| BR-37 | Meals, if selected, are per adult and per child, per night: Deluxe 1,200, Executive 2,000, Luxury 2,500, Ultra Luxury 3,000. |
| BR-38 | On a road trip longer than one day, arrival breakfast is 500 rupees per adult and per child. |
| BR-39 | An air quote adds a welcome pack of 1,500 rupees and entry tickets of 4,000 rupees for each adult and each child, plus 800 rupees for each infant. |
| BR-40 | A child air ticket is 75 percent of the adult fare. An infant on a lap is 1,000 rupees. An infant with a seat is 5,000 rupees. |
| BR-41 | The air sticker is 500 rupees times the number of rooms. |
| BR-42 | If a road trip starts in Lahore and is longer than three days, the quote adds 5,000 rupees for each day after day three, for each vehicle. |
| BR-43 | Profit is added last, at 15 percent or 20 percent. |
| BR-44 | Before live prices are switched, this example must total 140,400 rupees at 20 percent profit: Islamabad, Skardu Valley, 5 days, 2 adults, Gli car, Deluxe, no guide, no meals. No one-night or one-day edit is applied to this test. |

## 5. One night or one day

| ID | Requirement |
|---|---|
| BR-45 | The starting quote uses one hotel rate on every night and one vehicle on every day. |
| BR-46 | The Manager, and the Owner, can set a different hotel rate on one night. The other nights stay as they were. |
| BR-47 | The Manager, and the Owner, can remove the vehicle on one day, set a jeep on one day, or set a higher vehicle on one day. |
| BR-48 | The quote screen shows the average nightly rate. That average is the hotel rates for the nights, added up and divided by the number of nights. An average of 20,000 is shown with the 20,000 hotel category. If no grade is an exact match, the screen still shows the average and the nearest grade. |
| BR-49 | After an edit, the total follows the edited nights and days, then the season profit. |
| BR-50 | The guest package builder uses the starting quote only. The guest sees one total. The guest does not see each breakfast line and does not see the profit. Guests cannot edit one night or one day. A staff member who is logged in sees each line and the profit. |

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

## 9. Phase 3, after the baseline and Phase 2

These were asked for on September 29, 2026. They are kept in the plan. They are sprint 4. They are not built in sprints 1 to 3. Sprint 4 starts after sprint 3 is accepted.

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

Four tests are the minimum. The same four run at the end of Step 2, again before Step 3 is accepted, and again before T-25 is accepted. Sprint 4 does not replace them with a different set. A step is not done if any of the four fails. Do not hide a failure with an ignore flag unless the step note names the package, the finding, and why it cannot be fixed in that step.

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

Sprint 4 adds: the driver copy has no rupee amount. The guest download has one total. An Editor cannot download the live price Excel file.

## 13. Who may call what

This list is the whole project. A new office route is added to this list in the same change that adds the route. A route that is not on the list is refused. Public pages stay open. Guests do not get an office session.

| Call | Who |
|---|---|
| Public pages, including home, tours, places, blog, gallery, calculator, contact, and custom trip | Anyone. No session. |
| `POST /api/quote` | Anyone. A guest response is one total. A signed-in Owner or Manager also receives the lines and the profit. Night and day edits are ignored unless that person can change a rate. |
| `POST /api/office/login` | Anyone. The failure rules in BR-67 and BR-68 apply. |
| `POST /api/office/logout` and `GET /api/office/session` | A signed-in Owner, Manager, or Editor. |
| Tour, place, post, photo, review, slide, and site-detail writes | Owner or Editor. |
| Rates, season, vehicles, jeep lines, paid extras, and the live price Excel download | Owner or Manager. |
| Create a login, remove a login, change a role, delete a tour, delete a price row, delete a guest request | Owner only. |
| Read guest requests | Owner, Manager, or Editor. |
| Change a guest request status | Owner or Manager. |
| Guest PDF or image | The guest sees one total. Staff lines and profit stay off that file. |
