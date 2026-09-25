# Requirements

This file is the list of what we will build for Travel With Moeen. Each item has an ID. The source line says where the item came from, so we can trace it later.

The longer discovery notes stay in these files:

- `docs/implementation-details.md` records how the website works today.
- `docs/resources-files.md` records the Excel file and the costing desk.

This file does not copy login passwords from `resources/Important-Notes.txt`.

---

## How to read a requirement

| Field | Meaning |
|---|---|
| ID | A fixed name, such as REQ-01. Do not reuse an ID. |
| Status | Confirmed, Open, or Discovery. |
| Source | The voice note, chat answer, image, Excel sheet, or discovery document. |

Status words:

- **Confirmed** means Moeen or his team said this.
- **Open** means we asked and they have not answered yet.
- **Discovery** means we found it in the current website or in the files. Moeen has not confirmed it as a new rule.

Voice notes are in Urdu. The English under each voice source is the meaning of that note. If a word is unclear, the audio file is the record.

---

## Source register

| Source ID | What it is | Where |
|---|---|---|
| DISC-SITE | How the live website is built today | `docs/implementation-details.md` |
| DISC-FILES | What is inside the Excel file and the costing desk | `docs/resources-files.md` |
| XLS | Price workbook. Moeen said this is the price source of truth | `resources/Trip Cost Calculator Final - Copy.xlsx` |
| DESK | Standalone costing page saved on 31 Aug 2026 | `resources/Trip-Casting-Desk-2026-08-31 sawera.html` |
| CHAT-Q | Written answers in chat to questions 1, 2, 3, 4, and 6 | Client reply, 25 Sep 2026 |
| VN-1139 | Urdu voice note, 11:39 | `resources/WhatsApp Ptt 2026-09-25 at 11.39.22 AM.ogg` |
| VN-1141 | Urdu voice note, 11:41 | `resources/WhatsApp Ptt 2026-09-25 at 11.41.53 AM.ogg` |
| VN-1143 | Urdu voice note, 11:43 | `resources/WhatsApp Ptt 2026-09-25 at 11.43.39 AM.ogg` |
| VN-1144A | Urdu voice note, 11:44 | `resources/WhatsApp Ptt 2026-09-25 at 11.44.16 AM.ogg` |
| VN-1144B | Urdu voice note, 11:44 | `resources/WhatsApp Ptt 2026-09-25 at 11.44.41 AM.ogg` |
| VN-1145 | Urdu voice note, 11:45 | `resources/WhatsApp Ptt 2026-09-25 at 11.45.08 AM.ogg` |
| VN-1212 | Urdu voice note, 12:12 | `resources/WhatsApp Ptt 2026-09-25 at 12.12.40 PM.ogg` |
| IMG-1143 | Screenshot of the jeep table | `resources/WhatsApp Image 2026-09-25 at 11.43.10 AM.jpeg` |

### What each voice note says

**VN-1139.** For now, do not build Kashmir as a full new area. In the coming season, when the website is live, add Kashmir, Swat, and Chitral, by air and by road, including jeep. Those will be add-ons and custom trips, including luxury custom trips. While the structure is being built, leave those pieces out.

**VN-1141.** Ratti Gali, and Kashmir places such as Taobat, do not have their own prices. Use the Naran prices, or the Swat prices. The costing is the same, so copy that data in.

**VN-1143.** On the Kalash and Chitral line, "3 days" is not a times-three sum. It means the jeep is used for 3 days. The amount 90,000 is the full price. Minimarg is the same: 3 days, and the amount is also 90,000.

**VN-1144A.** The extra percent changes by season. Right now, out of season, the profit is 15 percent. In season it is 20 percent.

**VN-1144B.** Keep four hotel grades even if Excel has five. The four are Deluxe, Executive, Luxury, and Ultra Luxury. Remove Premier.

**VN-1145.** Air trips can start from Karachi, Lahore, or Islamabad. Road trips start only from Lahore or Islamabad. There is no road trip from Karachi. A guest from Karachi joins the road trip in Islamabad or Lahore.

**VN-1212.** Add a time in hours for each stop. Example: about 2 hours at Shangrila and about 1.5 hours at Upper Kachura. Add those hours so the office can see how long the day is. Do not recommend a 12 hour drive for a guest over 60, or for a family that wants comfort. About 8 hours is the comfort limit. Mark trips as Comfort, Luxury, Adventure, or Exploration so the office can suggest the right one. Extra stops, such as Manthoka, can still be done, but the day becomes rushed.

### What the image shows

**IMG-1143** is the jeep table from the costing desk:

| Applies to | Place | Line on the quote | Travellers per jeep | Amount | On |
|---|---|---|---|---|---|
| Road | Kalash Valley & Chitral | 4x4 jeep (3 days) | 6 | 90,000 | Yes |
| Road | Minimarg Astor Valley | 4x4 jeep (3 days) | 6 | 90,000 | Yes |
| Road | Kumrat and Katora Lake | 4x4 jeep | 6 | 16,200 | Yes |
| Both | Fairy Meadows Nanga Base Camp | Jeep + porter (Raikot) | 6 | 18,200 | Yes |
| Both | Fairy Meadows Nanga Base Camp | Jeep + porter (Raikot) | 6 | 18,200 | Yes |

The last two rows are the same line, both switched on.

---

## Goal

Turn the current static website into a site whose content and prices come from a system the office can edit. The public pages that already exist stay. They stop reading the files in `data/` and start reading the new system.

Source: DISC-SITE. Confirmed direction from the client brief in this project.

---

## Confirmed requirements

### Product shape

**REQ-01. Keep the current public website.**  
The pages, layout, and flows that visitors use today stay. We connect them to editable data. We do not rebuild the site from a blank design.  
Status: Discovery. Source: DISC-SITE.

**REQ-02. The office can edit public content without a developer.**  
Tours, day plans, destinations, blog posts, gallery photos, reviews, home page slides, and the phone, address, and social links move into the system.  
Status: Discovery. Source: DISC-SITE.

**REQ-03. Excel is the price source of truth.**  
When the website, the costing desk, and the Excel file disagree, the Excel file wins. The sheets that hold the rates are `Road_DB ISB`, `Road_DB LHE`, `Air_DB`, and `by air ticket fare`. The sample sheets `BY ROAD` and `BY AIR` show how a quote is added up.  
Status: Confirmed. Source: client decision, XLS, DISC-FILES.

### Hotel grades

**REQ-04. Show only four hotel grades.**  
The grades are Deluxe, Executive, Luxury, and Ultra Luxury. Do not offer Premier, even where the Lahore sheet still has Premier rows.  
Status: Confirmed. Source: CHAT-Q question 4, VN-1144B.

### Vehicles

**REQ-05. The vehicle list is editable.**  
A manager can add a vehicle type and choose which places and routes can use it. The public dropdown then shows those vehicles.  
Status: Confirmed. Source: CHAT-Q questions 1, 2, and 3.

**REQ-06. Prado is the preferred vehicle, not the only one.**  
Where a Prado can go, it is the preferred choice. Grand Cabin, Coaster, and Gli car stay available when the office turns them on for that route.  
Status: Confirmed. Source: CHAT-Q questions 1, 2, and 3.

**REQ-07. An Other vehicle choice.**  
The office can pick Other and type the real mix. Examples from the client: Gli car plus jeep for Saiful Muluk on an Islamabad to Naran trip, and Gli car plus jeep for Fairy Meadows by road.  
Status: Confirmed. Source: CHAT-Q question 1.

**REQ-08. Add-on for an extra leg.**  
A quote can add a paid extra, such as a jeep for Saiful Muluk, on top of the main vehicle. This is separate from the main vehicle dropdown.  
Status: Confirmed. Source: CHAT-Q question 1, VN-1139.

### Start cities

**REQ-09. Air trips start from three cities.**  
Karachi, Lahore, and Islamabad.  
Status: Confirmed. Source: VN-1145, CHAT-Q question 13 (answered on WhatsApp, same meaning as this voice note).

**REQ-10. Road trips start from two cities.**  
Lahore and Islamabad only. There is no road departure from Karachi. A guest who lives in Karachi joins the road trip in Islamabad or Lahore.  
Status: Confirmed. Source: VN-1145.

### Air tickets

**REQ-11. Karachi air add-on is 30,000 rupees.**  
This is extra on top of the Islamabad air ticket. The blank 30,000 row on `Air_DB` is this Karachi add-on. The formula name `KHI-Add` was missing. The amount is confirmed.  
Status: Confirmed. Source: CHAT-Q question 6, XLS sheet `Air_DB`.

**REQ-12. Islamabad air ticket base and Lahore add-on stay as in Excel until changed.**  
The sheet shows Ticket-ISB 60,000 and LHE-Add 10,000.  
Status: Discovery, inside the confirmed workbook. Source: XLS sheet `Air_DB`, DISC-FILES.

### Profit

**REQ-13. Profit percent changes by season.**  
Out of season the profit is 15 percent. In season the profit is 20 percent. The office must be able to switch this. It is not a single fixed number in code.  
Status: Confirmed. Source: VN-1144A. The Excel sample formulas currently add 20 percent (XLS sheets `BY ROAD` and `BY AIR`).

### Places with no own price list

**REQ-14. Ratti Gali still needs one price list.**  
Tour code 201 has no row in the Excel file. The 11:41 voice note says to copy Naran or Swat. Those two lists are not equal, so this is not locked. The published website price stays until the client names one list: Neelum, Naran, or Swat.  
Status: Open. Source: VN-1141, XLS, DISC-SITE (tour 201).

**REQ-15. Taobat already has Excel prices.**  
The workbook has Neelum Taobat Arang Kel. On the Lahore sheet, Deluxe twin is 6,000. That is not the Naran figure and not the Swat figure. The first release keeps those rows. It does not copy Naran or Swat over them, and it does not add a new Taobat tour page. The client has been asked to confirm this.  
Status: Working assumption, sent for confirmation. Source: XLS, VN-1141, REQ-18.

### Jeep charges

**REQ-16. Jeep amount is the full price, not price times days.**  
"3 days" means the jeep is used for 3 days. Do not multiply 90,000 by 3.  
Status: Confirmed. Source: VN-1143.

**REQ-17. Jeep table to store and turn on or off.**  

| Place | When | Quote line | People per jeep | Amount |
|---|---|---|---|---|
| Kalash Valley & Chitral | Road | 4x4 jeep (3 days) | 6 | 90,000 |
| Minimarg Astor Valley | Road | 4x4 jeep (3 days) | 6 | 90,000 |
| Kumrat and Katora Lake | Road | 4x4 jeep | 6 | 16,200 |
| Fairy Meadows Nanga Base Camp | Road and air | Jeep + porter (Raikot) | 6 | 18,200 |

One jeep is added per group of 6 travellers. The office can switch a line off.  
Status: Confirmed. Source: IMG-1143, VN-1143, DESK. The Excel road formula uses short place names and different sums (30,000 times 3, and 16,200). REQ-16 and this table override that formula where they conflict.

### Later season, not in the first build

**REQ-18. Kashmir, Swat, and Chitral jeep packages come after the structure is live.**  
By air and by road. They are custom and add-on trips, including luxury custom trips. Do not block the first build on them.  
Status: Confirmed as later. Source: VN-1139.

**REQ-19. Hours on each stop, and a trip style.**  
Store hours for each stop. Show a day total. Comfort stays near 8 hours. Do not push a 12 hour drive on a guest over 60 or a family that wants comfort. Styles to support: Comfort, Luxury, Adventure, Exploration. Extra stops can be added and should be marked as a rushed day.  
Status: Confirmed as a wanted feature. Not scheduled into the first price import. Source: VN-1212.

---

## Discovery requirements

These come from the current site. They are in scope because the new system has to replace this behavior. Moeen has not restated each line.

**REQ-20. Public tour price for two people from Islamabad.**  
Tour cards and the tour page show a couple price from Islamabad. The package builder is the full quote for any group size.  
Source: DISC-SITE.

**REQ-21. Quote math that Excel already uses.**  
Nights equal days minus 1. If the office does not type a room count, rooms equal people who need a seat, divided by 3, rounded up. Vehicle cost is (daily rent plus daily fuel) times days, plus toll once, times the number of vehicles. Hotel cost uses the twin rate, or the 3-share rate when there are more than two people per room, times nights, times rooms. Guide, if included, is 5,000 rupees per day. Meals, if included, follow the grade: Deluxe 1,200, Executive 2,000, Luxury 2,500, Ultra Luxury 3,000, per adult and child, per night. Arrival breakfast on a road trip longer than 1 day is 500 rupees per adult and child. An air quote also adds a welcome pack of 1,500 and entry tickets of 4,000 per adult and child, plus 800 per infant. Child air fare is 75 percent. A lap infant is 1,000. An infant with a seat is 5,000. The air sticker is 500 times the number of rooms. Then add the season profit from REQ-13.  
Source: XLS formulas on `BY ROAD` and `BY AIR`, DISC-FILES.

**REQ-22. Lahore road extra after day 3.**  
The Excel road formula adds 5,000 rupees times (days minus 3) times the number of vehicles, when the start city is Lahore and the trip is longer than 3 days.  
Source: XLS formula on `BY ROAD`. Status: Discovery. Not restated in the voice notes.

**REQ-23. Leads must be saved.**  
The contact form on the live site does not send a message. The custom trip form sends email only. Book Now opens WhatsApp. The new system should store the request for the office. WhatsApp can stay as the guest's button.  
Source: DISC-SITE.

**REQ-24. Three office roles.**  
The public site has no login. The office has three roles. A person has one role.

**Owner.** This is for Moeen, or someone he names. The Owner can do everything the other two roles can do. The Owner is the only person who can create a login, remove a login, and change someone's role. The Owner can also delete a tour, a rate row, or a guest request.

**Manager.** This is the standard role for prices and quotes. A Manager can edit hotel rates, vehicle rates, air ticket extras, and jeep lines. A Manager can turn a vehicle on or off for a route, add an Other vehicle, and add a paid extra such as a jeep leg. A Manager can switch the season profit between 15 percent and 20 percent. A Manager can read guest requests, update them, and save quotes. A Manager does not edit public page text. A Manager cannot create logins and cannot delete a tour or a guest request.

**Editor.** This is the standard role for public pages. An Editor can edit tours, day plans, photos, destinations, blog posts, the gallery, reviews, home page slides, and the phone, address, and social links. An Editor can mark a tour as featured. An Editor can read guest requests. An Editor cannot change any rupee amount: hotel rates, vehicle rates, tickets, jeep prices, or the season profit. An Editor cannot delete a tour or a guest request.

Status: Decided for the build. Source: office role decision, 26 Sep 2026. Replaces the earlier idea of one shared login.

**REQ-25. How blank and zero Excel rows are loaded.**  
These cells are not treated as wrong prices. The load rule, also stated in the sign-off proposal, is:

- A vehicle row that has a rent, a fuel figure, and seats, but a blank place name, is attached to the place named on the nearest row above it. This covers ten Islamabad Grand Cabin rows, plus the air rows for Hunza Gli car, one Parado between Minimarg and Fairy Meadows, and Skardu and Hunza Coaster 4c.
- A row stored as zero is not a live fare. Minimarg by air Coaster 4c, Grand Cabin, and Gli car stay at zero until the office enters a rate.
- The Skardu and Hunza air row with twin 24,000 and 3-share 28,000 and no grade name is loaded as Executive. See OPEN-01.
- Lahore Premier rows are stored but not offered, because of REQ-04.

Source: XLS, software proposal assumption 3.

---

## Items that were open, and how we close them

None of these six stop the whole build. Four are settled by the Excel formulas and the voice notes. Roles are decided in REQ-24. Ratti Gali is the only price choice still waiting on the client. Taobat keeps the rows already in Excel unless the client says otherwise.

**OPEN-01. Closed from the sheet layout.** The unnamed Skardu and Hunza air row (twin 24,000, 3-share 28,000) sits between the Deluxe row and the Luxury row. That is the Executive slot. The hotel names on that row match the Executive hotels on the road sheet for the same valley. Executive is one of the four grades Moeen asked to keep. We will import that row as Executive.  
Source: XLS sheet `Air_DB`, REQ-04.

**OPEN-02. Closed from the quote formula.** A child air ticket is 75 percent of the adult fare. The small sheet that says "75 percent to 100 percent" is a note. The formula that builds the grand total does not use that note. It multiplies by 0.75.  
Source: XLS formula on `BY AIR`.

**OPEN-03. Closed from the quote formula.** The air sticker is 500 rupees times the number of rooms. The row label says "per vehicle", but the cell that feeds the grand total multiplies 500 by the room count. We follow the formula that makes the total.  
Source: XLS formula on `BY AIR` (`Air_DB` sticker 500 times the room count).

**OPEN-04. Closed for the first build.** Neelum Taobat does not get its own tour page yet. Kashmir tours of that kind come in a later season (REQ-18). Quoting uses the Taobat rows already in Excel (REQ-15).  
Source: VN-1139, REQ-18, XLS.

**OPEN-05. Still open for Ratti Gali only.** Taobat already has its own rows. The voice note says to copy Naran or Swat for both, and says those costs are the same. In Excel they are not the same. The question below has been sent. Until the reply, only tour 201 stays on the current website price.  
Source: VN-1141, XLS sheets `Road_DB ISB` and `Road_DB LHE`.

### Question to send to Moeen about Ratti Gali and Taobat

We checked the Excel price file against the voice note from 11:41.

The voice note says Ratti Gali and Taobat do not have their own prices, so we should copy Naran or Swat, because the cost is the same.

The Excel file shows something else. Please reply to the three points below.

1. Taobat already has its own prices in the file. The place name on the sheet is Neelum Taobat Arang Kel. On the Lahore list, a Deluxe twin room there is 6,000 rupees a night. Please confirm we should keep these Taobat prices, and not replace them with Naran or Swat.

2. Naran and Swat are not the same price in the file, so we cannot copy "either" and get the same quote. On the Lahore list, a Deluxe twin room in Naran is 15,000 rupees a night. In Swat it is 9,000. The coaster toll is 10,000 for Naran and 12,000 for Swat. If you still want us to copy one of these, please name one list only.

3. Ratti Gali is not on the price file at all. The website has a 3 day road tour for it, code 201. Ratti Gali is in Neelum, and Neelum already has its own prices in the file. Those Neelum prices match Taobat (Deluxe twin 6,000), not Naran (15,000) and not Swat (9,000). Which list should we use for Ratti Gali: Neelum, Naran, or Swat? Please pick one.

**OPEN-06. Closed.** The office uses the three roles in REQ-24. There is no single shared login.

---

## Traceability matrix

| ID | Short name | Status | Source |
|---|---|---|---|
| REQ-01 | Keep current public site | Discovery | DISC-SITE |
| REQ-02 | Office edits content | Discovery | DISC-SITE |
| REQ-03 | Excel is the price list | Confirmed | Client, XLS |
| REQ-04 | Four hotel grades | Confirmed | CHAT-Q 4, VN-1144B |
| REQ-05 | Editable vehicles | Confirmed | CHAT-Q 1, 2, 3 |
| REQ-06 | Prado preferred, others allowed | Confirmed | CHAT-Q 1, 2, 3 |
| REQ-07 | Other vehicle, free text mix | Confirmed | CHAT-Q 1 |
| REQ-08 | Paid add-on leg | Confirmed | CHAT-Q 1, VN-1139 |
| REQ-09 | Air from Karachi, Lahore, Islamabad | Confirmed | VN-1145 |
| REQ-10 | Road from Lahore and Islamabad only | Confirmed | VN-1145 |
| REQ-11 | Karachi air extra 30,000 | Confirmed | CHAT-Q 6 |
| REQ-12 | Ticket-ISB 60,000 and LHE-Add 10,000 | Discovery | XLS |
| REQ-13 | Profit 15 percent off season, 20 percent in season | Confirmed | VN-1144A |
| REQ-14 | Ratti Gali price list not chosen | Open | VN-1141, XLS |
| REQ-15 | Taobat keeps its Excel rows | Assumption, sent for confirmation | XLS, VN-1141 |
| REQ-16 | Jeep price is not multiplied by days | Confirmed | VN-1143 |
| REQ-17 | Jeep amounts and places | Confirmed | IMG-1143, VN-1143 |
| REQ-18 | Kashmir, Swat, Chitral jeep later | Confirmed, later | VN-1139 |
| REQ-19 | Stop hours and trip style | Confirmed, later | VN-1212 |
| REQ-20 | Couple price vs full builder | Discovery | DISC-SITE |
| REQ-21 | Quote math from Excel formulas | Discovery | XLS |
| REQ-22 | Lahore extra after day 3 | Discovery | XLS |
| REQ-23 | Save guest requests | Discovery | DISC-SITE |
| REQ-24 | Owner, Manager, and Editor roles | Decided | Office role decision |
| REQ-25 | Do not guess blank Excel cells | Discovery | XLS |
| OPEN-01 | Unnamed air hotel row is Executive | Closed from the sheet | XLS `Air_DB`, REQ-04 |
| OPEN-02 | Child fare is 75 percent | Closed from the formula | XLS `BY AIR` |
| OPEN-03 | Sticker is 500 times rooms | Closed from the formula | XLS `BY AIR` |
| OPEN-04 | No Taobat tour page in the first build | Closed for now | VN-1139, REQ-18 |
| OPEN-05 | Ratti Gali source list | Open, one tour | VN-1141, XLS |
| OPEN-06 | Three office roles | Closed | REQ-24 |
