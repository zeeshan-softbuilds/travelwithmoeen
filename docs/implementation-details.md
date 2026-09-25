# Implementation details of the current codebase

This document records how the Travel With Moeen website is built right now. It describes the code, the data files, and the rules those files follow. It is a snapshot of the current implementation.

The product is a Pakistan tour website. The company details below are hardcoded in the navbar and the footer. They are not loaded from a database.

Office: Office 3, 2nd Floor, Shalimar Plaza, F-10 Markaz, Islamabad  
Phone and WhatsApp: +92 333 9981177  
Email: info@travelwithmoeen.com

Social pages: Facebook (Travel with Moeen), Instagram (travelwithmoeen), YouTube (itsmoeen), TikTok (travelwithmoeen).

---

## Stack, data, and layout

The site is a Next.js website. Next.js is a tool for building web pages with React.

There is no database. There is no admin panel. There is no server that sends tour data when someone opens a page.

All tours, prices, blogs, photos lists, and reviews live in files inside the `data` folder. The browser reads those files and draws the page.

Almost every page is built in the browser (the code says `"use client"`). That means the page content is prepared on the visitor's computer, not fetched from a company server.

The main layout file is `app/layout.tsx`. It puts the same pieces on every page:

- the top menu (navbar)
- the page content
- the footer
- a button that scrolls back to the top
- small popup messages (toasts)

Colors are set in `app/globals.css`.

- Page background is a cream color, `#faf9f5`.
- Navy is the dark blue used for headings and buttons.
- Gold is the yellow accent color.

A dark color set exists in the same file, but the site has no button to turn dark mode on.

The config file `next.config.ts` is empty. The project uses the default Next.js settings.

---

## Navbar and footer implementation

The top menu links are:

- Home (`/`)
- Destinations (`/destinations`)
- Tours (`/tours`)
- About (`/about`)
- Gallery (`/gallery`)
- Blog (`/blog`)
- Contact (`/contact`)

There is also a button called **Plan my trip**. It goes to `/customize-trip`.

The top bar shows the phone number, the email, and the social links.

One small mistake: the phone link in the mobile menu still points to `tel:+1234567890`. That is a placeholder number. The real number shown on the page is +92 333 9981177.

The footer repeats the company name, a short description, social links, quick links, support links, and the office address.

Support links:

- FAQs (`/faq-page`)
- Privacy Policy (`/PrivacyPolicy`)
- Terms of Service (`/TermsAndConditions`)
- Travelers Instructions (`/TravelersInstructions`)
- Cancellation (`/Cancellation`)

---

## Routes implemented in app/

| Route | What this route renders |
|---|---|
| `/` | Home page |
| `/tours` | List of all tours, with filters |
| `/tours/[id]` | One tour: photos, day plan, price, WhatsApp booking |
| `/tours/[id]/template` | A PDF of that tour, made in the browser |
| `/destinations` | List of 8 places |
| `/destinations/[slug]` | A long article about one place |
| `/blog` | List of 8 articles |
| `/blog/[slug]` | One article |
| `/gallery` | Photo gallery |
| `/calculator` | The same price builder that is on the home page |
| `/customize-trip` | A form that emails a custom trip request |
| `/about` | Company story |
| `/contact` | Office details and a contact form |
| `/faq-page` | Six common questions |
| `/PrivacyPolicy` | Privacy text |
| `/TermsAndConditions` | Terms text |
| `/TravelersInstructions` | Instructions for travelers |
| `/Cancellation` | Cancellation text |

The words in square brackets are not typed by the visitor. `[id]` is the tour name in the link. `[slug]` is the short name of a destination or a blog post.

Example: the Islamabad day tour lives at `/tours/1_day_by_road_trip_to_islamabad`.

---

## Home page implementation

The home page file is `app/page.tsx`. These blocks are on the page, from top to bottom.

1. **Hero.** A large photo slider. Four photos change every 3 seconds. The files are `hero1.webp` to `hero4.webp` inside `/images/hero_image/`.
2. **Search bar (FilterBar).** The visitor picks a region, a trip length, a hotel level, and road or air. The Search button opens the tours page with those choices in the link.
3. **Photo strip (FanGallery1).** A row of travel photos.
4. **Tour types (TourCategories).** Five boxes. Each box opens the tours page with a group of regions already selected.
5. **Package builder (PackageCalculator).** The visitor builds a trip and sees a price right away.
6. **WhatsApp popup.** The first time the package builder scrolls into view, a popup image appears. Clicking it opens WhatsApp. It shows only once per browser session.
7. **Popular destinations.** A slider of the 8 destination records from `data/destinations.ts`.
8. **Popular tours.** This block is on the page, but it is empty. It only shows tours marked as featured. Every tour is marked `featured: false`.
9. **Reviews.** Seven customer reviews. All of them are 5 stars.
10. **Gallery.** A few photos from the gallery list.
11. **Latest blogs.** Recent articles from the blog file.

Some older home blocks are still in the code, but they are turned off with comments. They do not show on the page. Those are HeroSection, SearchBar, AboutSection, PopularDestinations, TourPlans, FeatureImages, and FanGallery.

### The five tour type boxes

Each box sends the visitor to `/tours` with a list of regions.

- **Cultural:** Kalash Valley and Chitral
- **Adventure:** Swat, Skardu and Hunza, Hunza, Skardu, Naran
- **Nature and Wildlife:** Kumrat, Minimarg Astor, Neelum
- **Hiking:** Ratti Gali, Kumrat, Fairy Meadows
- **City Tour:** Islamabad, Murree Ayubia, Murree Patriata

### Home search bar

The search bar has four choices:

- Destination (the region names that exist on tours)
- Duration: 1 to 3 days, 4 to 5 days, 6 to 7 days, or 8 to 10 days
- Plan category: Deluxe, Executive, or Luxury, and only if a tour actually uses that word
- Transport: By Road or By Air

Search opens a link like this:

`/tours?region=Skardu%20Valley&duration=6-7&category=Deluxe&transport=By%20Road`

Only the fields the visitor filled in are added to the link.

---

## Tour data model

All live tours are in `data/tours.ts`. There are 32 tours.

Each tour is one object with these fields:

- **id.** The name used in the web address.
- **code.** A short package number, such as 101 or 253. It is shown on the card and sent in the WhatsApp message.
- **name.** The title people read.
- **location.** A short place name, such as "Murree and Patriata".
- **region.** The official area name used by filters and by the price tables. Example: "Skardu Valley".
- **duration.** Number of days.
- **description.** A short paragraph on the tour card.
- **transport.** Either "By Road" or "By Air".
- **image.** The main photo.
- **galleryImages.** More photos.
- **pdf.** A path to an old PDF file. The download button that used this file is turned off. The site now builds a PDF in the browser instead.
- **categories.** Labels such as Deluxe, Executive, or Couple. These are badges on the card. The price tabs do not follow this list. Longer tours always show five hotel levels.
- **packageTypes.** Words such as Couple, Family, or Group. They are stored. The pages do not use them to filter.
- **basePrice.** A stored rupee number. The filter slider and the sort buttons use this number. The price printed on the card is usually a different, calculated number.
- **packages.** An old list of category, price, and features. The tour detail page does not use this list. The PDF page replaces it with a fresh calculated price before it draws the PDF.
- **itinerary.** The day by day plan. Each day has a number, a title, a description, and a list of highlights.
- **included.** What the price covers.
- **notIncluded.** What the visitor pays extra for.
- **featured.** True or false. All 32 tours are false, so the Popular Tours block stays empty.

There are 21 road tours and 11 air tours.

### Full tour list

Prices in this table are the stored `basePrice`. The price on the card is calculated again for 2 people leaving from Islamabad. Those two numbers are often different.

| Code | Days | Road or air | Region | Stored price (PKR) | Name |
|---|---|---|---|---|---|
| 101 | 1 | Road | Islamabad | 25,000 | 1 day Islamabad |
| 111 | 1 | Road | Murree Patriata | 50,000 | Murree and Patriata (family) |
| 102 | 2 | Road | Islamabad | 40,000 | Islamabad city tour |
| 112 | 2 | Road | Murree Patriata | 50,000 | Murree and Galiyat |
| 131 | 3 | Road | Neelum Valley | 110,000 | Leepa Valley and Ganga Choti |
| 113 | 3 | Road | Murree Ayubia | 120,000 | Murree and Ayubia |
| 121 | 3 | Road | Naran Kaghan | 24,000 | Naran, Kaghan, and Babusar |
| 132 | 3 | Road | Neelum Valley | 24,000 | Neelum Valley |
| 141 | 3 | Road | Swat | 20,000 | Swat, Kalam, Malam Jabba |
| 201 | 3 | Road | Ratti Gali Lake | 150,000 | Ratti Gali Lake |
| 151 | 4 | Road | Kalash and Chitral | 25,000 | Kalash and Bumburet |
| 161 | 4 | Road | Kumrat | 20,000 | Kumrat and Katora Lake |
| 114 | 4 | Road | Murree Ayubia | 100,000 | Murree and Ayubia |
| 122 | 4 | Road | Naran Kaghan | 120,000 | Naran, Kaghan, and Babusar (couple) |
| 133 | 4 | Road | Neelum Valley | 150,000 | Neelum Valley (couple) |
| 142 | 4 | Road | Swat | 110,000 | Swat, Kalam, Malam Jabba (family) |
| 221 | 4 | Air | Skardu Valley | 300,000 | Skardu private tour |
| 202 | 5 | Air | Minimarg Astor | 430,000 | Astor, Minimarg, and Skardu |
| 211 | 5 | Air | Fairy Meadows | 450,000 | Fairy Meadows and Skardu |
| 222 | 5 | Air | Skardu Valley | 330,000 | Skardu private tour |
| 241 | 5 | Air | Hunza Valley | 350,000 | Hunza private tour |
| 191 | 5 | Road | Fairy Meadows | 210,000 | Fairy Meadows by road |
| 203 | 6 | Air | Minimarg Astor | 530,000 | Astor, Minimarg, and Skardu |
| 182 | 6 | Road | Hunza Valley | 270,000 | Hunza and Khunjerab Pass |
| 251 | 6 | Air | Skardu and Hunza | 450,000 | 1 day Skardu and 5 days Hunza |
| 223 | 6 | Air | Skardu Valley | 360,000 | Skardu private tour |
| 171 | 6 | Road | Minimarg Astor | 290,000 | Minimarg, Astor, and Skardu |
| 224 | 7 | Air | Skardu Valley | 400,000 | Skardu for a couple |
| 172 | 7 | Road | Skardu Valley | 240,000 | Skardu and Deosai |
| 252 | 8 | Air | Skardu and Hunza | 435,000 | Hunza and Skardu |
| 253 | 10 | Air | Skardu and Hunza | 550,000 | Skardu and Hunza for a couple |
| 200 | 10 | Road | Skardu and Hunza | 325,000 | Hunza and Skardu for a couple |

Some stored prices are very low for a multi day northern trip (about 20,000 to 25,000). The card does not show that low number when a real calculation exists. The sidebar price slider still uses the stored number. A visitor who sets a low maximum price can hide a tour whose card shows a much higher price.

---

## Tours list implementation

File: `app/tours/page.tsx`.

The page shows 12 tours at a time, with page numbers at the bottom.

It reads these values from the web address:

- `region` for one region
- `regions` for several regions, separated by commas (the home category boxes use this)
- `duration` such as `4-5`
- `category` such as Deluxe
- `transport` such as By Road

The left filter box can change:

- price, from 0 to 1,000,000 PKR, in steps of 5,000
- region
- road or air
- trip length: 1 to 3, 4 to 5, 6 to 7, or 8 to 10 days

The category checkboxes in that filter box are turned off in the code. The home search can still send a category, and the list will obey it. The visitor cannot change the category from the sidebar.

Search looks at the tour name and the location text. It does not look at the region name.

Sort choices:

- Latest: the order in the file
- Oldest: that order reversed
- Price low to high: uses the stored `basePrice`
- Price high to low: uses the stored `basePrice`

If the visitor picks only By Road, the region list is the road list. That list includes "Neelum Taobat Arang Kel" even though no tour uses that region.

If the visitor picks only By Air, the regions shrink to Skardu, Hunza, Skardu and Hunza, Minimarg Astor, and Fairy Meadows.

### The tour card

File: `components/TourCard.tsx`.

The card shows the photo, the package code, the category badges, the name, the location, the number of days, a short description, and a price.

The price is the Deluxe price for 2 people from Islamabad. The words under it say "For 2 Persons". If that calculation fails, the card shows `basePrice` instead.

The button **View Details** opens `/tours/` plus the tour id.

A gold "Featured" badge appears only when `featured` is true. No tour has that flag today.

---

## Tour detail implementation

File: `app/tours/[id]/page.tsx`.

If the id is not in the tour list, the page says the tour was not found and links back to all tours.

When the tour exists, the page shows:

- a large photo
- category badges, the tour name, the location, and the number of days
- a button back to all tours
- the day by day plan (Tour Overview)
- a package code
- a **View File** link that opens the PDF page in a new tab
- a photo gallery
- a button to expand or collapse all days
- two lists: what is included, and what is not included
- a price box that stays on screen while you scroll

The old "View Template" button near the top is turned off. The working link is **View File** inside the overview.

### Price tabs

For a 1 day tour, only Deluxe is shown.

For a longer tour, five tabs are shown:

- Deluxe
- Premier
- Executive
- Luxury
- Ultra Luxury

Each tab shows:

- a starting price for 2 people
- the vehicle name
- the hotel name, when the price table has one
- a **Book Now** button

Book Now opens WhatsApp. The message includes the package code, the tour name, the hotel level, the hotel name, and the price in PKR.

The price is always calculated for 2 adults, one twin room, leaving from Islamabad. The visitor cannot change the group size on this page. For a custom group, they use the package builder or the custom trip form.

---

## Couple price function

File: `lib/calculatePackagePrice.ts`.

This function is used by the tour card, the tour page, and the PDF page.

It always assumes:

- 2 adults
- 1 twin room
- departure city Islamabad

Steps, in plain words:

1. Nights equal days minus 1. A 1 day tour has 0 nights, so the hotel cost is 0.
2. Hotel cost equals the twin room rate times the number of nights.
3. The vehicle is chosen for 2 people. By road that is a Gli car. By air that is a Parado.
4. Vehicle cost equals (daily rent plus fuel) times the number of days, then plus the toll once.
5. By road, if the trip is longer than 1 day, add 500 PKR breakfast for each of the 2 people.
6. By air, add these extras for the couple:
   - air tickets: 60,000 PKR times 2
   - welcome pack: 1,400 PKR times 2
   - entry tickets: 2,500 PKR times 2
   - one vehicle sticker: 600 PKR
7. Add those parts together. That is the subtotal.
8. Add 20 percent profit. Round that profit to the nearest rupee.
9. The total for two people is subtotal plus profit.
10. The per person figure is that total divided by 2, then rounded.

Air ticket surcharges for Lahore and Karachi are not used here, because this function always starts from Islamabad.

If the region has no hotel price, the function returns nothing.

- The card then shows the stored `basePrice`.
- The tour page tab shows 0, and the vehicle label falls back to "GLI Car New Model".

Ratti Gali Lake is in this situation. It has a tour (code 201), but it has no row in the hotel table and no row in the vehicle table.

---

## Package builder implementation

Files: `components/home/PackageCalculator.tsx` and the function `calculateTripPrice` in `data/pricing.ts`.

The same builder is on the home page and on `/calculator`.

This one lets the visitor change the group size, the city, the hotel level, and the vehicle. It is the full quote.

### The controls

1. **Transport.** By Road or By Air. Changing this clears the destination, sets the city back to Islamabad, and sets the days to 2.
2. **Departure city.** Islamabad, Lahore, or Karachi. This list is the same for road and air.
3. **Destination.** 14 road areas, or 5 air areas.
4. **Days.** When a destination is picked, the days jump up to that area's minimum if the current number is too small.
5. **Travelers.** Adults (12 and older), children (2 to 11), infants on a lap, and infants with their own seat.
6. **Hotel level.** Deluxe, Premier, Executive, Luxury, or Ultra Luxury.
7. **Vehicle.** The builder picks a recommended vehicle when the destination changes. The visitor can change it.
8. **Room type.** Twin (the rate for 2 people in a room) or Triple (the rate for 3). This chooses which nightly rate to use. It does not change how many rooms are booked. Room count is worked out from the number of people.
9. **Optional add ons the visitor can tap.** Only Guide and Meals.

Some costs are added without a button:

- By air, welcome pack and entry tickets are included. A note on the form says so.
- By road, if the trip is longer than 1 day, arrival breakfast is included at 500 PKR per person. A note on the form says so.
- If the vehicle is a Coaster, the guide is required. The visitor cannot turn it off.

### The formula

Words used below:

- **All people** means adults, children, lap infants, and infants with a seat.
- **Seats** means adults, children, and infants with a seat. A lap infant does not take a seat.
- **Nights** means days minus 1. A 1 day trip has 0 hotel nights.

Steps:

1. Rooms equal all people divided by 5, rounded up. The rule in the code is a maximum of 5 people per room.
2. Hotel cost equals the nightly rate times nights times rooms. Twin uses `twin_rate`. Triple uses `triple_rate`. If a rate is missing, the code uses 10,000 for twin and 12,000 for triple.
3. Number of vehicles equals seats divided by the seats in that vehicle, rounded up.
4. Vehicle cost equals ((daily rent plus fuel) times days, plus toll) times the number of vehicles.
5. Air tickets, only for By Air:
   - adult fare starts at 60,000 PKR
   - add 30,000 if the city is Karachi
   - add 15,000 if the city is Lahore
   - adults pay 100 percent of that fare
   - children pay 75 percent
   - a lap infant pays 1,000 PKR
   - an infant with a seat pays 5,000 PKR
6. Meals, if selected: the meal rate for that hotel level, times nights, times all people.
7. Guide, if selected: 5,000 PKR times the number of days.
8. Sticker, By Air only: 600 PKR times the number of vehicles.
9. Add hotel, vehicle, tickets, add ons, and sticker.
10. Add 20 percent. That is the grand total.
11. Per person is the grand total divided by all people, then rounded.

### Meal rates per person per night

| Hotel level | PKR per person per night |
|---|---|
| Deluxe | 1,200 |
| Premier | 1,500 |
| Executive | 2,000 |
| Luxury | 2,500 |
| Ultra Luxury | 3,000 |

The add on list also stores a meal price of 1,200. The calculator does not use that stored 1,200. It uses the table above.

### Which vehicle is suggested

| Number of people | By road | By air |
|---|---|---|
| 1 to 4 | Gli car (4 seats) | Parado, up to 5 people (5 seats) |
| 5 to 6 | Honda BRV (6 seats) | Parado for 5, then Grand Cabin |
| 7 to 12 | Grand Cabin (12 seats) | Grand Cabin |
| 13 to 20 | Coaster 4c | Coaster 4c |
| 21 and above | Coaster 5c | Coaster 4c |

In the road and air tables, both coasters are stored with 25 seats. The suggestion rules above still follow the bands in the code comments (coaster from 13 people).

A guide is required for Coaster 4c and Coaster 5c. It is optional for the smaller cars.

### Shortest trip allowed

| Destination | Minimum days by road | Minimum days by air |
|---|---|---|
| Islamabad | 1 | not offered by air |
| Murree Ayubia | 2 | not offered by air |
| Murree Patriata | 2 | not offered by air |
| Naran Kaghan and Babusar | 3 | not offered by air |
| Neelum Valley | 3 | not offered by air |
| Swat, Kalam, and Malam Jabba | 3 | not offered by air |
| Neelum, Taobat, and Arang Kel | 4 | not offered by air |
| Kumrat and Katora Lake | 4 | not offered by air |
| Hunza Valley | 5 | 5 |
| Fairy Meadows and Nanga Base Camp | 5 | 5 |
| Skardu Valley | 6 | 4 |
| Minimarg Astor Valley | 6 | 5 |
| Kalash Valley and Chitral | 6 | not offered by air |
| Skardu and Hunza | 8 | 6 |

### Hotel rates

Each destination and each hotel level has two nightly rates: twin and triple. Many also have a hotel name. The hotel name is often several hotels written in one line, separated by slashes. That whole line is what the tour page and the quote show.

Road twin rates are usually:

- Deluxe: 10,000
- Premier: 13,000
- Executive: 19,000
- Luxury: 30,000
- Ultra Luxury: 50,000

Triple rates are higher than twin rates. Air rates are in a separate table. For Skardu and Hunza by air, Ultra Luxury is higher than the usual road rate: twin 60,000 and triple 70,000.

Example hotel line for Skardu Valley, Deluxe, by road:

Tarangfa Lodges Chilas or Indus Hotel / Hotel Himalaya / Al Noor Starlet Hotel / Dirleh Resort / (Deluxe room) / Demanchi Naran Valley

### Vehicle rates

A vehicle rate has:

- daily rent
- fuel per day
- toll (paid once, not per day)
- number of seats
- a stored per day total (the calculator does not use this stored total; it adds rent and fuel itself)

Road rates are stored under two keys only:

- `Departure_Islamabad`
- `Departure_Lahore`

There is no `Departure_Karachi` table. Karachi is still offered in the city list. If the visitor picks Karachi by road, the code cannot find a vehicle rate. It then uses backup numbers: rent 14,000, fuel 10,000, toll 4,000, and 4 seats. Those backup numbers are not a real Karachi price list.

Example, Skardu Valley from Islamabad:

| Vehicle | Daily rent | Fuel | Toll | Seats |
|---|---|---|---|---|
| Coaster 5c | 17,000 | 18,000 | 6,000 | 25 |
| Coaster 4c | 16,000 | 18,000 | 6,000 | 25 |
| Grand Cabin | 12,000 | 13,000 | 5,000 | 12 |
| Honda BRV | 9,000 | 10,000 | 4,000 | 6 |
| Gli car | 7,000 | 7,000 | 3,500 | 4 |

Air vehicle rates are stored per destination, not per departure city. The air ticket surcharge carries the city difference. Example for Skardu by air, Parado: rent 8,000, fuel 7,000, toll 2,500, 5 seats.

### Costs that are written in the file but not added

Two road costs are declared and then ignored:

- Lahore surcharge: 15,000 PKR once per trip
- Lahore challan: 5,000 PKR once, if the trip is longer than 3 days

In the calculator function, both of these totals are set to 0. Lahore and Karachi change the air ticket only. They do not add an extra road charge.

### Matching tours under the quote

After a quote, the builder can list tours that match. The match compares the tour's **location** text with the destination name. It does not compare the official **region** name.

If the destination is "Skardu Valley" and a tour location is only "Skardu", that tour will not match.

### WhatsApp message from the builder

The message includes transport, city, destination, days, hotel level, vehicle (and how many vehicles), room type, the traveler counts, the names of Guide and Meals if they are on, the grand total, and the price per person.

Arrival breakfast is in the price, but its name is not in that message. The message only looks up names in the short add on list, and arrival breakfast is stored in a different list.

---

## Destination data

File: `data/destinations.ts`.

There are 8 destination records. Each one has a title, a short link name (slug), a short summary, a banner photo, a location, a list number, and sections of text.

A section can have a heading, a paragraph, a photo, and a highlight list (bullet points).

| No. | Title | Link name |
|---|---|---|
| 1 | Skardu Valley | skardu-valley |
| 2 | Hunza Valley | hunza-valley |
| 3 | Astor Valley, Minimarg | astor-valley-minimarg |
| 4 | Naran Kaghan and Babusar Top | naran-kaghan-babusar-top |
| 5 | Kumrat Valley | kumrat-valley |
| 6 | Chitral Valley | chitral-valley |
| 7 | Neelum Valley | neelum-valley |
| 8 | Swat Valley, Kalam and Malam Jabba | swat-valley-kalam-malam-jabba |

The detail page waits 1.2 seconds and shows a loading skeleton, then the article. The data is already in the file. The wait is only for the loading look.

---

## Blog data

File: `data/blog.ts`.

There are 8 articles. All of them use the date 9 February 2026. The author name on every article is "Travel Desk".

The shape is the same as a destination: title, slug, summary, author, date, cover photo, and sections. A section can have a heading, body text, a photo, and a highlight list.

The articles are:

- Top 10 Incredible Glaciers in Pakistan (2026 Guide)
- The 2026 guide to Fairy Meadows and Nanga Parbat
- Pakistan's most beautiful lakes
- Top 20 tourist attractions in northern Pakistan
- National symbols of Pakistan
- Pakistan's national parks
- The Indus River
- The Kalash festivals 2026

The article page also waits 1.2 seconds before it shows the text, for the same loading look.

---

## Gallery and review data

Gallery file: `data/gallery.ts`. There are 16 photos.

Each photo has an id, a file path, a short description, and a category of either `private` or `group`. Some photos are marked tall, wide, or large so the layout can mix sizes. A photo marked `homeOnly` is for the home gallery and is kept off the main gallery page.

Reviews file: `data/testimonials.ts`. There are 7 reviews. Each one has a name, a photo URL (from Google), a short text, and a rating of 5. The location field is empty on all of them.

The names are:

- Malik Ateeq Awan
- Talib Hussain Arabpa
- khatib UL ghafoor
- Adnan Hizbullah
- Tamkeen Zaffar
- Adeel Raza
- Muhammad Afaq Baloch

---

## Custom trip form implementation

File: `app/customize-trip/page.tsx`.

This form does not calculate a price. It sends an email so the team can reply with a quote.

The visitor fills in:

- Air or Road
- Trip category: Family, Solo, Couple Honeymoon, Corporate, or University, school, or college
- Full name
- Email
- WhatsApp number, with a country code (default +92)
- Nationality (default Pakistan)
- Departure city: Islamabad, Lahore, Karachi, or Other (with a box to type the city)
- Trip type: Adventure, Sightseeing, Hiking and Trekking, Food and Cultural, Honeymoon, Safari, or Adventure plus Sightseeing
- Dates in Pakistan: departure and return
- Dates from abroad: arrival and return
- Duration in days
- Number of adults and children
- Places, grouped like this:
  - Gilgit Baltistan: Skardu, Hunza, Astor Minimarg, Fairy Meadows
  - KPK: Naran Valley, Kalash Valley, Swat Kalam, Kumrat Valley
  - Kashmir: Neelum Valley, Ratti Gali, Arangkel, Taobat Valley
- Hotel level: Deluxe, Premier, Executive, Luxury, or Ultra Luxury
- Room type: Master Bed, Twin Beds, or Triple bed
- Number of rooms
- Extra notes

The form sends the message with EmailJS. The service id is `service_3aeq96g`. The template id is `template_hi5ldme`. On success, a message says the team will reply within 24 hours. On failure, it asks the visitor to try again or call the office.

---

## Contact page implementation

File: `app/contact/page.tsx`.

The page shows the office address, phone, email, and working hours.

- Monday to Saturday: 9:00 AM to 6:00 PM
- Sunday: the office is closed, but the team says they are open online

The form asks for name, email, subject, and message. When the visitor sends it, the page waits 1 second and then clears the boxes. It does not email anyone. The only form that really sends a message is the custom trip form.

---

## About, FAQ, and legal pages

The About page tells the company story, services, and how booking works. It is a long static page. Its own navbar and footer are commented out, because the main layout already shows them.

The FAQ page has six questions:

1. Which places does the company cover?
2. What is included in a package?
3. How do I book?
4. What is the cancellation policy?
5. Do you offer private or custom tours?
6. Is travel in the northern areas safe?

The answers are general. They point people to the office or to the booking talk for exact rules.

Privacy, terms, traveler instructions, and cancellation are static text pages.

---

## PDF template implementation

Address: `/tours/[id]/template`.

File: `app/tours/[id]/template/page.tsx` and `components/tours/TourTemplate.tsx`.

Before the PDF is drawn, the page recalculates every hotel level for 2 people from Islamabad. It replaces the old package list with those new prices. Then the PDF tool (jsPDF) draws a document with the cover, the price, what is included, the day plan, and the photos.

The visitor opens this from **View File** on the tour page. The direct download of the old PDF file in `/images/pdf/` is turned off.

---

## Data files not imported by the app

These files are in the `data` folder, but no page imports them. They are older copies.

- `tours_old.ts`
- `toursLatest.ts`
- `pricing_old.ts`
- `pricing_old_1.ts`
- `pricing_copy.ts`
- `hotelPricing.ts`
- `vehiclePricing.ts`
- `hotel_pricing.json`
- `vehicle_pricing.json`

The live tour list is `data/tours.ts`. The live price list is `data/pricing.ts`.

Two other files in the project root are for load testing, not for visitors:

- `locustfile.py` opens the home page and the about page many times
- `test.js` is a k6 script that opens `https://travelwithmoeen.com`

---

## Current gaps in the implementation

These are the gaps in the current site. They change what a visitor sees or what number they get.

1. **Popular Tours is empty.** The block only shows tours with `featured: true`. Every tour is false.
2. **Two different prices.** The slider and the sort use the stored `basePrice`. The card and the tour page use a calculated price for 2 people.
3. **Ratti Gali has a tour and no price row.** Code 201 exists. The hotel table and the vehicle table do not have Ratti Gali. The calculated price comes back empty. The card falls back to the stored 150,000 PKR.
4. **Neelum Taobat has prices and no tour.** The road price tables include it, with a minimum of 4 days. No tour uses that region name.
5. **Karachi by road has no vehicle table.** The builder still lists Karachi. The quote then uses backup rent, fuel, toll, and seat numbers.
6. **Lahore road extras are not added.** The file defines a 15,000 PKR Lahore surcharge and a 5,000 PKR challan. The calculator sets both to 0.
7. **The contact form does not send.** Only the custom trip form sends an email.
8. **The mobile menu phone link is a fake number.** It is `+1234567890`. The number printed on the page is the real one.
9. **The package builder matches tours by location text, not by region name.** Some real tours can be missing from that list.

---

## Source map

| What | File |
|---|---|
| Shared menu, footer, fonts | `app/layout.tsx` |
| Home page | `app/page.tsx` |
| Tour list | `app/tours/page.tsx` |
| One tour | `app/tours/[id]/page.tsx` |
| PDF page | `app/tours/[id]/template/page.tsx` |
| Package builder | `components/home/PackageCalculator.tsx` |
| Price for a fixed couple package | `lib/calculatePackagePrice.ts` |
| Full quote math and rate tables | `data/pricing.ts` |
| All tours | `data/tours.ts` |
| Destination articles | `data/destinations.ts` |
| Blog articles | `data/blog.ts` |
| Gallery list | `data/gallery.ts` |
| Reviews | `data/testimonials.ts` |
| Custom trip email form | `app/customize-trip/page.tsx` |
| Colors | `app/globals.css` |
