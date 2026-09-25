# Software Proposal

**Document number:** TWM-SOW-001  
**Project:** Travel With Moeen website: content, prices, and guest requests  
**Client:** Travel With Moeen (Pvt) Ltd  
**Prepared for:** Moeen  
**Prepared by:** SoftBuilds Pvt Ltd  
**Version:** 1.0  
**Date:** September 26, 2026  
**Status:** Ready for sign-off  

This document is for Travel With Moeen and SoftBuilds Pvt Ltd. Please do not publish it.

| Version | Date | What changed |
|---|---|---|
| 1.0 | September 26, 2026 | First issue for review and sign-off |

Please read this document and sign Section 23 if you agree. After you sign, this document is the plan we will follow. If you want a change later, please send it in writing.

When you sign, you agree the work, the way we will do it, and the eight-week plan in Section 13.

---

## 1. Purpose of this document

This document says what we will build, what we will leave for later, and how you will know each step is finished.

We wrote it after reading the live website, your Excel price file, the costing page your team already uses, and the answers you and your team gave in writing and in voice messages.

Records kept by SoftBuilds Pvt Ltd are:

- How the website works today
- What is inside the Excel file and the costing page
- Each decision, and where that decision came from

---

## 2. Summary

You already have a public website. Guests read tours, places, and articles, and they ask for a price. Today those words and prices are stored in files. Your office cannot change them without a developer. The contact form does not keep the message. Booking still goes to WhatsApp.

We will keep that public website. We will add a private office area with a login. Your staff will update tours, photos, articles, reviews, and prices there. The first prices will come from your Excel file. You named that file as the price source. After the first load, the Manager keeps the prices up to date.

The work has four steps. Steps 1, 2, and 3 are the first delivery. Step 4 comes later, and it is written here so that limit is clear. From the day you sign, we plan to finish the first delivery in eight weeks. The plan is in Section 13. One price question, about Ratti Gali, is still with you. The eight-week plan does not wait for that answer.

---

## 3. Words used in this document

| Word | Meaning |
|---|---|
| Owner | You, or a person you name. This login can do every office task, including adding and removing staff logins. |
| Manager | The staff login that changes prices, vehicles, jeeps, and the season profit, and that saves quotes. |
| Editor | The staff login that edits public pages and photos, and that cannot change prices. |
| Excel file | `Trip Cost Calculator Final - Copy.xlsx`. This is the price source for the first load. |
| First delivery | Steps 1, 2, and 3. This is what the eight-week plan covers. |
| Twin rate | The hotel price for a room shared by two people. |
| 3-share rate | The hotel price used when more than two people share a room. |
| Prado | The preferred vehicle where that car is offered. |
| Other | A vehicle choice where the office types the real mix, such as a car plus a jeep. |
| Guest request | A contact message, a custom trip request, or a booking request from the website. |
| Step 4 | Later work. It is not part of the first delivery. |

---

## 4. What we found

### 4.1 The website today

The public site is already live. Guests can look at places, tours, photos, and blog posts. They can build a package price and send a custom trip request. The office address, phone number, and social links are typed into the page. They are not easy to change.

Tour text, place guides, articles, photos, reviews, and price tables live in project files. To change a price or a paragraph, someone has to change the code.

The package builder works out a quote on the page. Tour cards show a price for two people leaving from Islamabad. The contact form clears itself and does not save the message. Book Now opens WhatsApp.

### 4.2 The Excel price file

The Excel file is the price source. These sheets hold the rates:

- `Road_DB ISB`: road prices from Islamabad
- `Road_DB LHE`: road prices from Lahore
- `Air_DB`: air vehicles, air hotels, and air extras
- `by air ticket fare`: a short list of passenger types

The sheets `BY ROAD` and `BY AIR` are examples. They show how a total is added up. If the old costing page and this Excel file do not match, we follow the Excel file.

### 4.3 What you have already decided

You and your team have already chosen the hotel grades, how vehicles should work, the start cities, the Karachi air extra, the season profit, and the jeep charges. Those choices are listed in Section 7. We will build them as written.

---

## 5. Objectives

1. Keep the public website your guests already use.
2. Let the office change public pages without a developer.
3. Let the office change prices without a developer, starting from the Excel file.
4. Use one set of price rules, including the season profit.
5. Save guest requests, and still let the guest use WhatsApp.
6. Give price changes and page changes to different roles.

---

## 6. What is in the first delivery

The first delivery is Steps 1, 2, and 3 in Section 12.

### 6.1 Included

- A private office login, with the three roles in Section 8
- Editing of tours, day plans, places, blog posts, gallery, reviews, home page photos, and the phone, address, and social links shown on the site
- A first load of prices from the Excel file
- Price updates by the Manager after that
- The price rules in Section 9
- Four hotel grades on the tour page and in the package builder
- A vehicle list the office can edit, with Prado preferred where that car is offered, and an Other choice for a typed mix
- Paid extras, such as a jeep for Saiful Muluk or Fairy Meadows
- Start-city rules for air and for road
- A switch for 15 percent or 20 percent profit
- Saving of contact messages, custom trip requests, and booking requests
- The WhatsApp button guests already use
- The setup, training, handover, and support described in Sections 10, 14, 15, and 16

### 6.2 Not included in the first delivery

- A new look for the public site
- A new public tour page for Taobat
- New Kashmir, Swat, and Chitral jeep packages
- Hours on each stop, and the labels Comfort, Luxury, Adventure, and Exploration
- Card payment on the website
- A login for guests
- Deleting your Excel file. The file stays with you. We copy the prices from it.

---

## 7. Decisions we will build to

These points are agreed. We will not change them during Steps 1 to 3 unless you send a written change.

| No. | Decision |
|---|---|
| L-01 | The public pages stay, and they keep the same job. They will read from the office system, not from fixed files. |
| L-02 | The first prices come from the Excel file. |
| L-03 | The hotel grades are Deluxe, Executive, Luxury, and Ultra Luxury. Premier is not offered. |
| L-04 | Vehicle types can be edited. Prado is preferred where it is available. Other vehicles can be turned on for a route. |
| L-05 | The office can choose Other and type a mix, for example a Gli car plus a jeep. |
| L-06 | A quote can add a paid extra on top of the main vehicle. |
| L-07 | Air trips can start from Karachi, Lahore, or Islamabad. |
| L-08 | Road trips can start from Lahore or Islamabad only. A guest from Karachi joins the road trip in one of those two cities. |
| L-09 | Karachi air is 30,000 rupees extra, on top of the Islamabad ticket. |
| L-10 | Until the office changes them, the Islamabad air ticket is 60,000 rupees and the Lahore air extra is 10,000 rupees, as written in the Excel file. |
| L-11 | Off-season profit is 15 percent. In-season profit is 20 percent. The Manager can switch it. |
| L-12 | A jeep price is the full amount for the days written on the line. We do not multiply that amount by the number of days again. |
| L-13 | The jeep lines and amounts are in Section 9.3. Each line can be turned off. |
| L-14 | The office uses the three roles in Section 8. Guests do not log in. |

---

## 8. Who can do what

| Action | Owner | Manager | Editor |
|---|---|---|---|
| Add, remove, or change a login | Yes | No | No |
| Delete a tour, a price row, or a guest request | Yes | No | No |
| Edit hotel, vehicle, ticket, and jeep prices | Yes | Yes | No |
| Turn a vehicle on or off for a route | Yes | Yes | No |
| Add an Other vehicle or a paid extra | Yes | Yes | No |
| Switch profit between 15 and 20 percent | Yes | Yes | No |
| Read guest requests and save quotes | Yes | Yes | Read only |
| Edit tours, places, blogs, gallery, reviews, and site details | Yes | No | Yes |
| Mark a tour as featured | Yes | No | Yes |

The Owner is you, or a person you name in writing. Each staff login has one role.

---

## 9. How a price is worked out

These rules follow the examples in the Excel file, and the decisions in Section 7.

### 9.1 The steps

1. Hotel nights equal days minus one. A one-day trip has no hotel night.
2. Vehicle cost equals (daily rent plus daily fuel) times the number of days, plus the toll once, times the number of vehicles.
3. If the group needs more seats than one vehicle has, we add more vehicles.
4. If the office does not type a room count, we divide the people who need a seat by 3 and round up. In the air example, 4 adults need 2 rooms.
5. Hotel cost uses the twin rate. If there are more than two people in a room, we use the 3-share rate. Then we multiply by nights and by rooms.
6. A guide, if selected, is 5,000 rupees per day.
7. Meals, if selected, are charged per adult and per child, per night: Deluxe 1,200, Executive 2,000, Luxury 2,500, Ultra Luxury 3,000.
8. On a road trip longer than one day, arrival breakfast is 500 rupees per adult and per child.
9. An air quote includes a welcome pack of 1,500 rupees and entry tickets of 4,000 rupees, for each adult and each child, plus 800 rupees for each infant. These are the Pack and Entry lines in the Excel file.
10. A child air ticket is 75 percent of the adult fare. An infant on a lap is 1,000 rupees. An infant with their own seat is 5,000 rupees.
11. The air sticker is 500 rupees times the number of rooms.
12. If a road trip starts in Lahore and is longer than three days, we add 5,000 rupees for each day after day three, for each vehicle.
13. We then add profit at 15 percent or 20 percent, based on the season.

### 9.2 The test quote

Before we switch the live prices, this Excel example must give the same total:

- Start: Islamabad
- Place: Skardu Valley
- Days: 5
- People: 2 adults
- Vehicle: Gli car
- Hotel grade: Deluxe
- Guide: no
- Meals: no
- Total in the Excel file, with 20 percent profit: 140,400 rupees

### 9.3 Jeep lines

| Place | Road or air | What the quote says | People per jeep | Amount (PKR) |
|---|---|---|---|---|
| Kalash Valley and Chitral | Road | 4x4 jeep for 3 days | 6 | 90,000 |
| Minimarg Astor Valley | Road | 4x4 jeep for 3 days | 6 | 90,000 |
| Kumrat and Katora Lake | Road | 4x4 jeep | 6 | 16,200 |
| Fairy Meadows Nanga Base Camp | Road and air | Jeep and porter at Raikot | 6 | 18,200 |

We add one jeep for each group of six travelers. The Manager can turn a line off.

---

## 10. How the system will be set up

The public website stays the one guests use today. We do not build a second public site.

We add a private office area on that same website. Staff open it in a browser and sign in with their own email and password. Guests never see this area.

Tours, photos, articles, reviews, prices, and guest requests are stored in a database. The public pages read from that database. When an Editor saves a tour, guests see the change on the public site. When a Manager saves a price, the next quote uses that price.

The first prices are copied in from the Excel file, using the rules in Section 9 and the points in Section 19. After that copy, the Excel file is no longer the live price list. The office system is. You may still keep the Excel file as your own copy.

The site stays on the hosting you use today, unless we agree a hosting change in writing. Office screens in the first delivery are in US English. The public site stays in the language it uses today.

---

## 11. How we will do the work

1. **Keep the public site.** The pages stay. What changes is where the words and prices come from.
2. **One price list.** The first rates are copied from the Excel file. We will not keep the old website price file, or the old costing page, as a second price list.
3. **Match a known total.** Section 9.2 must match before Step 2 is accepted.
4. **Work in steps.** We show you each step and check it against Section 12. The next step starts when you accept the current step, or after five working days with no written objection.
5. **Do not delay the whole project for one place.** Ratti Gali stays on its current website price until you name a price list. The other tours continue.
6. **Changes.** A new page, a new charge, or a change to a decision in Section 7 is a change request. We agree it in writing before we build it.

---

## 12. Steps, what you receive, and how we check it

### Step 1. The office can edit the public pages

**Result.** Staff can change public content, and the website shows the change.

**What you receive**

- An office login
- The Owner, Manager, and Editor roles from Section 8
- Screens to edit tours, places, the blog, the gallery, reviews, and site details
- Public pages that read that content

**How we know it is done**

- An Editor can change a tour title and a photo, and the public tour page shows both.
- An Editor cannot open a price to edit it.
- An Owner can create an Editor login and a Manager login.
- In this step, prices may still be the prices on the site today.

### Step 2. Prices come from the Excel file

**Result.** Quotes use the rules in Section 9 and the prices loaded from Excel.

**What you receive**

- Hotel, vehicle, and air ticket prices loaded from the Excel file
- A screen for the Manager to change a price
- A switch for season profit
- Four hotel grades on the public site
- Vehicle controls, the Other choice, and paid extras
- The jeep lines in Section 9.3
- A written result of the test quote in Section 9.2

**How we know it is done**

- The test quote equals 140,400 rupees at 20 percent profit.
- Switching the season to 15 percent changes only the profit.
- Premier is not offered as a grade guests can book.
- A road quote cannot start from Karachi.
- A Karachi air quote includes the extra 30,000 rupees.
- If you have not yet chosen a list for Ratti Gali, that tour still shows its current website price.

### Step 3. Guest requests are saved

**Result.** The office has a copy of each request. The guest can still use WhatsApp.

**What you receive**

- Saved contact messages
- Saved custom trip requests
- Saved booking requests from Book Now
- A request list, with a status the office can update
- WhatsApp still available on the public site

**How we know it is done**

- A test contact message appears in the office list and stays saved.
- A test booking request appears in the list, and WhatsApp still opens.
- An Editor can read the list and cannot delete an item.
- An Owner can delete a test item.

### Step 4. Later work (not part of the first delivery)

**Result.** Help with how long a day takes, and the extra custom jeep products.

**What you would receive**

- Hours saved for each stop, and a total for the day
- Trip types: Comfort, Luxury, Adventure, Exploration
- Kashmir, Swat, and Chitral jeep products, by air and by road, as custom extras

This step needs a separate written approval after the first delivery is in daily use. It is listed here so it is not treated as part of Steps 1 to 3.

---

## 13. Timeline

The weeks start on the day you sign Section 23. The plan is for one full-time developer. It also allows you up to five working days to review each step.

The first delivery is Step 1, Step 2, and Step 3. The aim is your acceptance of Step 3 at the end of week 8. If you finish a review sooner, the next step starts sooner. If a review is late, or you add a change, the end date moves by the same number of days.

| Week | Work | Working days |
|---|---|---|
| 1 and 2 | Step 1. Office login, three roles, and editing of public pages | 10 |
| 3 | Your review of Step 1 | up to 5 |
| 4 and 5 | Step 2. Excel prices, price rules, and the test quote | 10 |
| 6 | Your review of Step 2 | up to 5 |
| 7 | Step 3. Saved guest requests, with WhatsApp kept | 5 |
| 8 | Your review of Step 3, and acceptance of the first delivery | up to 5 |

Inside these eight weeks, 25 working days are for building. The other 15 working days are for your review. They are not extra build days.

Step 4 is not inside the eight weeks. After the first delivery is in use, and after a separate written approval, Step 4 is another 10 working days of build, plus up to 5 working days of review.

Please do these in week 1. If they come later, the build weeks move by the same delay.

- Sign this document
- Name the Owner, and the first Manager and Editor users
- Confirm that the Excel file named in Section 3 is the file we should load

You do not need to answer the Ratti Gali question in week 1. That tour stays on its current website price until you choose a list.

---

## 14. Quality, safety, and backups

**Who can see guest data.** Guest names, phone numbers, and messages are visible only to people who are logged in with an office role, as in Section 8. They are not shown on the public site.

**Passwords.** Each staff member has their own login. We do not share one password. The Owner can remove a login when someone leaves.

**Backups.** The database is backed up every day. We keep those copies so an incorrect change or a fault can be restored. We will tell you if a restore is needed.

**If the site is down.** We do not promise a new uptime number in this document. We aim to keep the site as available as it is today. If it is down, we check the host, fix the fault that is inside this work, and restore from the daily backup if the data is damaged.

**Browsers.** The office screens and the public site will be checked on current Chrome, Edge, Firefox, and Safari, on a computer and on a phone.

**Excel mistakes.** If a price in the Excel file is blank, zero, or cannot be matched to a place, we follow Section 19. We do not invent a price. We report the row to you.

---

## 15. Training and handover

Before Step 3 is closed, we will show the office how to use the screens.

- One short session for the Owner, covering logins and deletes
- One short session for the Manager, covering prices, vehicles, jeeps, the season switch, and quotes
- One short session for the Editor, covering tours, photos, articles, and reviews
- A short written guide in plain US English, with the same steps

At handover you receive the working office area, the logins you asked for, the data loaded for the first delivery, the written guide, and this signed document.

---

## 16. Support after acceptance

For four weeks after you accept Step 3, we will fix faults in the first delivery. A fault means the system does not do what this document says.

These four weeks do not include new pages, new charges, or Step 4. Those are change requests. After the four weeks, further help is agreed in writing.

---

## 17. Who owns the work

Your existing website, your photos, your tour text, your Excel file, and your guest data stay yours.

The office system built under this document is yours. Your existing website will stay online and will stay yours.

SoftBuilds Pvt Ltd may reuse general methods that are not special to Travel With Moeen. We will not reuse your prices, your guest list, or your private files.

---

## 18. How we will keep you informed

You will get a short written update once a week while Steps 1 to 3 are in progress. The update will say what was finished, what is next, and any item waiting on you.

At the end of each step we will show you the checks in Section 12. You can try them with a staff member, as in Section 22.

Questions during the build can be sent in writing. We will reply in writing so the record stays clear.

---

## 19. Assumptions

1. You will name the Owner and the first Manager and Editor users in week 1. If the names come later, the build weeks move by the same delay.
2. We will load the Excel file named in Section 3, unless you send a replacement file in writing.
3. If a vehicle row has a price and an empty place name, we attach it to the place named on the row above, when the vehicle and the rates are filled in. A row stored as zero is not a live price.
4. The Skardu and Hunza air hotel row with no grade name (twin 24,000, 3-share 28,000) will be loaded as Executive. It sits in the Executive place on the sheet, and the hotel names match the Executive line on the road sheet.
5. Taobat keeps the prices already stored under the name Neelum Taobat Arang Kel. It does not get a new public tour page in the first delivery.
6. You will check each step against Section 12. If we show you a step and you do not write an objection within five working days, we treat that step as accepted.
7. The site stays on your current hosting, unless we agree a hosting change separately.
8. The office screens in the first delivery are in US English.

---

## 20. What we still need from you

We have asked you to choose the price list for Ratti Gali only.

The Excel file has no Ratti Gali row. The website has a three-day road tour, code 201. On the Lahore sheet, a Neelum Deluxe twin room is 6,000 rupees. A Naran Deluxe twin room is 15,000. A Swat Deluxe twin room is 9,000. The voice message on September 25 at 11:41 said to copy Naran or Swat. Those two lists are not the same, so we need you to name one list.

Until you reply:

- Taobat keeps its own rows in the Excel file
- Ratti Gali keeps the price already on the website
- Steps 1 to 3 will start as planned

We do not need any other decision from you to start Step 1.

---

## 21. Risks

| Risk | Level | What can go wrong | What we will do |
|---|---|---|---|
| You do not choose a list for Ratti Gali | Medium | That one tour cannot move to an Excel price | Leave the current website price. Do not delay the rest. |
| Some Excel rows have an empty place name, or a zero price | Medium | A vehicle can be missed, or a zero can be shown as a real price | Use point 3 in Section 19. Tell you about any row we still cannot place. |
| The season profit is switched at the wrong time | Medium | Quotes use 15 percent in season, or 20 percent out of season | Only the Owner and the Manager can switch it. The active rate is shown on the quote screen. |
| Staff share one login | Low | We cannot tell who made a change | Give one login to each person, with one role. |
| New products are asked for during Steps 1 to 3 | Medium | The first delivery date moves | Treat them as a written change, or as Step 4. |

Level means how much this can affect the first delivery. High would stop the release. None of the rows above are High.

---

## 22. What we need you to do

1. Name the Owner, and the first Manager and Editor users.
2. Sign this document, or mark the sections you do not accept.
3. Reply on the Ratti Gali price list when you are ready.
4. Ask a staff member to try each step against Section 12.
5. Keep your Excel file if you still want a spreadsheet copy. We will not delete it.

---

## 23. Sign-off

By signing, you confirm that Sections 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, and 19 are the agreed first delivery, the agreed schedule, and the agreed rules for setup, quality, training, support, ownership, updates, and assumptions.

Section 6.2 and Step 4 are not part of that first delivery.

| Role | Name | Signature | Date |
|---|---|---|---|
| Client, Travel With Moeen | Moeen | | |
| SoftBuilds Pvt Ltd | | | |

**End of document. TWM-SOW-001. Version 1.0. September 26, 2026.**
