# Files in the resources folder

The `resources` folder sits next to the website code. The Next.js app does not import these files. They are extra working files: a handover note, an Excel trip calculator, and a standalone costing desk saved as one HTML page.

This note records what is inside each file. Login passwords from the notes file are not copied here.

---

## 1. Important-Notes.txt

This is a short handover note. It states these facts:

- The website is built with Next.js.
- It is deployed on Vercel.
- GitHub repo: https://github.com/travelwithmoeen/travelwithmoeen
- Vercel team: https://vercel.com/travelwithmoeens-projects
- The GitHub account is tied to the email address written in that file.
- To see deployments, sign in to Vercel with GitHub.

The same file also stores email and GitHub passwords in plain text. Those passwords are not repeated in this document. They should not stay in the project folder.

---

## 2. Trip Cost Calculator Final - Copy.xlsx

This workbook is the spreadsheet version of the package builder. It has six sheets.

| Sheet | Role |
|---|---|
| BY ROAD | A filled example of a road quote |
| BY AIR | A filled example of an air quote |
| Road_DB ISB | Vehicle and hotel rates when the trip starts in Islamabad |
| Road_DB LHE | Vehicle and hotel rates when the trip starts in Lahore |
| Air_DB | Air vehicle rates, air hotel rates, and air extras |
| by air ticket fare | How infant, child, and adult air fares are described |

There is no Karachi road sheet. The live website still offers Karachi as a road start, and then falls back to made-up vehicle numbers. The sign-off proposal removes Karachi as a road start.

### How a quote is built in the spreadsheet

The saved road example and the saved air example both add 20 percent on top of the net cost.

Road example already filled in on the BY ROAD sheet:

- Start: Islamabad
- Destination: Skardu Valley
- Days: 5
- Adults: 2
- Vehicle: Gli Car
- Hotel: Deluxe
- Guide: No
- Meals: No
- People: 2. Rooms: 1. Vehicles: 1. Seats: 4.

The breakdown is:

- Transport: 80,000
- Hotel: 36,000
- Guide: 0
- Meals: 0
- Arrival breakfast: 1,000
- Net: 117,000
- Grand total: 140,400

That transport line is (daily rent 8,000 + daily fuel 7,000) times 5 days, plus toll 5,000. The hotel line is twin rate 9,000 times 4 nights times 1 room. Breakfast is 500 times 2 people. Then 117,000 times 1.20 equals 140,400.

Air example already filled in on the BY AIR sheet:

- Start: Lahore
- Destination: Skardu Valley
- Days: 4
- Adults: 4
- Vehicle: Parado
- Hotel: Luxury
- Guide: Yes
- Meals: Yes
- People: 4. Rooms: 2. Vehicles: 1. Seats: 5.

The breakdown is:

- Return air tickets: 280,000
- Local transport: 69,000
- Sticker: 1,000
- Entry plus welcome pack: 22,000
- Hotel: 300,000
- Guide: 20,000
- Meals: 30,000
- Net: 722,000
- Grand total: 866,400

The ticket line is (60,000 Islamabad base + 10,000 Lahore add) times 4 adults. Local transport is (Parado rent 9,000 + fuel 8,000) times 4 days, plus toll 1,000. Hotel is luxury twin 50,000 times 3 nights times 2 rooms. Guide is 5,000 times 4 days. Meals are 2,500 per person per night times 3 nights times 4 people. Then 722,000 times 1.20 equals 866,400.

The sticker cell in Air_DB is 500. The saved quote shows 1,000 because the formula multiplies 500 by the room count. That sample has 2 rooms, so 500 times 2 is 1,000. It is one sticker price, not two.

### Air ticket fare sheet

| Passenger | Fare rule written in the sheet |
|---|---|
| Infant on a lap | 1,000 PKR |
| Infant with own seat | 5,000 PKR seat charge |
| Child, age 2 to 11 | 75 percent to 100 percent of the adult fare |
| Adult, age 12 and up | 100 percent of the adult fare |

The website calculator uses a fixed 75 percent for a child. This sheet allows a range from 75 percent to 100 percent.

### Air extras written beside the Air_DB table

| Item label in the sheet | Amount |
|---|---|
| Ticket-ISB | 60,000 |
| Unlabelled cell next to it | 30,000 |
| LHE-Add | 10,000 |
| Pack | 1,500 |
| Entry | 4,000 |
| Sticker | 500 |

The website uses a different set: Islamabad ticket 60,000, Karachi add 30,000, Lahore add 15,000, welcome pack 1,400, entry tickets 2,500, sticker 600.

### Road rate tables

Both road sheets cover the same 14 destinations and the same five vehicles: Coaster 5c, Coaster 4c, Grand Cabin, Honda BRV, and Gli Car. Coasters are stored with 25 seats, Grand Cabin with 12, Honda BRV with 6, and Gli Car with 4.

Hotel lookup columns on the same sheets are Twin, 3-Share, and Hotel Name. Levels are Deluxe, Premier, Executive, Luxury, and Ultra Luxury.

Lahore rates are higher than Islamabad rates on the long northern routes. Example, Skardu Valley, Gli Car:

| Start city | Daily rent | Toll | Daily fuel |
|---|---|---|---|
| Islamabad | 8,000 | 5,000 | 7,000 |
| Lahore | 7,500 | 5,000 | 10,000 |

Lahore coasters to Skardu are also higher: Coaster 5c rent 18,000, toll 15,000, fuel 23,000, against Islamabad rent 17,000, toll 10,000, fuel 20,000.

The Lahore hotel block is the complete one. Every destination has Deluxe, Premier, Executive, Luxury, and Ultra Luxury. The Islamabad hotel block is missing the Premier rows. Stray numbers such as 12, 151, and 153 sit in the hotel name column where Premier should be.

Other bad cells on the Islamabad road sheet:

- Skardu Valley Executive 3-share is 280,000. The twin rate beside it is 24,000, so 280,000 is almost certainly a typing error for 28,000.
- Skardu and Hunza, Honda BRV, daily rent is 1,000. Nearby BRV rents are 9,000 or 10,000.
- Murree Ayubia, Coaster 4c daily fuel is 1,500, and Grand Cabin daily fuel is 1,000. Nearby fuel figures are 8,000 to 15,000.
- Neelum Valley and Neelum Taobat Ultra Luxury 3-share is 3,000, while the twin rate is 25,000.
- Several Grand Cabin rows have a blank destination name, so the row is not tied to a valley in the first column.

The Lahore sheet does not have those Premier gaps. It still has Ultra Luxury 3-share of 3,000 for Neelum Valley and Neelum Taobat.

Hotel names are long lines of several hotels separated by slashes. The same style is used in `data/pricing.ts` on the website, but many rupee amounts differ. The spreadsheet Skardu Deluxe twin from Islamabad is 9,000. The website road table uses 10,000 for that same cell.

### Air vehicle and hotel table

Air vehicles are Parado (5 seats), Coaster 4c (21 seats), Grand Cabin (12 seats), and Gli Car (4 seats). There is no Coaster 5c and no Honda BRV on the air sheet.

Air hotel twin rates that are filled in, in PKR per night:

| Destination | Deluxe | Executive | Luxury | Ultra Luxury |
|---|---|---|---|---|
| Skardu Valley | 13,000 | 30,000 | 50,000 | 60,000 |
| Hunza Valley | 13,000 | 25,000 | 40,000 | 60,000 |
| Minimarg Astor | 13,000 | 20,000 | 24,000 | 26,000 |
| Fairy Meadows | 30,000 | 15,000 | 20,000 | 23,000 |
| Skardu and Hunza | 13,000 | 24,000 twin with no level name | 40,000 | 60,000 |

Premier rows are missing on the air sheet as well. Fairy Meadows Deluxe is priced above Executive and Luxury, which is out of the usual order. Minimarg Coaster 4c, Grand Cabin, and Gli Car are all zero. Some vehicle rows have a blank destination, so they are not clearly attached to a valley.

---

## 3. Trip-Casting-Desk-2026-08-31 sawera.html

This is one HTML file. It is a private costing desk named Trip Casting Desk, for Travel with Moeen (Pvt) Ltd. The file date in the name is 31 August 2026. The data inside was saved by Zaina Qasim at 11:20 and shared by Talib at 11:26 on that day.

It is not a page of the public website. Open the file in a browser and it runs by itself. Quotes and rate edits are kept in the browser storage on that computer. The page can also export a backup and a PDF.

### Screens

- Cost a trip
- Package set
- Itinerary and package
- Package finder
- Clients
- Rates database
- Pricing rules
- Share with team
- Quotes

The cost screen asks for client name, mobile, and email, then origin, destination, days, vehicle, adults, children, lap infants, infants with a seat, rooms, vehicle count, and hotel level. Guide, meals, lunch, and the air ticket can each be switched on. The selling price uses a markup slider. The default markup in the saved data is 15 percent, not the 20 percent used by the website and by the Excel examples.

Buttons on the cost screen: copy quote, print, PDF, save quote, and new casting.

### Price rules written on the Rules screen

1. Transport equals number of vehicles times ((daily rent + daily fuel) times days + toll). Vehicle count is travellers who need a seat, divided by seats, rounded up, unless someone types a count by hand.
2. Jeep surcharges are added on the 4x4 destinations listed below. One jeep is added per block of travellers.
3. Air ticket is the Islamabad adult fare plus the Karachi or Lahore add-on. Children pay a percentage. Infants pay a flat fare.
4. Hotel is rooms times room rate times nights. Nights equal days minus 1. If a room holds more than two people, the 3-share rate is used.
5. Guide is per day. Dinner is per person per night. Lunch is per person per day. Dinner and lunch use the rate of the chosen hotel level.
6. Arrival breakfast is for road trips only, per travelling person.
7. Selling price is net cost plus markup. The margin is shown to the team. It is left off the client PDF unless an internal option is ticked.

A one-day trip has zero nights, so hotel and meal lines are zero.

Automatic room count uses 3 people per room in the saved settings. The website calculator uses 5 people per room.

### Saved default charges inside this HTML file

| Item | Saved value |
|---|---|
| Markup | 15 percent |
| Guide | 5,000 PKR per day |
| Arrival breakfast | 800 PKR per person |
| People per room | 3 |
| Child air fare | 75 percent of the adult fare |
| Infant on lap | 1,000 PKR |
| Infant with own seat | 5,000 PKR |
| Infant extras | 800 PKR |
| Islamabad air ticket | 50,000 PKR |
| Karachi add-on | 40,000 PKR |
| Lahore add-on | 15,000 PKR |
| Welcome pack | 1,500 PKR |
| Entry | 4,000 PKR |
| Sticker | 500 PKR |

Dinner and lunch, per person, by hotel level:

| Level | Dinner per night | Lunch per day |
|---|---|---|
| Deluxe | 1,800 | 1,800 |
| Premier | 2,500 | 2,500 |
| Executive | 3,000 | 3,000 |
| Luxury | 3,500 | 3,500 |
| Ultra Luxury | 4,000 | 4,000 |

The website meal rates are lower: 1,200, 1,500, 2,000, 2,500, and 3,000 per person per night. The website does not have a separate lunch line. The website breakfast is 500, not 800. The website Islamabad air ticket is 60,000, not 50,000. The website Karachi add-on is 30,000, not 40,000.

Lahore road top-up saved in this file: after day 3, add 5,000 PKR per vehicle per day, and the switch is on. The website declares a similar Lahore challan of 5,000 but the website calculator currently adds zero.

Jeep lines that are switched on:

| Where | Label | People per jeep | Amount | Road, air, or both |
|---|---|---|---|---|
| Kalash Valley and Chitral | 4x4 jeep (3 days) | 6 | 90,000 | Road |
| Minimarg Astor Valley | 4x4 jeep (3 days) | 6 | 90,000 | Road |
| Kumrat and Katora Lake | 4x4 jeep | 6 | 16,200 | Road |
| Fairy Meadows | Jeep plus porter (Raikot) | 6 | 18,200 | Both |
| Fairy Meadows | Jeep plus porter (Raikot), second copy | 6 | 18,200 | Both |

The public website calculator does not add these jeep lines.

The rate database inside the HTML file has 160 vehicle rows and 146 hotel rows. Origins are ISB, LHE, and AIR. Destinations match the 14 road names used on the website. Air destinations are the five northern valleys.

### Company lines printed on quotations from this desk

- Legal name: Travel with Moeen (Pvt) Ltd
- Licence: ID-2753, Department of Tourist Services, Government of Pakistan, valid to 15 July 2027
- Office: Office No. 3, Second Floor, Shalimar Plaza, F-10 Markaz, Islamabad
- Hours: 09:00 AM to 6:00 PM, Monday to Saturday
- Bank: Bank Alfalah, account title Travel with Moeen Pvt. Ltd., account 1010554099, branch code 0035, IBAN PK31ALFH0035001010554099, branch address 1-B, Awan Arcade, Jinnah Avenue, Blue Area, Islamabad

---

## How the three files relate to the live website

The Excel file and the HTML desk are costing tools for the team. The live site in `data/pricing.ts` is a separate copy of the same idea, with its own numbers.

Same ideas in all three:

- Road or air
- Hotel levels from Deluxe up to Ultra Luxury
- Twin and triple (called 3-share in the spreadsheet)
- Vehicle cost is (rent + fuel) times days, plus toll once
- Nights equal days minus 1
- Air tickets differ for adult, child, lap infant, and infant with a seat
- A margin is added at the end
- Road starts are Islamabad and Lahore, not Karachi

Different numbers:

| Item | Website | Excel examples | HTML desk saved data |
|---|---|---|---|
| Margin | 20 percent | 20 percent | 15 percent |
| People per room | 5 | 2 in the saved examples (typed) | 3 |
| Arrival breakfast | 500 | 500 in the road example | 800 |
| Islamabad air ticket | 60,000 | 60,000 | 50,000 |
| Lahore air add-on | 15,000 | 10,000 | 15,000 |
| Karachi air add-on | 30,000 | 30,000 in an unlabelled cell | 40,000 |
| Welcome pack | 1,400 | 1,500 | 1,500 |
| Entry tickets | 2,500 | 4,000 | 4,000 |
| Sticker | 600 per vehicle | 500 times the number of rooms. The sample quote shows 1,000 because it has 2 rooms | 500 |
| Dinner by hotel level | 1,200 to 3,000 | not a full table on the sample sheets | 1,800 to 4,000 |
| Jeep surcharges | not in the website calculator | not in the sample sheets | yes, for Kalash, Minimarg, Kumrat, and Fairy Meadows |
| Lahore extra after day 3 | declared as 5,000, then set to 0 in code | not shown on the sample quote | 5,000 per vehicle per day, switched on |
