
export type TourCategory =
  | "Deluxe" | "Deluxe_higher" | "deluxe_higher" | "Deluxe Higher" | "deluxe_lower"
  | "Premier" | "Ultra Luxury"
  | "Executive" | "executive" | "executive_higher"
  | "Luxury" | "Luxury Higher" | "luxury_higher" | "luxury_lower"
  | "Single" | "Solo" | "Couple" | "Family" | "Group" | "Private"
  | "group" | "group_single" | "group_solo" | "group_couple";

export type TourRegion =
  | "Skardu Valley"
  | "Skardu & Hunza" | "Hunza Valley" | "Minimarg Astor Valley" | "Fairy Meadows Nanga Base Camp" | "Murree Patriata Galiyat" | "Murree Ayubia Nathiagali" | "Naran Kaghan & Babusar Top" | "Neelum Valley Kashmir" | "Neelum Taobat Arang Kel" | "Ratti Gali Lake" | "Swat Kalam & Malam Jabba" | "Islamabad" | "Kalash Valley & Chitral" | "Kumrat and Katora Lake";


export type PackageType = "Couple" | "Family" | "Group" | "City Tour" | "Private";
export type TransportType = "By Road" | "By Air";

export interface TourPackage {
  category: TourCategory;
  price: number;
  features: string[];
}

export interface TourDay {
  day: number;
  title: string;
  description: string;
  highlights: string[];
}

export interface Tour {
  id: string;
  name: string;
  location: string;
  region: TourRegion;
  duration: number; // in days
  description: string;
  image: string;
  pdf: string;
  code: string;
  galleryImages: string[];
  categories: TourCategory[];
  packageTypes: PackageType[];
  transport: TransportType;
  basePrice: number;
  packages: TourPackage[];
  itinerary: TourDay[];
  included: string[];
  notIncluded: string[];
  featured?: boolean;
  priceSource?: "excel" | "website";
  couplePrice?: number;
  offers?: { category: string; price: number; vehicle: string; hotelName: string }[];
}



export const tours: Tour[] = [
  {
    "id": "1_day_by_road_trip_to_islamabad",
    "name": "1 Day By Road Trip to Islamabad",
    "location": "Islamabad Capital Territory",
    "region": "Islamabad",
    "code": "101",
    "duration": 1,
    "description": "Explore the charming beauty and adventure of Islamabad with visits to iconic landmarks such as Faisal Mosque, Pakistan Monument, and Shakarparian. Enjoy a dining experience at Monal with breathtaking views, explore cultural heritage at Lok Virsa Museum, and end the day with shopping and local cuisine at Jinnah Super Market and F-10 Markaz.",
    "image": "/images/All_Tour_Images/Islamabad/Picture1.jpeg",
    "pdf": "/images/pdf/1_day_by_road_trip_to_islamabad.pdf",
    "galleryImages": [
      "/images/All_Tour_Images/Islamabad/Picture1.jpeg",
      "/images/All_Tour_Images/Islamabad/Picture2.jpeg",
      "/images/All_Tour_Images/Islamabad/Picture3.jpeg",
      "/images/All_Tour_Images/Islamabad/Picture4.jpeg",
    ],
    "categories": [
      "Deluxe",
      "Executive"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 25000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 25000,
        "features": [
          "Private Transport (GLI Car New Model)"
        ]
      },
      {
        "category": "Executive",
        "price": 35000,
        "features": [
          "Private Transport (GLI Car New Model)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "The Modern Capital – Islamabad",
        "description": "",
        "highlights": [
          "09:00 AM – Faisal Mosque: Start here before it gets crowded. Admire the architecture and the backdrop of the Margalla Hills.",
          "11:00 AM – Pakistan Monument & Shakarparian: Visit the petal-shaped monument for the best history lesson and a full view of the city.",
          "01:00 PM – Lunch at Monal (Margalla Hills): Drive up the mountain for the most famous dining experience in Pakistan with a breathtaking view.",
          "03:30 PM – Lok Virsa Museum: Head back down to explore the cultural heritage and colorful artifacts of Pakistan’s four provinces.",
          "05:30 PM – Saidpur Village: Walk through this restored 16th-century village to see the old temple and enjoy the sunset vibe.",
          "07:30 PM – Jinnah Super Market (F-7): Do some quick souvenir shopping or browse the bookstores and local shops.",
          "09:30 PM – Dinner & Nightlife (F-10 Markaz): Finish your day like a local. Grab Khyber Shinwari BBQ or enjoy chai and parathas in the bustling street food scene."
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "Fuel",
      "Toll Tax"
    ],
    "notIncluded": [
      "Lunch",
      "Dinner",
      "Entry Tickets",
      "Personal Expenses",
      "Recreation",
      "Boating",
      "Jeeps",
      "Any items not mentioned in the services",
      "Tour Guide If Required"
    ],
    "featured": false
  },
  {
    "id": "1_day_by_road_trip_to_murree_and_patriata_family",
    "name": "1 Day By Road Trip to Murree and Patriata (Family)",
    "location": "Murree and Patriata",
    "region": "Murree Patriata Galiyat",
    "duration": 1,
    "code": "111",
    "description": "Enjoy a scenic day trip from Islamabad to Murree and Patriata, featuring visits to Mall Road, Pindi Point, and a cable car ride in Patriata. Experience the local culture, food, and shopping, with private transport included.",
    "image": "/images/All_Tour_Images/MurreePatriataGaliyat/Picture1.jpg",
    "pdf": "/images/pdf/byroadtrips/1_day_by_road_trip_to_murree_and_patriata_(family).pdf",
    "galleryImages": [
      "/images/All_Tour_Images/MurreePatriataGaliyat/Picture1.jpg",
      "/images/All_Tour_Images/MurreePatriataGaliyat/Picture2.webp",
      "/images/All_Tour_Images/MurreePatriataGaliyat/Picture3.jpg",
      "/images/All_Tour_Images/MurreePatriataGaliyat/Picture1.jpg",
    ],
    "categories": [
      "Deluxe"
    ],
    "packageTypes": [
      "Family"
    ],
    "transport": "By Road",
    "basePrice": 50000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 50000,
        "features": [
          "Private Transport (Grand Cabin New Model)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Murree and Patriata",
        "description": "",
        "highlights": [
          "8:00 AM – Depart from Islamabad through Murree Motorway.",
          "Enjoy a scenic drive through the hills (≈1.5–2 hours).",
          "9:30 AM – Murree Mall Road.",
          "Walk around shops and cafés, and enjoy the cool weather and lively atmosphere.",
          "11:00 AM – Pindi Point",
          "Take photos and enjoy panoramic views of the valleys.",
          "12:30 PM – Lunch: Taste local Pakistani food or continental options on Mall Road.",
          "1:30 PM – Drive to Patriata (New Murree)",
          "A peaceful area surrounded by forests.",
          "2:30 PM – Patriata Cable Car",
          "Beautiful ride with stunning mountain views.",
          "3:30 PM – Chair Lifts",
          "Relaxing experience above pine trees and hills.",
          "4:30 PM – Pindi Point Chair Lift",
          "Another scenic ride before evening.",
          "6:00 PM – Shopping Buy souvenirs, shawls, and local crafts.",
          "7:00 PM – Return to Islamabad",
          "8:30 PM – Arrival & end of trip"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "Fuel",
      "Toll Tax",
      "Guide"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating",
      "Horse Riding/Skiing",
      "Any item not mentioned in services include",
      "Portage",
      "Tips",
      "Laundry",
      "Telephone charges",
      "Transfers",
      "All items of a personal nature",
      "Food and drinks",
      "Travel insurance"
    ],
    "featured": false
  },
  {
    "id": "10_days_by_air_trip_to_skardu_hunza_valley_couple",
    "name": "10 Days By Air Trip to Skardu & Hunza Valley (Couple)",
    "location": "Deosai National Park",
    "region": "Skardu & Hunza",
    "duration": 10,
    "code": "253",
    "pdf": "/images/pdf/byairtrips/10_days_by_air_trip_to_skardu_&_hunza_valley_(couple).pdf",
    "description": "Experience a 10-day journey through the breathtaking landscapes of Skardu and Hunza Valley, including visits to Deosai National Park and Khunjerab Pass. Enjoy scenic flights, cultural explorations, and stunning natural vistas.",
    "image": "/images/All_Tour_Images/SkarduValley/Picture1.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/SkarduValley/Picture1.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture2.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture8.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture4.jpg",
    ],
    "categories": [
      "Deluxe",
      "Premier",
      "Executive",
      "Luxury",
      "Ultra Luxury",
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Air",
    "basePrice": 550000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 550000,
        "features": [
          "Al Noor Starlet Hotel / Dirleh Resort / Shaheen Resort Hunza",
          "Hunza Blossom In / Deluxe room Skardu"
        ]
      },
      {
        "category": "Premier",
        "price": 600000,
        "features": [
          "Tibet / Hotel Himalaya / Kinara Hotel Skardu",
          "Qayyam Skardu / Qayam Resort Hunza"
        ]
      },
      {
        "category": "Executive",
        "price": 680000,
        "features": [
          "Khar Resort Skardu / Guman resort / PC Lagacy",
          "Hard Rock Hunza Resort / Villas Roomy Resort Hunza"
        ]
      },
      {
        "category": "Luxury",
        "price": 760000,
        "features": [
          "Khoj Resorts / Rivage Resort Skardu",
          "Horizon Resort Attabad Lake / Offto Resort Hunza"
        ]
      },
      {
        "category": "Ultra Luxury",
        "price": 850000,
        "features": [
          "Shangrila / Himmel by Luxus / Khoj Resorts",
          "Best Western / Darbar Hotel / Hunza Serena Hotel"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Skardu",
        "description": "",
        "highlights": [
          "Morning flight from Islamabad to Skardu (One of the World's Most Scenic Flights)",
          "Meet and greet at Skardu International Airport",
          "Transfer to your hotel for check-in or directly leave for the tour",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake)",
          "Upper Kachura Lake, followed by an exploration of the hidden Soq Valley",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Overnight stay in a hotel"
        ]
      },
      {
        "day": 2,
        "title": "Fort, Mosque, and Valley",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Drive to enchanting Khaplu Valley",
          "Visit the magnificent Khaplu Palace—a royal heritage hotel",
          "Explore Chaqchan Mosque—700 years old",
          "Afternoon: Walk through Khaplu's charming streets and bazaars",
          "Visit traditional apricot orchards",
          "Evening: Leisure time in Khaplu's serene environment",
          "Overnight: Hotel in Khaplu"
        ]
      },
      {
        "day": 3,
        "title": "Waterfalls, Rock, and Deserts",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Depart for a scenic drive to the magnificent Manthoka Waterfall",
          "En route: Experience the Sarfaranga Cold Desert at dusk",
          "Visit Shigar Fort (a one-of-a-kind heritage boutique hotel)",
          "Seek refuge and find adventure in a 400-year-old fort",
          "Overnight stay at a Shigar"
        ]
      },
      {
        "day": 4,
        "title": "Lakes, Fort and Shopping",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Departure: Arrive back in Skardu",
          "Visit Blind Lake (Jarba Zhou) in Shigar Valley",
          "Visit Hussainabad Waterfall or the optional Kharpocho Fort hiking",
          "Visit the Skardu Bazaar for local handicrafts, dry fruits, and Balti souvenirs",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Overnight stay in a hotel in Skardu"
        ]
      },
      {
        "day": 5,
        "title": "Roof of the World and Sadpara Lake",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Depart for Deosai National Park, called the Roof of the World",
          "Visit Sadpara Lake Photography and Sightseeing",
          "Explore the stunning landscapes, meadows, and wildlife of Deosai",
          "Visit Bara Pani and Kala Pani",
          "Visit Sheosar Lake, an alpine lake situated at the western end of Deosai National Park",
          "Evening: Enjoy leisure time, stunning sunset views, and back to the hotel",
          "Overnight stay in a hotel"
        ]
      },
      {
        "day": 6,
        "title": "Skardu to Hunza Road Journey (KKH)",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Check out early leave for long travel to Hunza",
          "Road Transit: Drive from Skardu to Karimabad, Hunza",
          "Key Stop: Astak Nala, confluence of three mountains",
          "Stop at the Rakaposhi Viewpoint near Gilgit for lunch",
          "Evening: Arrive in Karimabad, check into your hotel, and rest and relax",
          "Overnight stay at a hotel"
        ]
      },
      {
        "day": 7,
        "title": "Hunza Exploration Offers Stunning Karakoram",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Visit the two ancient fortresses: the 900-year-old Altit Fort and the 700-year-old Baltit Fort",
          "Afternoon: Explore the Karimabad Bazaar for local souvenirs, traditional shawls, and organic Hunzai products",
          "Sunset: Drive up to Duikar (Eagle's Nest) for a breathtaking sunset panorama",
          "Overnight stay in a hotel"
        ]
      },
      {
        "day": 8,
        "title": "Hunza History & Sunset Panorama",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Full-Day Excursion: Drive north into Upper Hunza/Gojal Valley",
          "Key Stops: Visit the stunning Attabad Lake",
          "Continue north to the dramatic Passu Cones and the nearby thrilling Hussaini Suspension Bridge",
          "Optional: Drive further north towards Sost",
          "Note: A full-day trip to Khunjerab Pass",
          "Overnight stay at Hunza"
        ]
      },
      {
        "day": 9,
        "title": "Hunza to Skardu Road Journey Through Karakoram",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Road Transit: Begin the return drive from Karimabad back to Skardu City",
          "Activity: Stop for photos at any viewpoints you missed on the way up",
          "Evening: Arrive back in Skardu, check into your hotel",
          "Visit the Skardu Bazaar for local handicrafts, dry fruits, and Balti souvenirs",
          "Prepare for your early morning flight",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 10,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Transfer: You will be transferred to Skardu Airport for your return flight to Islamabad"
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat-One way)",
      "Private Transport (Parado TZ 2004-07 New Model)",
      "Fuel - Toll Tax, and Entry Tickets",
      "9 Nights’ Accommodation",
      "9 Breakfasts"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Personal Expenses, Recreation, Boating, jeeps etc.",
      "Any items not mentioned in the services",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature",
      "Food and drinks not specifically mentioned"
    ],
    "featured": false
  },

  {
    "id": "2_days_by_road_trip_islamabad_city_tour",
    "name": "2 Days By Road Trip Islamabad City Tour",
    "location": "Islamabad Capital Territory",
    "region": "Islamabad",
    "duration": 2,
    "code": "102",
    "pdf": "/images/pdf/byroadtrips/2_days_by_road__trip_islamabad_city_tour.pdf",
    "description": "Explore the charming beauty and adventure of Islamabad over two days. Visit iconic landmarks, enjoy local cuisine, and experience the vibrant culture and nightlife of the city.",
    "image": "/images/All_Tour_Images/Islamabad/Picture2.jpeg",
    "galleryImages": [
      "/images/All_Tour_Images/Islamabad/Picture1.jpeg",
      "/images/All_Tour_Images/Islamabad/Picture2.jpeg",
      "/images/All_Tour_Images/Islamabad/Picture3.jpeg",
      "/images/All_Tour_Images/Islamabad/Picture4.jpeg",
    ],
    "categories": [
      "Deluxe",
      "Executive"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 40000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 40000,
        "features": [
          "Roomy Signature",
          "Grand Islamabad"
        ]
      },
      {
        "category": "executive",
        "price": 60000,
        "features": [
          "Serena Hotel",
          "Hotel Hill View Islamabad"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "The Modern Capital – Islamabad",
        "description": "",
        "highlights": [
          "09:00 AM – Faisal Mosque: Visit the iconic mosque for architecture and photos.",
          "Lok Virsa Museum: Explore Pakistan’s cultural heritage and artifacts.",
          "Lunch at Monal: Enjoy dining with panoramic views of the city from Margalla Hills.",
          "Pakistan Monument: Visit the national landmark at Shakarparian.",
          "Rawal Lake: Relax with a boat ride or lakeside walk.",
          "Saidpur Village: Dinner in a restored historic village.",
          "Nightlife & Vibe: End the day at Centaurus Mall for shopping and a movie, or visit F-10 Markaz to experience the local street vibe.",
          "In F-10, you can enjoy late-night chai, parathas, and wraps while soaking in the bustling city energy.",
          "Night in Islamabad Hotel"
        ]
      },
      {
        "day": 2,
        "title": "Discover the Beautiful Enchanting Views and Hiking",
        "description": "",
        "highlights": [
          "09:00 AM – Margalla Hills: Hike Trail 3 or drive to Daman-e-Koh for fresh air and city views.",
          "Shah Allah Ditta Caves: Explore 2,400-year-old Buddhist caves and ancient banyan trees.",
          "Lunch at Kohsar Market (F-6): Experience Islamabad’s high-end cafe culture (try Street 1 Cafe).",
          "Railway Museum: Visit Golra Sharif Station to see vintage steam engines and colonial history.",
          "Jinnah Super (F-7): Shop for souvenirs, leather goods, and handicrafts in the city's most famous market.",
          "08:00 PM – Farewell Dinner: Enjoy authentic Afghan cuisine at Kabul Restaurant or local BBQ.",
          "Quick Treat: Grab the famous Savour Foods pulao for a true local send-off.",
          "Farewell Dinner at Kabul Restaurant (F-7): You cannot leave Islamabad without trying authentic Afghan cuisine. Their Lamb Tikka and Kabuli Pulao are legendary.",
          "Final Stop: Savour Foods: If you have any room left, grab a quick plate of the famous 'Savour Foods' Pulao — it is an Islamabad institution.",
          "Arrival back home, concluding the trip with lifelong memories."
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model) (1 Vehicle)",
      "1 Night Accommodation",
      "1 Breakfast"
    ],
    "notIncluded": [
      "Lunch – Dinner – Entry Tickets",
      "Personal Expenses, Recreation, Boating, jeeps etc.",
      "Fuel- Toll Tax",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "2_days_by_road_trip_to_murree_and_galiyat",
    "name": "2 Days By Road Trip to Murree and Galiyat",
    "location": "Murree and Galiyat",
    "region": "Murree Patriata Galiyat",
    "duration": 2,
    "code": "112",
    "pdf": "/images/pdf/byroadtrips/2_days_by_road_trip_to_murree_and_galiyat.pdf",
    "description": "Experience the charming beauty and adventure of Murree and Galiyat with a 2-day road trip. Enjoy scenic drives, explore picturesque viewpoints, and engage in optional activities like chair lift rides and hiking. The trip includes a visit to Murree Mall Road, Nathiagali, and Ayubia National Park.",
    "image": "/images/All_Tour_Images/MurreePatriataGaliyat/Picture1.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/MurreePatriataGaliyat/Picture1.jpg",
      "/images/All_Tour_Images/MurreePatriataGaliyat/Picture2.webp",
      "/images/All_Tour_Images/MurreePatriataGaliyat/Picture3.jpg",
      "/images/All_Tour_Images/MurreePatriataGaliyat/Picture1.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive"
    ],
    "packageTypes": [
      "Couple",
      "Family",
      "Group"
    ],
    "transport": "By Road",
    "basePrice": 50000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 50000,
        "features": [
          "Umda hotel",
          "The Cloud Xpress"
        ]
      },
      {
        "category": "Executive",
        "price": 80000,
        "features": [
          "Felettis Grand",
          "Shangrila Hotel Murree",
          "Hotel Summer Retreat"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Departure to Murree & Patriata",
        "description": "",
        "highlights": [
          "Pickup from Islamabad at 08:30 AM",
          "Drive toward Murree via the Expressway",
          "Reach Patriata (New Murree) by early afternoon",
          "Enjoy the Chair Lift & Cable Car Ride (Optional Activity)",
          "Capture the sunset photography and scenic views",
          "Visit Murree Mall Road if time permits",
          "Check-in to your hotel in Murree or Nathiagali",
          "Overnight stay"
        ]
      },
      {
        "day": 2,
        "title": "Explore Nathiagali & Ayubia | Return",
        "description": "",
        "highlights": [
          "After breakfast and check-out from the hotel, travel to Nathiagali",
          "Explore scenic viewpoints and pine forests",
          "Visit Ayubia National Park",
          "Experience the Ayubia or take a short hike on the Pipeline Walking Track (Optional)",
          "Enjoy a lunch break at a local spot",
          "Begin the departure for the return journey",
          "Arrival back to Islamabad by 09:00 PM"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "Fuel",
      "Toll Tax",
      "1 Night Accommodation",
      "1 Breakfast"
    ],
    "notIncluded": [
      "Lunch - Dinner",
      "Personal Expenses",
      "Recreation",
      "Boating",
      "Jeeps",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "3_days_by_road_trip_to_leepa_valley_and_ganga_choti_kashmir_couple",
    "name": "3 Days By Road Trip to Leepa Valley and Ganga Choti, Kashmir (Couple)",
    "location": "Leepa Valley",
    "region": "Neelum Valley Kashmir",
    "duration": 3,
    "code": "131",
    "pdf": "/images/pdf/byroadtrips/3_days_by_road_trip_to_leepa_valley_and_ganga_choti,_kashmir_(couple).pdf",
    "description": "Experience a 3-day journey through the scenic Leepa Valley and Ganga Choti in Kashmir. Enjoy breathtaking landscapes, cultural exploration, and adventurous treks, with comfortable accommodations and guided tours.",
    "image": "/images/All_Tour_Images/NeelumValleyKashmir/Picture1.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture1.jpg",
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture2.webp",
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture3.jpg",
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture4.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 110000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 110000,
        "features": [
          "Leepa View Guest House"
        ]
      },
      {
        "category": "Executive",
        "price": 140000,
        "features": [
          "Hotel O Kohsheen Guest House"
        ]
      },
      {
        "category": "Luxury",
        "price": 170000,
        "features": [
          "Serenity Springs Resort"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Leepa Valley",
        "description": "",
        "highlights": [
          "05:00 AM (Islamabad Pickup)—Pick up Islamabad members and travel through Murree Motorway.",
          "Morning: Depart for Muzaffarabad and then towards Reshian (Leepa Valley entry point).",
          "Late Morning (11:00 AM): Reach Reshian. Obtain necessary travel permits (NOC/permission).",
          "Noon (12:00 PM): Hire a local 4x4 Jeep (mandatory) and proceed over Reshian Gali/Dao Khan Pass to descend into the main Leepa Valley.",
          "Afternoon (03:00 PM): Arrive in the Leepa Valley area (e.g., Dao Khan or Leepa Village). Check in and have a late lunch.",
          "Evening: Quick exploration of the main Leepa Valley (wooden houses, rice fields) and the surrounding area like Dao Khan.",
          "Night Stay: Leepa Valley / Dao Khan."
        ]
      },
      {
        "day": 2,
        "title": "Waterfalls, Forest, and Old House!",
        "description": "",
        "highlights": [
          "Early Morning (07:00 AM): Breakfast and immediate departure from Leepa Valley.",
          "Drive back to Reshian, then towards Muzaffarabad, and onwards to the Bagh District.",
          "Day Travel (08:00 AM - 02:00 PM): Long drive from the Leepa Valley area towards the town of Bagh, and then proceed to Sudhan Gali (the base for Ganga Choti).",
          "Afternoon (03:00 PM): Arrive at Sudhan Gali. Check into your guesthouse.",
          "Late Afternoon (04:00 PM): Start the trek to Ganga Choti Peak (3,045 m). The trek is generally moderate and takes about 1.5 to 2 hours one-way.",
          "Evening (06:00 PM): Enjoy the views at the summit/meadows. Trek back down to Sudhan Gali before it gets too dark.",
          "Night Stay: Sudhan Gali"
        ]
      },
      {
        "day": 3,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "08:00 AM Breakfast – Wake up and enjoy breakfast.",
          "Departure for Islamabad",
          "Photography and Sightseeing.",
          "Islamabad Drop-off – Begin the journey back.",
          "Arriving at Islamabad around 08:00 PM (+/- 2 hours).",
          "End of services with satisfied clients and unforgettable memories!"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "Fuel- Toll Tax",
      "2 Nights’ Accommodation",
      "3 Breakfasts",
      "Tour Guide"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating - Jeep",
      "Expenses of Personal Nature",
      "Horse Ridding / Ski",
      "Any item not mentioned in services include",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature, and also food and drinks.",
      "Travel insurance"
    ],
    "featured": false
  },
  {
    "id": "3_days_by_road_trip_to_murre_and_ayubia",
    "name": "3 Days By Road Trip to Murree and Ayubia",
    "code": "113",
    "location": "Murree and Ayubia",
    "region": "Murree Ayubia Nathiagali",
    "pdf": "/images/pdf/byroadtrips/3_days_by_road_trip_to_murre_and_ayubia.pdf",
    "duration": 3,
    "description": "Explore the charming beauty and adventure of Murree and Ayubia with a 3-day road trip. Enjoy scenic drives, historical sites, and breathtaking views while staying in comfortable accommodations.",
    "image": "/images/All_Tour_Images/MurreeAyubiaNathiagali/Picture1.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/MurreeAyubiaNathiagali/Picture1.jpg",
      "/images/All_Tour_Images/MurreeAyubiaNathiagali/Picture2.webp",
      "/images/All_Tour_Images/MurreeAyubiaNathiagali/Picture1.jpg",
      "/images/All_Tour_Images/MurreeAyubiaNathiagali/Picture2.webp",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple",
      "Family",
      "Group"
    ],
    "transport": "By Road",
    "basePrice": 120000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 120000,
        "features": [
          "Hotel One Mall Road",
          "Crown Inn Hotel"
        ]
      },
      {
        "category": "Executive",
        "price": 140000,
        "features": [
          "Felettis Grand",
          "Shanrila Hotel Murree"
        ]
      },
      {
        "category": "Luxury",
        "price": 160000,
        "features": [
          "Fiora Hotel",
          "PC Bhurban Murree"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Departure to Murree Ayubia & Khanaspur",
        "description": "",
        "highlights": [
          "Pickup from Lahore at 09:30 PM",
          "Drive towards Murree via the Expressway",
          "Arrival at Ayubia/Dunga Gali area",
          "Stop for a late, hearty breakfast",
          "Visit the Moto Tunnel Ayubia",
          "Visit Bhutto Point",
          "Explore the historic Khanaspur Church",
          "Drive to Nathia Gali, check-in at the hotel",
          "Enjoy dinner and overnight stay in Nathia Gali"
        ]
      },
      {
        "day": 2,
        "title": "Explore Nathia Gali and Murree",
        "description": "",
        "highlights": [
          "After breakfast and check-out from the hotel",
          "Walk the scenic Pipeline Track",
          "Visit Lalazar Wildlife Park",
          "Explore Nathia Gali town, local bazaar, and St. Matthew's Church",
          "Check out and drive to Murree",
          "Head to Kashmir Point for panoramic views",
          "Stroll, shop, and enjoy the atmosphere on Mall Road",
          "Overnight stay in Murree"
        ]
      },
      {
        "day": 3,
        "title": "Murree Sightseeing & Drive Back Home",
        "description": "",
        "highlights": [
          "Breakfast and check-out",
          "Visit Pindi Point with an option to take the chairlift",
          "Drive to Patriata Point Murree (New Murree)",
          "Ride the famous Patriata Chairlift and Cable Car",
          "Begin the drive back to your desired destination via the Expressway",
          "Arrival back home, concluding the trip with lifelong memories"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "Fuel",
      "Toll Tax",
      "2 Nights’ Accommodation",
      "2 Breakfasts"
    ],
    "notIncluded": [
      "Lunch - Dinner",
      "Personal Expenses",
      "Recreation",
      "Boating",
      "Jeeps",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "3_days_by_road_trip_to_naran_kaghan_and_babusar_top",
    "name": "3 Days By Road Trip to Naran Kaghan and Babusar Top",
    "location": "Naran Kaghan",
    "region": "Naran Kaghan & Babusar Top",
    "pdf": "/images/pdf/byroadtrips/3_days_by_road_trip_to_naran_kaghan_and_babusar_top.pdf",
    "duration": 3,
    "code": "121",
    "description": "Experience the breathtaking beauty of Naran Kaghan and Babusar Top over a 3-day road trip. Explore the stunning landscapes of Neelum Valley, Shogran Valley, Lulusar Lake, and Babusar Top. Enjoy activities like jeep rides, sightseeing, and optional river rafting, with comfortable accommodations and meals included.",
    "image": "/images/All_Tour_Images/NarabKaghan/Picture1.png",

    "galleryImages": [
      "/images/All_Tour_Images/NarabKaghan/Picture2.png",
      "/images/All_Tour_Images/NarabKaghan/Picture3.png",
      "/images/All_Tour_Images/NarabKaghan/Picture3.png",
      "/images/All_Tour_Images/NarabKaghan/Picture4.png",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple",
      "Group"
    ],
    "transport": "By Road",
    "basePrice": 24000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 130000,
        "features": [
          "Deluxe hotel accommodation"
        ]
      },
      {
        "category": "Executive",
        "price": 150000,
        "features": [
          "Executive hotel accommodation"
        ]
      },
      {
        "category": "Luxury",
        "price": 180000,
        "features": [
          "Luxury hotel accommodation"
        ]
      },
      // {
      //   "category": "Ultra Luxury",
      //   "price": 24000,
      //   "features": [
      //     "Single room for 3 persons sharing"
      //   ]
      // },
      // {
      //   "category": "group_solo",
      //   "price": 35000,
      //   "features": [
      //     "Solo single room"
      //   ]
      // },
      // {
      //   "category": "group_couple",
      //   "price": 60000,
      //   "features": [
      //     "Separate room for couple"
      //   ]
      // }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Departure for Naran Valley",
        "description": "",
        "highlights": [
          "Pick up Islamabad members at 05:00 AM",
          "Depart early from Islamabad via Hazara Motorway",
          "Breakfast at Balakot",
          "Stop at Kiwai Waterfall for sightseeing",
          "Jeep ride to Shogran Valley",
          "Visit Siri and Paye Meadows for views of Makra Peak",
          "Explore Shogran and head to Naran",
          "Dinner and overnight stay"
        ]
      },
      {
        "day": 2,
        "title": "Naran to Lulusar Lake and Babusar Top",
        "description": "",
        "highlights": [
          "Breakfast at the hotel",
          "Drive towards Babusar Top",
          "Visit Batakundi and Lulusar Lake",
          "Enjoy panoramic views at Babusar Top",
          "Optional river rafting at Kunhar River",
          "Dinner and overnight stay"
        ]
      },
      {
        "day": 3,
        "title": "Naran and Return to Islamabad",
        "description": "",
        "highlights": [
          "Breakfast and jeep ride to Lake Saif-ul-Malook",
          "Explore Lake Saif-ul-Malook",
          "Depart for Islamabad (arrival around 6:00 PM)",
          "Depart for Lahore (arrival around 11:30 PM)",
          "Trip concludes with lasting memories"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "Fuel- Toll Tax",
      "2 Nights’ Accommodation",
      "3 Breakfast – 2 Dinners",
      "Jeep – Tour Guide"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating",
      "Expenses of Personal Nature",
      "Horse Riding / Ski",
      "Any item not mentioned in services include"
    ],
    "featured": false
  },
  {
    "id": "3_days_by_road_trip_to_neelum_valley_kashmir",
    "name": "3 Days By Road Trip to Neelum Valley Kashmir",
    "location": "Neelum Valley",
    "region": "Neelum Valley Kashmir",
    "duration": 3,
    "code": "132",
    "pdf": "/images/pdf/byroadtrips/3_days_by_road_trip_to_neelum_valley_kashmir.pdf",
    "description": "Explore the charming beauty of Neelum Valley Kashmir with a scenic road trip. Enjoy breathtaking views, cultural sites, and outdoor activities including hiking and sightseeing. Experience cozy evenings with bonfires and musical nights.",
    "image": "/images/All_Tour_Images/NeelumValleyKashmir/Picture5.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture5.jpg",
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture6.jpg",
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture7.png",
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture8.png",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple",
      "Group"
    ],
    "transport": "By Road",
    "basePrice": 24000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 130000,
        "features": [
          "Neelum Cinaar Resort"
        ]
      },
      {
        "category": "Premier",
        "price": 150000,
        "features": [
          "Green Valley Resort"
        ]
      },
      {
        "category": "Executive",
        "price": 180000,
        "features": [
          "Hotel Neelum Elites"
        ]
      },
      {
        "category": "Luxury",
        "price": 24000,
        "features": [
          "03 Persons Sharing Room"
        ]
      },
      {
        "category": "Ultra Luxury",
        "price": 35000,
        "features": [
          "Solo Single Room"
        ]
      },
      // {
      //   "category": "group",
      //   "price": 60000,
      //   "features": [
      //     "Separate Room for Couple"
      //   ]
      // }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Departure for Kashmir",
        "description": "",
        "highlights": [
          "05:00 AM – Pick up Islamabad members",
          "Murree Expressway Drive – Enjoy a scenic drive through the expressway with a short break at Kohala Bridge for photos",
          "Muzaffarabad – Arrive in Muzaffarabad and stop for breakfast",
          "Dhanni Waterfall – Continue the drive towards Keran, pausing at Dhanni Waterfall for sightseeing",
          "Arrival at Shardha – Reach Shardha by late afternoon. Relax, and explore the area",
          "Evening Activities – Enjoy a cozy bonfire & musical night with dinner",
          "Overnight Stay – Stay at a hotel in Shardha"
        ]
      },
      {
        "day": 2,
        "title": "Scenic and Royal History",
        "description": "",
        "highlights": [
          "Breakfast at Hotel Shardha – Begin your day with breakfast at the hotel",
          "Shardha University Visit – Explore the historic Shardha University, surrounded by scenic beauty and cultural significance",
          "Kel & Arang Kel Hike – Depart for Kel and hike up to Arang Kel, a scenic meadow known for its enchanting views and tranquility",
          "Explore Arang Kel – Enjoy breathtaking views, take photos, and unwind in the meadow",
          "Return to Keran – Head back to Keran by evening",
          "Dinner & Overnight Stay at the hotel in Keran"
        ]
      },
      {
        "day": 3,
        "title": "Kutton and Return to Islamabad",
        "description": "",
        "highlights": [
          "Breakfast at Hotel Keran",
          "Early morning wake-up call and drive to Upper Neelum",
          "Visit Kutton and the famous Kutton Waterfall for scenic beauty",
          "Photography and Sightseeing",
          "Islamabad Drop-off – Begin the journey back",
          "Arriving at Islamabad around 08:00 PM (+/- 2 hours)"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "Fuel- Toll Tax",
      "2 Nights’ Accommodation",
      "3 Breakfast – 2 Dinners",
      "Jeep – Tour Guide"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating",
      "Expenses of Personal Nature",
      "Horse Ridding / Ski",
      "Any item not mentioned in services include"
    ],
    "featured": false
  },
  {
    "id": "3_days_by_road_trip_to_swat_kalam_malam_jabba_group",
    "name": "3 Days By Road Trip to Swat Kalam Malam Jabba",
    "location": "Swat Kalam Malam Jabba",
    "region": "Swat Kalam & Malam Jabba",
    "duration": 3,
    "code": "141",
    "pdf": "/images/pdf/byroadtrips/3_days_by_road_trip_to_swat_kalam_malam_jabba_(group).pdf",
    "description": "Experience a 3-day journey through the scenic landscapes of Swat, Kalam, and Malam Jabba. Enjoy skiing, sightseeing, and exploring historical sites with comfortable accommodations and guided tours.",
    "image": "/images/All_Tour_Images/SwatKalamMalamJabba/Picture1.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture1.jpg",
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture2.webp",
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture3.jpg",
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture4.webp",
    ],
    "categories": [
      "Deluxe"
    ],
    "packageTypes": [
      "Group"
    ],
    "transport": "By Road",
    "basePrice": 20000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 20000,
        "features": [
          "3 Person Sharing Room"
        ]
      },
      {
        "category": "Premier",
        "price": 25000,
        "features": [
          "Twin sharing or Couple"
        ]
      },
      {
        "category": "Executive",
        "price": 30000,
        "features": [
          "Separate Room (No Sharing)"
        ]
      },
      {
        "category": "Luxury",
        "price": 10000,
        "features": [
          "Kids (7-10 years)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Malam Jabba",
        "description": "",
        "highlights": [
          "05:00 AM (Islamabad Pickup)—Pick up Islamabad members and travel through Swat Motorway.",
          "Breakfast in Shakardara for a delicious breakfast break.",
          "Visit The Shingardar Stupa is a significant Buddhist archaeological site (Gandhara civilization).",
          "Departure for Malam Jabba",
          "Photography and Sightseeing.",
          "Travel to Malam Jabba, Pakistan’s largest and oldest ski resort.",
          "Activities: Skiing, chair lift, zip lining (personal expenses).",
          "Return to the hotel Departure for Kalam Valley",
          "Overnight Stay in Kalam Valley."
        ]
      },
      {
        "day": 2,
        "title": "Waterfalls, Forest, and Lake",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort.",
          "Departure for Mahodand Lake (If Open)",
          "Transfer to 4x4 jeeps and departure for Mahodand Lake.",
          "Ushu Forest & Surroundings – Discover Snow-Covered Ushu Forest and nearby scenic areas.",
          "Visit Blue Water: A clean river with a blue, glacier-fed water flow that is a nice spot to relax.",
          "Mahodand Lake Visit—Enjoy the spectacular views of Mahodand Lake, nestled in a pristine valley.",
          "Kalam Bazaar Visit – Stroll through Kalam Bazaar, explore local shops, and enjoy the ambiance.",
          "Overnight Stay in Kalam."
        ]
      },
      {
        "day": 3,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "08:00 AM Breakfast – Wake up and enjoy breakfast.",
          "Departure for Islamabad",
          "Visit Bahrain Bazaar and the side area.",
          "Photography and Sightseeing.",
          "Islamabad Drop-off – Drop Begin the journey back.",
          "Arriving at Islamabad around 08:00 PM (+/- 2 hours).",
          "End of services with satisfied clients and unforgettable memories!"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",

      "Fuel- Toll Tax",
      "2 Nights’ Accommodation",
      "3 Breakfasts",
      "Tour Guide"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating - Jeep",
      "Expenses of Personal Nature",
      "Horse Ridding / Ski",
      "Any item not mentioned in services include",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature, and also food and drinks.",
      "Travel insurance"
    ],
    "featured": false
  },
  {
    "id": "4_days_by_road_trip_to_kalash_valley_chitral_bumburet_valley",
    "name": "4 Days By Road Trip to Kalash Valley Chitral & Bumburet Valley",
    "location": "Kalash Valley",
    "region": "Kalash Valley & Chitral",
    "duration": 4,
    "code": "151",
    "pdf": "/images/pdf/byroadtrips/4_days_by_road_trip_to_kalash_valley_chitral_&__bumburet_valley.pdf",
    "description": "Experience a 4-day journey through the scenic Kalash Valley, Chitral, and Bumburet Valley. Enjoy cultural experiences, local festivals, and breathtaking landscapes.",
    "image": "/images/All_Tour_Images/KalashValleyChitral/Picture1.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/KalashValleyChitral/Picture1.jpg",
      "/images/All_Tour_Images/KalashValleyChitral/Picture2.jpg",
      "/images/All_Tour_Images/KalashValleyChitral/Picture3.jpg",
      "/images/All_Tour_Images/KalashValleyChitral/Picture4.jpg",
    ],
    "categories": [
      "Deluxe",

    ],
    "packageTypes": [
      "Couple",
      "Family",
      "Group"
    ],
    "transport": "By Road",
    "basePrice": 25000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 40000,
        "features": [
          "3 Person Sharing Room"
        ]
      },
      {
        "category": "Premier",
        "price": 25000,
        "features": [
          "Twin Sharing or Couple"
        ]
      },
      {
        "category": "Executive",
        "price": 90000,
        "features": [
          "Separate Room (No Sharing)"
        ]
      },
      {
        "category": "Luxury",
        "price": 55000,
        "features": [
          "Kids (7-10 years)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Chitral",
        "description": "",
        "highlights": [
          "Departure from Islamabad at 04:00 AM",
          "Scenic drive through Lower Dir and Malakand Division",
          "Breakfast stop at Chakdara",
          "Visit and sightseeing at Timergarah",
          "Cross the famous Lowari Tunnel",
          "Short visit and walk through Drosh Bazaar",
          "Visit Chitral Bazaar for local shopping and photography",
          "Live Polo Match (subject to availability and schedule)",
          "Arrival in Chitral around 08:00 PM",
          "Hotel check-in and freshen up",
          "Free time for a short walk in the city",
          "Overnight stay in Chitral"
        ]
      },
      {
        "day": 2,
        "title": "Waterfalls, Forest, and Old House!",
        "description": "",
        "highlights": [
          "Breakfast at 07:00 AM",
          "Departure from hotel at 08:00 AM",
          "Visit Shahi Masjid Chitral",
          "Visit Shahi Qila (Chitral Fort)",
          "Visit National Gol Park",
          "Transfer to 4x4 Jeeps for off-road travel",
          "Drive through stunning mountain roads toward the Kalash Valleys",
          "Arrival in Bumburet Valley",
          "Explore ancient Kalash villages",
          "Walk through local handicraft and souvenir shops",
          "Interaction with Kalash locals",
          "Enjoy traditional Kalash music and dance performances",
          "Photography and cultural observation till evening",
          "Return to campsite or hotel",
          "Dinner at 09:00 PM",
          "Bonfire (if weather allows)",
          "Overnight stay in Kalash Valley"
        ]
      },
      {
        "day": 3,
        "title": "Uchal Festival Closing Ceremony & Valley Exploration",
        "description": "",
        "highlights": [
          "Breakfast at 08:00 AM",
          "Visit the Kalash Museum",
          "Proceed to the festival dancing ground",
          "Observe traditional rituals, colorful attire, music, and ceremonial dances",
          "Visit Karkal Village",
          "Explore the Culture Bazaar",
          "Trekking through the valley trails",
          "Full-day exploration of natural beauty, streams, fields, and villages",
          "Free time for photography and relaxation",
          "Return to accommodation",
          "Cultural discussions and group interaction",
          "Overnight stay in Kalash Valley"
        ]
      },
      {
        "day": 4,
        "title": "Return to Islamabad",
        "description": "",
        "highlights": [
          "Breakfast",
          "Pack up and check out",
          "Departure from Kalash Valley toward Islamabad",
          "Scenic drive back via Chitral and Lowari Tunnel",
          "Photography and Sightseeing",
          "Arrival at Islamabad around 08:00 PM (+/- 2 hours)",
          "End of services with satisfied clients and unforgettable memories"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "Fuel",
      "Toll Tax",
      "3 Nights’ Accommodation",
      "4 Breakfasts",
      "Tour Guide"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating - Jeep",
      "Expenses of Personal Nature",
      "Horse Riding / Ski",
      "Any item not mentioned in services include",
      "Portage, tips, laundry, telephone charges, transfers",
      "All items of a personal nature",
      "Food and drinks not in the itinerary",
      "Travel insurance"
    ],
    "featured": false
  },
  {
    "id": "4_days_by_road_trip_to_kumrat_valley_katora_lake",
    "name": "4 Days By Road Trip to Kumrat Valley & Katora Lake",
    "location": "Kumrat Valley",
    "region": "Kumrat and Katora Lake",
    "duration": 4,
    "code": "161",
    "pdf": "/images/pdf/byroadtrips/4_days_by_road_trip_to_kumrat_valley_&_katora_lake.pdf",
    "description": "Experience a 4-day adventure through the scenic Kumrat Valley and Katora Lake. Enjoy a comfortable journey from Islamabad, explore the Deodar Forest, Panjkora River, and the breathtaking Jahaz Banda Meadows. Trek to the stunning Katora Lake and enjoy overnight stays in camps and hotels.",
    "image": "/images/All_Tour_Images/KumratValley/Picture3.png",
    "galleryImages": [
      "/images/All_Tour_Images/KumratValley/Picture1.png",
      "/images/All_Tour_Images/KumratValley/Picture2.png",
      "/images/All_Tour_Images/KumratValley/Picture3.png",
      "/images/All_Tour_Images/KumratValley/Picture4.png",
    ],
    "categories": [
      "Deluxe"
    ],
    "packageTypes": [
      "Couple",
      "Family",
      "Group"
    ],
    "transport": "By Road",
    "basePrice": 20000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 40000,
        "features": [
          "3 Person Sharing Room"
        ]
      },
      {
        "category": "Premier",
        "price": 25000,
        "features": [
          "Twin Sharing or Couple"
        ]
      },
      {
        "category": "Executive",
        "price": 90000,
        "features": [
          "Separate Room (No Sharing)"
        ]
      },
      {
        "category": "Luxury",
        "price": 20000,
        "features": [
          "Kids (7-10 years)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Kumrat Valley",
        "description": "",
        "highlights": [
          "Departure from Islamabad at 04:00 AM",
          "Travel through Swat Motorway",
          "Scenic drive through Lower Dir and Malakand Division",
          "Breakfast stop at Chakdara",
          "Visit and sightseeing at Timergarah",
          "Reach Thal Village and transfer to 4x4 Jeeps",
          "Enter Kumrat Valley",
          "Explore Deodar Forest and Panjkora River",
          "Overnight stay in a riverside camp or wooden hut"
        ]
      },
      {
        "day": 2,
        "title": "Jungle, Waterfall and Jeep Ride to Takai Top",
        "description": "",
        "highlights": [
          "Breakfast at 07:00 AM",
          "Departure from hotel at 08:00 AM",
          "Visit Kumrat Waterfall and Kala Chashma",
          "Head back toward Thal and take the rugged track to Takai Top",
          "Begin hike from Takai Top to Jahaz Banda Meadows",
          "Reach Jahaz Banda Meadows",
          "Overnight camping at Jahaz Banda Meadows"
        ]
      },
      {
        "day": 3,
        "title": "The Alpine Jewel, Treks, Meadows, and Lakes",
        "description": "",
        "highlights": [
          "Breakfast at 07:00 AM",
          "Departure for Katora Lake at 08:00 AM",
          "Start hike from Jahaz Banda to Katora Lake",
          "Pass by Mini Katora Lake",
          "Reach Katora Lake",
          "Visit Kund Banda",
          "Visit Jahaz Banda Waterfall",
          "Visit Snake River at Kund Banda",
          "Trek back to Jahaz Banda Meadows",
          "Return to Thal Village for hotel stay"
        ]
      },
      {
        "day": 4,
        "title": "Return to Islamabad",
        "description": "",
        "highlights": [
          "Breakfast",
          "Pack up and check out",
          "Departure from Kumrat Valley toward Islamabad",
          "Scenic drive back to Dir and Swat Motorway",
          "Photography and sightseeing",
          "Arrive at Islamabad around 08:00 PM"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "Fuel",
      "Toll Tax",
      "3 Nights’ Accommodation",
      "4 Breakfasts",
      "Tour Guide"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating",
      "Jeep",
      "Expenses of Personal Nature",
      "Horse Riding",
      "Ski",
      "Any item not mentioned in services include",
      "Portage",
      "Tips",
      "Laundry",
      "Telephone charges",
      "Transfers",
      "All items of a personal nature",
      "Food and drinks not mentioned"
    ],
    "featured": false
  },
  {
    "id": "4_days_by_road_trip_to_murree_and_ayubia",
    "name": "4 Days By Road Trip to Murree and Ayubia",
    "location": "Murree and Ayubia",
    "region": "Murree Ayubia Nathiagali",
    "duration": 4,
    "code": "114",
    "pdf": "/images/pdf/byroadtrips/4_days_by_road_trip_to_murree_and_ayubia.pdf",
    "description": "Explore the charming beauty and adventure of Murree and Ayubia over a 4-day trip. Enjoy scenic drives, historic sites, nature trails, and vibrant local culture.",
    "image": "/images/All_Tour_Images/MurreeAyubiaNathiagali/Picture1.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/MurreeAyubiaNathiagali/Picture1.jpg",
      "/images/All_Tour_Images/MurreeAyubiaNathiagali/Picture2.webp",
      "/images/All_Tour_Images/MurreeAyubiaNathiagali/Picture1.jpg",
      "/images/All_Tour_Images/MurreeAyubiaNathiagali/Picture2.webp",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 100000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 100000,
        "features": [
          "Hotel One Mall Road",
          "Crown Inn Hotel"
        ]
      },
      {
        "category": "Executive",
        "price": 150000,
        "features": [
          "Felettis Grand",
          "Shanrila Hotel Murree"
        ]
      },
      {
        "category": "Luxury",
        "price": 220000,
        "features": [
          "Fiora Hotel",
          "PC Bhurban Murree"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Travel & Ayubia/Khanaspur Exploration",
        "description": "",
        "highlights": [
          "Pickup from Islamabad at 08:30 AM",
          "Drive from Islamabad to Murree/Galiyat region via the Expressway",
          "Explore the Ayubia area",
          "Walk the historic Moto Tunnel Ayubia and visit Bhutto Point",
          "Visit the colonial-era Khanaspur Church",
          "Drive to Nathiagali, check in to your hotel",
          "Overnight stay in Nathiagali"
        ]
      },
      {
        "day": 2,
        "title": "Hiking, Nature Trails & Scenic Views",
        "description": "",
        "highlights": [
          "Head to Donga Gali to start the famous Pipeline Track",
          "Scenic 4km walking trail through thick pine forests",
          "Connects Donga Gali to Ayubia National Park",
          "Optional hike to Mushkpuri Top",
          "Trek takes 3-4 hours round trip",
          "Offers stunning views of Kashmir",
          "Relax at the hotel or enjoy a quiet evening walk in Nathiagali",
          "Overnight stay in Nathiagali"
        ]
      },
      {
        "day": 3,
        "title": "Patriata, Bhurban & Murree Mall Road",
        "description": "",
        "highlights": [
          "Check out and drive to Patriata (New Murree)",
          "Enjoy the TDCP Patriata Chairlift and Cable Car system",
          "Check in to your hotel in Murree",
          "Visit Kashmir Point for a breathtaking view of Azad Kashmir",
          "Walk and shop on Mall Road",
          "Overnight stay in Murree"
        ]
      },
      {
        "day": 4,
        "title": "Murree Views & Return to Islamabad",
        "description": "",
        "highlights": [
          "Visit Pindi Point for a panoramic view of Rawalpindi and Islamabad",
          "Take the chairlift ride down and up",
          "Begin the drive back to your desired destination via the Expressway",
          "Arrival back home, concluding the trip with lifelong memories"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "Fuel",
      "Toll Tax",
      "3 Nights’ Accommodation",
      "3 Breakfasts"
    ],
    "notIncluded": [
      "Lunch",
      "Dinner",
      "Personal Expenses",
      "Recreation",
      "Boating",
      "Jeeps",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "4_days_by_road_trip_to_naran_kaghan_and_babusar_top_couple",
    "name": "4 Days By Road Trip to Naran Kaghan and Babusar Top",
    "location": "Babusar Top",
    "region": "Naran Kaghan & Babusar Top",
    "duration": 4,
    "code": "122",
    "pdf": "/images/pdf/byroadtrips/4_days_by_road_trip_to_naran_kaghan_and_babusar_top_(couple).pdf",
    "description": "Experience a 4-day journey through the scenic Naran Kaghan Valley and Babusar Top, exploring breathtaking landscapes, serene lakes, and vibrant local culture. Enjoy private transport, comfortable accommodations, and a variety of activities including hiking, boating, and sightseeing.",
    "image": "/images/All_Tour_Images/SwatKalamMalamJabba/Picture3.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture1.jpg",
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture3.jpg",
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture2.webp",
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture4.webp",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 120000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 120000,
        "features": [
          "Demanchi hotel Naran"
        ]
      },
      {
        "category": "Executive",
        "price": 140000,
        "features": [
          "Hotel Home Naran"
        ]
      },
      {
        "category": "Luxury",
        "price": 180000,
        "features": [
          "The Sarai Hotel & Resort Naran",
          "Northern Retreat by Hotel Demanchi"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Naran Valley",
        "description": "",
        "highlights": [
          "05:00 AM (Islamabad Pickup)—Pick up Islamabad members and travel through Hazara Motorway.",
          "Breakfast in Balakot for a delicious breakfast break.",
          "Stop at Kiwai Waterfall for sightseeing.",
          "Continue by 4x4 jeep to Shogran Valley, then onward to Siri and Paye Meadows for stunning views of Makra Peak and alpine scenery.",
          "Photography and Sightseeing.",
          "After exploring Shogran, back to the hotel.",
          "Overnight stay in Shogran Valley."
        ]
      },
      {
        "day": 2,
        "title": "Shogran to Naran Valley",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort.",
          "Departure for Naran Valley from Shogran.",
          "Visit Kaghan Bazaar and the side area.",
          "Head towards Naran Valley.",
          "Jeep excursion to Lake Saif-ul-Malook (2,745m elevation)",
          "Activities: hiking, boating (optional), photography",
          "Learn the legend of Prince Saif-ul-Malook & fairy queen Badi-ul-Jamal.",
          "After exploring the lake, back to the hotel.",
          "Overnight stay at the hotel in Kalam Valley."
        ]
      },
      {
        "day": 3,
        "title": "Waterfalls, Top, and Lake!",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort.",
          "Drive towards Babusar Top (4,173m elevation)",
          "Stopovers at: Batakundi (lush valley views)",
          "Lulusar Lake (largest natural lake in Kaghan Valley)",
          "Babusar Top (snow-capped peaks, photography hotspot)",
          "Adventure activity: River rafting in Kunhar River",
          "Optional: trout fishing or short hikes along the river",
          "Overnight stay at a hotel in Naran"
        ]
      },
      {
        "day": 4,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "08:00 AM Breakfast – Wake up and enjoy breakfast.",
          "Departure for Islamabad",
          "Photography and Sightseeing.",
          "Islamabad Drop-off – Drop Begin the journey back.",
          "Arriving at Islamabad around 08:00 PM (+/- 2 hours).",
          "End of services with satisfied clients and unforgettable memories!"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI CAR New Model)",
      "Fuel- Toll Tax",
      "3 Nights’ Accommodation",
      "4 Breakfasts",
      "Jeep"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating",
      "Expenses of Personal Nature",
      "Horse Ridding / Ski",
      "Any item not mention in services include",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature, and also food and drinks.",
      "Travel insurance"
    ],
    "featured": false
  },
  {
    "id": "4_days_by_road_trip_to_neelum_valley_kashmir_couple",
    "name": "4 Days By Road Trip to Neelum Valley Kashmir",
    "location": "Neelum Valley",
    "region": "Neelum Valley Kashmir",
    "duration": 4,
    "code": "133",
    "pdf": "/images/pdf/byroadtrips/4_days_by_road_trip_to_neelum_valley_kashmir(couple).pdf",
    "description": "Experience the breathtaking beauty of Neelum Valley in Kashmir with a 4-day road trip. Enjoy scenic drives, explore serene villages, and immerse yourself in the natural wonders of Taobat, Arang Kel, and more. This package offers a perfect blend of adventure and relaxation, with cozy accommodations and memorable activities.",
    "image": "/images/All_Tour_Images/NeelumValleyKashmir/Picture3.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture9.jpg",
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture8.png",
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture7.png",
      "/images/All_Tour_Images/NeelumValleyKashmir/Picture1.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 150000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 150000,
        "features": [
          "Neelum Cinaar Resort"
        ]
      },
      {
        "category": "Executive",
        "price": 170000,
        "features": [
          "Green Valley Resort"
        ]
      },
      {
        "category": "Luxury",
        "price": 200000,
        "features": [
          "Hotel Neelum Elites"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Neelum Valley",
        "description": "",
        "highlights": [
          "05:00 AM – Pick up Islamabad members",
          "Murree Expressway Drive—Enjoy a scenic drive through the expressway with a short break at Kohala Bridge for photos.",
          "Muzaffarabad—Arrive in Muzaffarabad and stop for refreshment and a short break.",
          "Dhanni Waterfall—Continue the drive towards Keran, pausing at Dhanni Waterfall for sightseeing.",
          "Arrival at Keran—Reach Keran by late afternoon. Relax, and explore the area.",
          "Evening Activities – Enjoy a cozy bonfire & musical night.",
          "Overnight Stay – Stay at a hotel in Keran."
        ]
      },
      {
        "day": 2,
        "title": "Discover the Beautiful Taobat Jawai and Side Area",
        "description": "",
        "highlights": [
          "Morning Into the Wilderness of Taobat After breakfast in Keran, the day is dedicated to reaching the ultimate point of the trip: Taobat.",
          "Switching to jeeps for the rugged, high-altitude road.",
          "Explore the less-traveled nature and pass through scenic villages like Janwai and Sardari.",
          "Upon reaching the serene beauty of Taobat, you will explore the area.",
          "Overnight Stay – Stay at a hotel in Taobat Valley."
        ]
      },
      {
        "day": 3,
        "title": "The Beautiful Enchanting Views Arangkel Doli and Hiking",
        "description": "",
        "highlights": [
          "Breakfast at Hotel Taobat Valley",
          "Shardha Visit—Explore the surroundings of scenic beauty and cultural significance.",
          "Kel & Arang Kel Hike – Depart for Kel and hike up to Arang Kel, a scenic meadow known for its enchanting views and tranquility.",
          "Explore Arang Kel—enjoy breathtaking views, take photos, and unwind in the meadow.",
          "Return to Keran—Head back to Keran by evening.",
          "Overnight Stay at the hotel in Keran/Shardha"
        ]
      },
      {
        "day": 4,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Breakfast at Hotel Keran.",
          "Early morning wake-up call and drive to Upper Neelum.",
          "Visit Kutton and the famous Kutton Waterfall for scenic beauty.",
          "Photography and Sightseeing.",
          "Islamabad Drop-off – Begin the journey back.",
          "Arriving at Islamabad around 08:00 PM (+/- 2 hours).",
          "End of services with satisfied clients and unforgettable memories!"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI CAR New Model)",
      "Fuel- Toll Tax",
      "3 Nights’ Accommodation",
      "4 Breakfasts",
      "Jeep – Tour Guide"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating",
      "Expenses of Personal Nature",
      "Horse Ridding / Ski",
      "Any item not mentioned in services include",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature, and also food and drinks.",
      "Anything not specifically mentioned in the ‘What your Tour Price includes’ box."
    ],
    "featured": false
  },
  {
    "id": "4_days_by_road_trip_to_swat_kalam_malam_jabba_family",
    "name": "4 Days By Road Trip to Swat Kalam Malam Jabba (Family)",
    "location": "Swat Kalam Malam Jabba",
    "region": "Swat Kalam & Malam Jabba",
    "duration": 4,
    "code": "142",
    "pdf": "/images/pdf/byroadtrips/4_days_by_road_trip_to_naran_kaghan_and_babusar_top_(couple).pdf",
    "description": "Experience a 4-day journey through the scenic landscapes of Swat, Kalam, and Malam Jabba. Enjoy skiing, sightseeing, and cultural visits to historical sites. Perfect for families seeking adventure and relaxation.",
    "image": "/images/All_Tour_Images/SwatKalamMalamJabba/Picture3.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture2.webp",
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture1.jpg",
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture3.jpg",
      "/images/All_Tour_Images/SwatKalamMalamJabba/Picture4.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple",
      "Family"
    ],
    "transport": "By Road",
    "basePrice": 110000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 110000,
        "features": [
          "Demanchi hotel Kalam"
        ]
      },
      {
        "category": "Executive",
        "price": 140000,
        "features": [
          "Maria Hotel Kalam"
        ]
      },
      {
        "category": "Luxury",
        "price": 170000,
        "features": [
          "Zen Luxus Kalam",
          "Walnut Heights by Roomy, Kalam"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Malam Jabba",
        "description": "",
        "highlights": [
          "05:00 AM (Islamabad Pickup)—Pick up Islamabad members and travel through Swat Motorway.",
          "Breakfast in Shakardara for a delicious breakfast break.",
          "Visit The Shingardar Stupa, a significant Buddhist archaeological site (Gandhara civilization).",
          "Departure for Malam Jabba.",
          "Photography and Sightseeing.",
          "Travel to Malam Jabba, Pakistan’s largest and oldest ski resort.",
          "Activities: Skiing, chair lift, zip lining (personal expenses).",
          "Return to the hotel.",
          "Overnight Stay in Malam Jabba."
        ]
      },
      {
        "day": 2,
        "title": "Malam Jabba to Kalam Valley",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort.",
          "Departure for Kalam Valley.",
          "Visit Bahrain Bazaar and the side area.",
          "Head towards Kalam Valley.",
          "Photography and Sightseeing.",
          "Kalam Bazaar Visit – Stroll through Kalam Bazaar, explore local shops, and enjoy the ambiance.",
          "Overnight stay at the hotel in Kalam Valley."
        ]
      },
      {
        "day": 3,
        "title": "Waterfalls, Forest, and Lake!",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort.",
          "Departure for Mahodand Lake (If Open).",
          "Transfer to 4x4 jeeps and departure for Mahodand Lake.",
          "Ushu Forest & Surroundings – Discover Snow-Covered Ushu Forest and nearby scenic areas.",
          "Visit Blue Water: A clean river with a blue, glacier-fed water flow that is a nice spot to relax.",
          "Photography and Sightseeing.",
          "Mahodand Lake Visit—Enjoy the spectacular views of Mahodand Lake, nestled in a pristine valley.",
          "Overnight Stay in Kalam."
        ]
      },
      {
        "day": 4,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "08:00 AM Breakfast – Wake up and enjoy breakfast.",
          "Departure for Islamabad.",
          "Photography and Sightseeing.",
          "Islamabad Drop-off – Begin the journey back.",
          "Arriving at Islamabad around 08:00 PM (+/- 2 hours).",
          "End of services with satisfied clients and unforgettable memories!"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI CAR New Model)",
      "Fuel",
      "Toll Tax",
      "3 Nights’ Accommodation",
      "4 Breakfasts",
      "Jeep"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating",
      "Expenses of Personal Nature",
      "Horse Riding / Ski",
      "Any item not mentioned in services include",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature, and also food and drinks.",
      "Travel insurance"
    ],
    "featured": false
  },
  {
    "id": "4_days_trip_to_skardu_by_air_private_tours",
    "name": "4 Days Trip to Skardu (By Air) - Private Tours",
    "location": "Skardu Valley",
    "region": "Skardu Valley",
    "duration": 4,
    "code": "221",
    "pdf": "/images/pdf/byairtrips/4_days_trip_to_skardu_(by_air)_-_private_tours.pdf",
    "description": "Experience the breathtaking beauty of Skardu with a 4-day private tour. Explore the serene lakes, majestic waterfalls, and ancient carvings while enjoying luxurious accommodations and scenic flights.",
    "image": "/images/All_Tour_Images/SkarduValley/Picture11.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/SkarduValley/Picture11.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture12.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture13.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture9.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple",
      "Family",
      "Group"
    ],
    "transport": "By Air",
    "basePrice": 300000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 300000,
        "features": [
          "Hotel Himalaya",
          "Al Noor Starlet Hotel",
          "Dirleh Resort"
        ]
      },
      {
        "category": "Premier",
        "price": 350000,
        "features": [
          "Tibet",
          "Hotel Himalaya",
          "Kinara Hotel Skardu",
          "Qayyam Skardu"
        ]
      },
      {
        "category": "Executive",
        "price": 430000,
        "features": [
          "Khar Resort Skardu",
          "Guman Resort",
          "PC Lagacy",
          "Rivage Resort Skardu"
        ]
      },
      {
        "category": "Luxury",
        "price": 470000,
        "features": [
          "Khoj Resorts",
          "Rivage Resort Skardu"
        ]
      },
      {
        "category": "Ultra Luxury",
        "price": 550000,
        "features": [
          "Shangrila",
          "Himmel by Luxus",
          "Khoj Resorts"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival and the Kachura Lakes",
        "description": "",
        "highlights": [
          "Morning Flight from Islamabad to Skardu (One of world scenic flight)",
          "Meet and greet at Skardu International Airport and transferred to your hotel for check-in or directly leave for tour",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake)",
          "Upper Kachura Lake, followed by an exploration of the hidden Soq Valley",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Overnight stay in Hotel"
        ]
      },
      {
        "day": 2,
        "title": "Waterfalls, Rock and Deserts",
        "description": "",
        "highlights": [
          "Morning: After breakfast, depart for a scenic drive to the magnificent Manthoka Waterfall",
          "En route: Stop for photos at the unique Chocolate Rock",
          "Evening: Experience the Sarfaranga Cold Desert at dusk, a high-altitude desert with stunning dunes",
          "Overnight stay at hotel"
        ]
      },
      {
        "day": 3,
        "title": "Fort, Lakes, and Ancient Carvings",
        "description": "",
        "highlights": [
          "Morning: Following breakfast, visit Shigar Fort",
          "Visit the beautiful Blind Lake",
          "Afternoon: Visit the expansive Sadpara Lake and the nearby Buddha Rock, a 7th-century carving",
          "Overnight stay at Hotel"
        ]
      },
      {
        "day": 4,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Transfer: You will be transferred to Skardu Airport for your return flight to Islamabad, filled with unforgettable memories"
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat - One way)",
      "Private Transport (Parado TZ 2004-07 New Model) (1 Vehicle)",
      "Fuel- Toll Tax",
      "3 Nights’ Accommodation",
      "3 Breakfast"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Personal Expenses, Recreation, Boating, jeeps etc.",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "5_days_by_air_trip_to_astor_minimarg_and_skardu_couple",
    "name": "5 Days By Air Trip to Astor Minimarg and Skardu (Couple)",
    "location": "Astor Minimarg",
    "region": "Minimarg Astor Valley",
    "duration": 5,
    "code": "202",
    "pdf": "/images/pdf/byairtrips/5_days_by_air_trip_to_astor_minimarg_and_skardu_(couple).pdf",
    "description": "Join us for an unforgettable group adventure exploring the scenic beauty of Astor Minimarg and Skardu. Perfect for solo travelers, friends, and families looking to explore together. Experience the majestic mountains, historic forts, and unparalleled hospitality of Baltistan.",
    "image": "/images/All_Tour_Images/MinimargAstor/Picture1.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/MinimargAstor/Picture1.jpg",
      "/images/All_Tour_Images/MinimargAstor/Picture2.jpg",
      "/images/All_Tour_Images/MinimargAstor/Picture3.jpg",
      "/images/All_Tour_Images/MinimargAstor/Picture4.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Air",
    "basePrice": 430000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 430000,
        "features": [
          "Minimarg Camping Side (2 nights)",
          "Qayyam Hotel Skardu (deluxe room) (2 nights)"
        ]
      },
      {
        "category": "Executive",
        "price": 490000,
        "features": [
          "Khar Hotel Skardu (deluxe room) (1 night)",
          "Minimarg Camping Side (2 nights)",
          "Khoj resort Skardu (deluxe room) (1 night)"
        ]
      },
      {
        "category": "Luxury",
        "price": 580000,
        "features": [
          "Minimarg Army Camping Side (2 nights)",
          "Khoj Resorts (deluxe room) (2 nights)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival and the Kachura Lakes",
        "description": "",
        "highlights": [
          "Morning Flight from Islamabad to Skardu (One of world scenic flight)",
          "Meet and greet at Skardu International Airport and transferred to your hotel for check-in or directly leave for tour",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake)",
          "Upper Kachura Lake, followed by an exploration of the hidden Soq Valley",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Overnight stay in Hotel"
        ]
      },
      {
        "day": 2,
        "title": "Roof of the World and Burzil Top",
        "description": "",
        "highlights": [
          "Breakfast at Skardu Valley",
          "Depart for Deosai National Park, one of the highest plateaus in the world",
          "Visit Sadpara Lake for photography and sightseeing",
          "Explore the stunning landscapes, meadows, and wildlife of Deosai",
          "Visit Sheosar lake",
          "Move to Burzil Top & Minimarg Domail",
          "Visit Blue Water: A clean river with a blue, glacier-fed water flow that is a nice spot to relax",
          "Dinner & Night Stay: Overnight at the hotel in Domail"
        ]
      },
      {
        "day": 3,
        "title": "Rainbow Lakes, and Indian Border",
        "description": "",
        "highlights": [
          "Breakfast at Astor – Stop for breakfast and refreshments",
          "Depart for Minimarg, the last village of Pakistan before the Indian border",
          "Visit the village and explore its unique culture and way of life",
          "Head towards the base camp of Kargil and spend some time admiring the stunning views of the surrounding mountains",
          "Visit the famous Rainbow Lake of Minimarg, known for its incredible natural beauty and vibrant colors",
          "Return to Chilim",
          "Dinner & Night stay at Minimarg Camping Side"
        ]
      },
      {
        "day": 4,
        "title": "Back to Skardu",
        "description": "",
        "highlights": [
          "Breakfast at Chilim",
          "Start Travel for Skardu Valley",
          "Begin the journey towards Astor with stops",
          "Reach Skardu Opportunities: Optional activities shopping for local souvenirs, or a relaxing walk in the Skardu Bazaar",
          "Back to Hotel",
          "Dinner & Night Stay: Overnight at the hotel in Skardu"
        ]
      },
      {
        "day": 5,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final breakfast at the hotel, reminiscing about your incredible journey",
          "Drop-off at Airport: Depending on your flight schedule, you will be transferred to Skardu International Airport for your departure",
          "End of Services: You will fly out with fond memories of the majestic mountains, historic forts, and unparalleled hospitality of Baltistan"
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat- One way)",
      "Private Transport (Parado TZ 2004-07 New Model) (1 Vehicle)",
      "Fuel- Toll Tax",
      "4 Nights’ Accommodation",
      "5 Breakfast"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Personal Expenses, Recreation, Boating, jeeps etc.",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "5_days_by_air_trip_to_fairy_meadows_skardu_valley",
    "name": "5 Days By Air Trip to Fairy Meadows + Skardu Valley",
    "location": "Fairy Meadows",
    "region": "Fairy Meadows Nanga Base Camp",
    "duration": 5,
    "code": "211",
    "pdf": "/images/pdf/byairtrips/5_days_by_air_trip_to_fairy_meadows_+_skardu_valley.pdf",
    "description": "Experience the breathtaking beauty of Fairy Meadows and Skardu Valley with a 5-day tour by air. Explore the serene Kachura Lakes, the majestic Nanga Parbat, and the charming Basho Meadows. Enjoy a mix of adventure and relaxation with 4x4 Jeep safaris, trekking, and leisure time at scenic locations.",
    "image": "/images/All_Tour_Images/FairyMeadows/Picture1.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/FairyMeadows/Picture2.jpg",
      "/images/All_Tour_Images/FairyMeadows/Picture3.jpg",
      "/images/All_Tour_Images/FairyMeadows/Picture4.png",
      "/images/All_Tour_Images/FairyMeadows/Picture5.png",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Air",
    "basePrice": 450000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 450000,
        "features": [
          "Al Noor Starlet Hotel / Summit Hotel (deluxe room) (2 nights)",
          "Fairy Meadows View Camping Side (2 nights)"
        ]
      },
      {
        "category": "Executive",
        "price": 500000,
        "features": [
          "Raikot Sarai Fairy meadows (2 nights)",
          "Khar Resort Skardu (deluxe room) (2 nights)",
          "Qayam Hotel Skardu (deluxe room)"
        ]
      },
      {
        "category": "Luxury",
        "price": 580000,
        "features": [
          "Raikot Sarai fairy meadows (2 nights)",
          "Khoj Resorts (deluxe room) (2 night)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival and the Kachura Lakes",
        "description": "",
        "highlights": [
          "Morning Flight from Islamabad to Skardu (One of world scenic flight)",
          "Meet and greet at Skardu International Airport",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake)",
          "Explore Upper Kachura Lake and the hidden Soq Valley",
          "Enjoy leisure time and stunning sunset views",
          "Overnight stay in Skardu"
        ]
      },
      {
        "day": 2,
        "title": "Skardu to Fairy Meadows Camp Side",
        "description": "",
        "highlights": [
          "Breakfast at Skardu Valley",
          "Transfer to the Nanga Parbat region (approx. 4.5 to 5 hours drive)",
          "Arrive at Raikot Bridge and switch to a local 4x4 Jeep",
          "Adventurous ride (approx. 1.5 hours) to Tattu Village",
          "Begin the trek (approx. 3-4 hours) from Tattu Village to Fairy Meadows",
          "Check into your hut or campsite, have dinner",
          "Enjoy the breathtaking view of Nanga Parbat's 'Killer Mountain' face under the stars",
          "Overnight: Fairy Meadows (Hut/Camping)"
        ]
      },
      {
        "day": 3,
        "title": "Nanga Parbat Base Camp Trek",
        "description": "",
        "highlights": [
          "Enjoy breakfast with an iconic view of Nanga Parbat",
          "Begin the 4-6 hour round-trip trek to the Nanga Parbat View Point/Bayal Camp",
          "Bayal is a lush, forested area about 1.5-2 hours from Fairy Meadows",
          "Further trek (about 2-3 hours one-way from Bayal) to Nanga Parbat Base Camp",
          "Spend time soaking in the majesty of the 9th highest mountain in the world",
          "Overnight: Fairy Meadows (Hut/Camping)"
        ]
      },
      {
        "day": 4,
        "title": "Return to Skardu City",
        "description": "",
        "highlights": [
          "Enjoy a final morning at the meadows",
          "Begin the descent trek (approx. 2.5-3 hours) back to Tattu Village",
          "Take the 4x4 Jeep ride back to Raikot Bridge",
          "Meet your main vehicle at Raikot Bridge and begin the return drive (approx. 4.5 to 5 hours) back to Skardu City",
          "Check into your hotel in Skardu",
          "Overnight: Skardu (Hotel)"
        ]
      },
      {
        "day": 5,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Enjoy a final breakfast at the hotel",
          "Drop-off at Skardu International Airport for your departure",
          "End of Services: Fly out with fond memories of the majestic mountains and unparalleled hospitality of Baltistan"
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat - One way)",
      "Private Transport (Parado TZ 2004-07 New Model) (1 Vehicle)",
      "Fuel- Toll Tax",
      "4 Nights’ Accommodation",
      "5 Breakfast"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Personal Expenses, Recreation, Boating, jeeps etc.",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "5_days_trip_to_skardu_by_air_private_tours",
    "name": "5 Days Trip to Skardu (By Air) - Private Tours",
    "location": "Skardu Valley",
    "region": "Skardu Valley",
    "duration": 5,
    "code": "222",
    "pdf": "/images/pdf/byairtrips/5_days_trip_to_skardu_(by_air)_-_private_tours.pdf",
    "description": "Join us for an unforgettable group adventure in Skardu, exploring the serene beauty of Kachura Lakes, the majestic Manthoka Waterfall, the cultural richness of Shigar Valley, and the lush Basho Meadows. Perfect for solo travelers, friends, and families looking to explore together.",
    "image": "/images/All_Tour_Images/SkarduValley/Picture6.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/SkarduValley/Picture6.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture7.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture8.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture9.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple",
      "Family",
      "Group"
    ],
    "transport": "By Air",
    "basePrice": 330000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 330000,
        "features": [
          "Hotel Himalaya",
          "Al Noor Starlet Hotel",
          "Dirleh Resort",
          "(Deluxe room)"
        ]
      },
      {
        "category": "Premier",
        "price": 380000,
        "features": [
          "Tibet",
          "Hotel Himalaya",
          "(Executive room)",
          "Kinara Hotel Skardu",
          "Qayyam Skardu"
        ]
      },
      {
        "category": "Executive",
        "price": 450000,
        "features": [
          "Khar Resort Skardu",
          "Guman resort",
          "PC Lagacy",
          "Rivage Resort Skardu"
        ]
      },
      {
        "category": "Luxury",
        "price": 510000,
        "features": [
          "Khoj Resorts (Deluxe room)",
          "Rivage Resort Skardu (Executive rooms)"
        ]
      },
      {
        "category": "Ultra Luxury",
        "price": 600000,
        "features": [
          "Shangrila (Executive Room)",
          "Himmel by Luxus (Deluxe room)",
          "Khoj Resorts (River view loft villa)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival and the Kachura Lakes",
        "description": "",
        "highlights": [
          "Morning Flight from Islamabad to Skardu (One of world scenic flight)",
          "Meet and greet at Skardu International Airport and transferred to your hotel for check-in or directly leave for tour",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake)",
          "Upper Kachura Lake, followed by an exploration of the hidden Soq Valley",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Overnight stay in Hotel"
        ]
      },
      {
        "day": 2,
        "title": "Waterfalls, Rock and Deserts",
        "description": "",
        "highlights": [
          "Morning: After breakfast, depart for a scenic drive to the magnificent Manthoka Waterfall",
          "En route: Stop for photos at the unique Chocolate Rock",
          "Evening: Experience the Sarfaranga Cold Desert at dusk, a high-altitude desert with stunning dunes",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 3,
        "title": "Forts, Lakes, and Ancient Carvings",
        "description": "",
        "highlights": [
          "Morning: After breakfast, depart for a scenic drive to the Shigar Valley",
          "Visit Shigar Fort",
          "Visit the beautiful Blind Lake",
          "Afternoon: Visit the expansive Sadpara Lake and the nearby Buddha Rock, a 7th-century carving",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 4,
        "title": "Basho Meadows and Basho Village",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Transport: Transfer to 4x4 jeeps for the adventurous drive to Basho Valley",
          "Sightseeing: Visit Basho Village and the Basho Suspension Bridge, with short stops for views along the way",
          "Explore: Discover the lush, green Basho Meadows and explore the valley",
          "Back to Hotel",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 5,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Transfer: You will be transferred to Skardu Airport for your return flight to Islamabad, filled with unforgettable memories"
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat - One way)",
      "Private Transport (Parado TZ 2004 -07 New Model) (1 Vehicle)",
      "Fuel- Toll Tax",
      "4 Nights’ Accommodation",
      "5 Breakfast"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Personal Expenses, Recreation, Boating, jeeps etc.",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "5_days_to_hunza_valley_by_air_private_tour",
    "name": "5 Days to Hunza Valley (By Air) - Private Tour",
    "location": "Hunza Valley",
    "region": "Hunza Valley",
    "duration": 5,
    "code": "241",
    "pdf": "/images/pdf/byairtrips/5_days_to_hunza_valley_(by_air)_-_private_tour.pdf",
    "description": "Experience a 5-day private tour to the stunning Hunza Valley, traveling by air from Islamabad to Skardu. Explore ancient fortresses, vibrant bazaars, and breathtaking landscapes including the Attabad Lake and Passu Cones. Enjoy comfortable accommodations and private transport throughout your journey.",
    "image": "/images/All_Tour_Images/HunzaValley/Picture5.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/HunzaValley/Picture6.webp",
      "/images/All_Tour_Images/HunzaValley/Picture7.png",
      "/images/All_Tour_Images/HunzaValley/Picture8.jpg",
      "/images/All_Tour_Images/HunzaValley/Picture9.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple",
      "Family",
      "Group"
    ],
    "transport": "By Air",
    "basePrice": 350000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 350000,
        "features": [
          "Shaheen Resort Hunza (SRH)",
          "Hunza Blossom In",
          "Karakuram Hotel",
          "Hotel Himalaya (Deluxe room Hunza)"
        ]
      },
      {
        "category": "Premier",
        "price": 390000,
        "features": [
          "Summit Embassy Hotel",
          "Hotel Himalaya (Executive room)",
          "Kinara Hotel Skardu",
          "Qayyam Skardu"
        ]
      },
      {
        "category": "Executive",
        "price": 470000,
        "features": [
          "Hard Rock Hunza Resort",
          "Best Western",
          "Villas Roomy Resort",
          "Khar Resort Hunza"
        ]
      },
      {
        "category": "Luxury",
        "price": 530000,
        "features": [
          "Horizon Resort Attabad Lake (Deluxe room)",
          "Offto Resort Hunza"
        ]
      },
      {
        "category": "Ultra Luxury",
        "price": 620000,
        "features": [
          "Best Western",
          "Darbar Hotel",
          "Hunza Serena Hotel",
          "PC Skardu for 1 night (Deluxe room Hunza Hotel)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Fly to Skardu, Immediate Transfer to Hunza",
        "description": "",
        "highlights": [
          "Morning flight from Islamabad to Skardu",
          "Drive from Skardu to Karimabad, Hunza via Skardu Road and Karakoram Highway",
          "Key Stop: Astak Nala, Confluence of three mountains",
          "Stop at the Rakaposhi Viewpoint near Gilgit for lunch",
          "Evening arrival in Karimabad, check into hotel"
        ]
      },
      {
        "day": 2,
        "title": "Hunza History & Sunset Panorama",
        "description": "",
        "highlights": [
          "Buffet breakfast at the resort",
          "Visit Altit Fort and Baltit Fort",
          "Explore Karimabad Bazaar for local souvenirs",
          "Drive up to Duikar (Eagle's Nest) for sunset panorama"
        ]
      },
      {
        "day": 3,
        "title": "Upper Hunza Excursion - Lakes and Ancient Carvings",
        "description": "",
        "highlights": [
          "Buffet breakfast at the resort",
          "Visit Attabad Lake",
          "Visit Passu Cones and Hussaini Suspension Bridge",
          "Optional drive towards Sost"
        ]
      },
      {
        "day": 4,
        "title": "Hunza to Skardu Road Journey",
        "description": "",
        "highlights": [
          "Buffet breakfast at the resort",
          "Return drive from Karimabad to Skardu City",
          "Stop for photos at viewpoints",
          "Visit Skardu Bazaar for local handicrafts"
        ]
      },
      {
        "day": 5,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Buffet breakfast at the resort",
          "Transfer to Skardu Airport for return flight to Islamabad"
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat - One way)",
      "Private Transport (Parado TZ 2004-07 New Model)",
      "Fuel- Toll Tax",
      "4 Nights’ Accommodation",
      "4 Breakfast"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Personal Expenses, Recreation, Boating, jeeps etc.",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "6_days_by_air_trip_to_astor_minimarg_and_skardu_couple",
    "name": "6 Days By Air Trip to Astor Minimarg and Skardu",
    "location": "Astor Minimarg",
    "region": "Minimarg Astor Valley",
    "duration": 6,
    "code": "203",

    "description": "Experience a 6-day adventure exploring the scenic beauty of Astor Minimarg and Skardu. Enjoy breathtaking views, cultural exchanges, and unforgettable experiences in some of the most beautiful locations in Pakistan.",
    "pdf": "/images/pdf/byairtrips/6_days_by_air_trip_to_astor_minimarg_and_skardu_(couple).pdf",
    "image": "/images/All_Tour_Images/MinimargAstor/Picture8.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/MinimargAstor/Picture9.jpg",
      "/images/All_Tour_Images/MinimargAstor/Picture10.jpg",
      "/images/All_Tour_Images/MinimargAstor/Picture11.jpg",
      "/images/All_Tour_Images/MinimargAstor/Picture12.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Air",
    "basePrice": 530000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 530000,
        "features": [
          "Rama Meadows Camping Side (1 night)",
          "Minimarg Camping Side (1 night)",
          "Tarishing Camping Side (1 night)",
          "Qayyam Hotel Skardu (deluxe room) (2 nights)"
        ]
      },
      {
        "category": "Executive",
        "price": 580000,
        "features": [
          "Rama Meadows Camping Side (1 night)",
          "Minimarg Camping Side (1 night)",
          "Tarishing Camping Side (1 night)",
          "Khar Hotel Skardu (deluxe room) (1 night)",
          "Khoj resort Skardu (deluxe room) (1 night)"
        ]
      },
      {
        "category": "Luxury",
        "price": 640000,
        "features": [
          "Rama Meadows Camping Side (1 night)",
          "Minimarg Camping Side (1 night)",
          "Tarishing Camping Side (1 night)",
          "Khoj Resorts (deluxe room) (2 nights)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival and the Kachura Lakes",
        "description": "Explore the charming beauty of Kachura and Shangrila Lake.",
        "highlights": [
          "Morning Flight from Islamabad to Skardu (One of world scenic flight)",
          "Meet and greet at Skardu International Airport and transferred to your hotel for check-in or directly leave for tour.",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake).",
          "Upper Kachura Lake, followed by an exploration of the hidden Soq Valley.",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Overnight stay in Hotel."
        ]
      },
      {
        "day": 2,
        "title": "Roof of the World and Rama Meadows",
        "description": "Departure for Rama. Take a full-day 4x4 Jeep Safari into the magnificent Deosai National Park.",
        "highlights": [
          "Breakfast at Skardu Valley",
          "Depart for Deosai National Park, one of the Highest Plateaus in the world called Roof of the World.",
          "Visit Sadpara Lake Photography and Sightseeing.",
          "Explore the stunning landscapes, meadows, and wildlife of Deosai",
          "Visit Sheosar lake Move to Rama Meadows & Rama Lake.",
          "Astor City",
          "Visit the Beautiful Rama Lake and spend some time exploring the area.",
          "Visit Blue Water: A clean river with a blue, glacier-fed water flow that is a nice spot to relax.",
          "Night Stay: at the Camping in Rama."
        ]
      },
      {
        "day": 3,
        "title": "Tarishing & Sunset Panorama",
        "description": "The gateway for trekkers heading to the Rupal Face of Nanga Parbat.",
        "highlights": [
          "Morning: Enjoy an Open Air breakfast at the Rama Meadows.",
          "Move to Tarishing Rupal Face of Nanga Parbat.",
          "Explore local life: wooden houses, terraced fields, and warm hospitality.",
          "Short hike to nearby ridges for breathtaking views of Rupal Face of Nanga Parbat.",
          "Evening cultural exchange with locals (stories, folk songs).",
          "Night Stay: in Guesthouse surrounded by pine forests."
        ]
      },
      {
        "day": 4,
        "title": "Rainbow Lakes, and Indian Border",
        "description": "Experience the scenic beauty of Domail Valley and Rainbow Lake.",
        "highlights": [
          "Breakfast at Tarishing",
          "Depart for Minimarg, the last village of Pakistan before the Indian border.",
          "Move to Burzil Top & Minimarg Domail.",
          "Visit the village and explore its unique culture and way of life",
          "Head towards the base camp of Kargil and spend some time admiring the stunning views of the surrounding mountains",
          "Visit the famous Rainbow Lake of Minimarg, known for its incredible natural beauty and vibrant colors.",
          "Return to Chilim Dinner & Night stay at minimarg Camping Side"
        ]
      },
      {
        "day": 5,
        "title": "Domail to Skardu Road Journey",
        "description": "Enjoy a final relaxed morning. Departure to Skardu.",
        "highlights": [
          "Breakfast at Minimarg Domail",
          "Start Travel for Skardu Valley",
          "Begin the journey towards Domail with stops at:",
          "Short Break at Deosai National Park",
          "Reach Skardu Opportunities. Optional activities shopping for local souvenirs, or a relaxing walk in the Skardu Bazaar.",
          "Visit the Skardu Bazaar for local handicrafts, dry fruits, and Balti souvenirs.",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 6,
        "title": "Departure to Islamabad",
        "description": "Take flight back from Skardu Airport.",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort.",
          "Transfer: You will be transferred to Skardu Airport for your return flight to Islamabad, filled with unforgettable memories."
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat - One way)",
      "Private Transport (Parado TZ 2004 -07 New Model) (1 Vehicle)",
      "Fuel- Toll Tax",
      "5 Nights’ Accommodation",
      "5 Breakfast"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Personal Expenses, Recreation, Boating, jeeps etc.",
      "Any items not mentioned in the services."
    ],
    "featured": false
  },
  {
    "id": "6_days_by_road_trip_to_hunza_valley_and_khunjerab_pass_couple",
    "name": "6 Days By Road Trip to Hunza Valley and Khunjerab Pass (Couple)",
    "location": "Hunza Valley",
    "region": "Hunza Valley",
    "duration": 6,
    "code": "182",
   "pdf": "/images/pdf/byairtrips/6_days_trip_to_1_day_skardu_and_5_days_hunza_(by_air)_-_private_tour.pdf",
    "description": "Experience a 6-day journey through the breathtaking landscapes of Hunza Valley and Khunjerab Pass. Enjoy scenic views, historical sites, and cultural experiences while traveling by road.",
    "image": "/images/All_Tour_Images/HunzaValley/Picture8.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/HunzaValley/Picture9.jpg",
      "/images/All_Tour_Images/HunzaValley/Picture11.jpg",
      "/images/All_Tour_Images/HunzaValley/Picture12.jpg",
      "/images/All_Tour_Images/HunzaValley/Picture1.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 270000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 270000,
        "features": [
          "Tarangfa Hotel Chilas",
          "Hotel Himalaya / Al Noor Starlet Hotel / Dirleh Resort (Deluxe room)"
        ]
      },
      {
        "category": "Premier",
        "price": 310000,
        "features": [
          "Indus Hotel Chilas",
          "Tibet / Hotel Himalaya (Executive room) / Summit Hotel Skardu"
        ]
      },
      {
        "category": "Executive",
        "price": 380000,
        "features": [
          "Grace Continental Child",
          "Khar Resort Skardu / Guman resort / Qayyam Skardu / Rivage Resort Skardu"
        ]
      },
      {
        "category": "Luxury",
        "price": 430000,
        "features": [
          "Shangrila Chilas",
          "Khoj Resorts (Deluxe room) or Rivage Resort Skardu (Executive rooms)"
        ]
      },
      {
        "category": "Ultra Luxury",
        "price": 500000,
        "features": [
          "Shangrila Chilas",
          "Shangrila (Executive Room) / Himmel by Luxus (Deluxe Room) / Khoj Resorts (River view loft villa)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Chillas",
        "description": "",
        "highlights": [
          "Journey to Chillas 04:00 AM (Islamabad Pickup)",
          "Travel along the Hazara Motorway—head towards Balakot along the Karakoram Highway (KKH)",
          "Breakfast at Balakot—Stop for breakfast and refreshments",
          "Sightseeing & Scenic Stops – Short stops for scenic views, waterfalls, and the Kaghan Valley",
          "Lunch at Besal—Relax and have lunch (self-service)",
          "Visit Lulusar Lake and Babusar Top",
          "Arrival at Chilas—Reach Chilas by 7:00 PM",
          "Overnight Stay – Settle in for a restful night in Chilas"
        ]
      },
      {
        "day": 2,
        "title": "Chilas to Hunza & Junction",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Start travel for Skardu",
          "Visit Nanga Parbat View Point",
          "Departure for Naltar Valley Visit: (Zaro Point, alpine lakes like Satrangi Lake and the Blue Lake)",
          "Stop at the Rakaposhi Viewpoint near Gilgit with a spectacular close-up view of the 7,788 m peak",
          "Evening: Arrive in Karimabad, check into your hotel, and rest and relax",
          "Overnight stay at a hotel"
        ]
      },
      {
        "day": 3,
        "title": "Hunza Exploration",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Immerse yourself in the region's history by visiting the two ancient fortresses: the 900-year-old Altit Fort and the 700-year-old Baltit Fort",
          "Afternoon: Explore the Karimabad Bazaar for local souvenirs, traditional shawls, and organic Hunzai products",
          "Sunset: Drive up to Duikar (Eagle's Nest) for a breathtaking sunset panorama over the surrounding peaks, including Ultar Sar and Ladyfinger",
          "Overnight stay in a hotel"
        ]
      },
      {
        "day": 4,
        "title": "Hunza History & Sunset Panorama",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Full-Day Excursion: Drive north into Upper Hunza/Gojal Valley",
          "Key Stops: Visit the stunning Attabad Lake",
          "Continue north to the dramatic Passu Cones and the nearby thrilling Hussaini Suspension Bridge",
          "Optional: If time and conditions permit, you can drive further north towards Sost",
          "Note: A full-day trip to Khunjerab Pass",
          "Overnight stay at Hunza"
        ]
      },
      {
        "day": 5,
        "title": "Hunza to Naran",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Road Journey through Karakoram",
          "Short stay in Nanga Parbat View Point, Mountain Junction Point",
          "Short at Babusar Top",
          "Arrival in Naran and transfer to the hotel",
          "Dinner 9:00 pm",
          "Overnight stay in Naran Valley"
        ]
      },
      {
        "day": 6,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Travel to Jheel Saif-ul-Malook via jeeps",
          "Visit Jheel Saif-ul-Malook (if we have time)",
          "Sightseeing & Photography: Jheel Saif-ul-malook",
          "Return to Islamabad: Arrival around 08:30 PM",
          "End of our services with satisfied clients"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "5 Nights’ Accommodation",
      "Fuel- Toll Tax",
      "5 Breakfast",
      "Toll-Tax-Challan"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating",
      "Jeep Expenses of Personal Nature",
      "Horse Riding / Ski-Rafting",
      "Any item not mentioned in services include",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature, and also food and drinks",
      "Travel insurance"
    ],
    "featured": false
  },
  {
    "id": "6_days_trip_to_1_day_skardu_and_5_days_hunza_by_air_private_tour",
    "name": "6 Days Trip to 1 Day Skardu and 5 Days Hunza (By Air) - Private Tour",
    "location": "Skardu and Hunza",
    "region": "Skardu & Hunza",
    "duration": 6,
    "code": "251",
    "pdf": "/images/pdf/byairtrips/6_days_trip_to_1_day_skardu_and_5_days_hunza_(by_air)_-_private_tour.pdf",
    "description": "Experience the breathtaking beauty of Skardu and Hunza over a 6-day private tour. Enjoy scenic flights, explore ancient fortresses, and witness stunning landscapes including Kachura Lakes, Rakaposhi Viewpoint, and Attabad Lake. Perfect for solo travelers, friends, and families.",
    "image": "/images/All_Tour_Images/SkarduValley/Picture2.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/SkarduValley/Picture8.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture2.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture3.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture4.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple",
      "Family",
      "Group"
    ],
    "transport": "By Air",
    "basePrice": 450000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 450000,
        "features": [
          "Summit Embassy Hotel / Qayyam Skardu 2 Night",
          "Qayam Resort Hunza / Roomy Dastan Hunza 3 Night"
        ]
      },
      {
        "category": "Executive",
        "price": 510000,
        "features": [
          "Khar Resort Skardu / Guman resort / PC Lagacy / Rivage Resort Skardu",
          "Hard Rock Hunza Resort / Villas Roomy Resort Hunza"
        ]
      },
      {
        "category": "Luxury",
        "price": 620000,
        "features": [
          "Khoj Resorts (Deluxe room) or Rivage Resort Skardu (Executive rooms) Skardu",
          "Horizon Resort Attabad Lake (Deluxe room) or Offto Resort Hunza"
        ]
      },
      {
        "category": "Ultra Luxury",
        "price": 700000,
        "features": [
          "Shangrila (Executive Room) / Himmel by Luxus (Deluxe room) /Khoj Resorts (River view loft villa) (Deluxe room Skardu Hotel)",
          "Best Western / Darbar Hotel / Hunza Serena Hotel (Deluxe room Hunza Hotel)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival and the Kachura Lakes",
        "description": "",
        "highlights": [
          "Morning Flight from Islamabad to Skardu (One of world scenic flight)",
          "Meet and greet at Skardu International Airport and transferred to your hotel for check-in or directly leave for tour",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake)",
          "Upper Kachura Lake, followed by an exploration of the hidden Soq Valley",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Overnight stay in Hotel"
        ]
      },
      {
        "day": 2,
        "title": "Skardu to Hunza Road Journey (KKH)",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Morning: Check out early. Leave for Long travel to Hunza",
          "Road Transit: Drive from Skardu to Karimabad, Hunza. The drive is along the Skardu Road, merging onto the Karakoram Highway (KKH)",
          "Key Stop: Astak Nala, Confluence of three mountain",
          "Stop at the Rakaposhi Viewpoint near Gilgit for lunch with a spectacular close-up view of the 7,788m peak",
          "Evening: Arrive in Karimabad, check into your hotel, rest and relax",
          "Overnight stay in Hotel"
        ]
      },
      {
        "day": 3,
        "title": "Hunza History & Sunset Panorama",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Immerse yourself in the region's history by visiting the two ancient fortresses: the 900-year-old Altit Fort and the 700-year-old Baltit Fort (Anyone of these)",
          "Afternoon: Explore the Karimabad Bazaar for local souvenirs, traditional shawls, and organic Hunzai products (like dried apricots and apricot oil)",
          "Sunset: Drive up to Duikar (Eagle's Nest) for a breathtaking sunset panorama over the surrounding peaks, including Ultar Sar and Ladyfinger",
          "Overnight stay in Hotel"
        ]
      },
      {
        "day": 4,
        "title": "Upper Hunza Excursion",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Full Day Excursion: Drive north into Upper Hunza / Gojal Valley",
          "Key Stops: Visit the stunning Attabad Lake (the mesmerizing turquoise color is beautiful in November). Continue north to the dramatic, jagged Passu Cones and the nearby thrilling Hussaini Suspension Bridge",
          "Optional: If time and conditions permit, you can drive further north towards Sost (the last town before the Chinese border). Note: A full day trip to Khunjerab Pass is not recommended in winter, due to extreme snow and cold. (Can be managed at Guest Choice)",
          "Overnight stay at Hunza"
        ]
      },
      {
        "day": 5,
        "title": "Hunza to Skardu Road Journey",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Road Transit: Begin the return drive from Karimabad back to Skardu City",
          "Activity: Stop for photos at any viewpoints you missed on the way up. The journey will take approximately 8–10 hours",
          "Evening: Arrive back in Skardu, check into your hotel",
          "Visit the Skardu Bazaar for local handicrafts, dry fruits, and Balti souvenirs",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 6,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Transfer: You will be transferred to Skardu Airport for your return flight to Islamabad, filled with unforgettable memories"
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat - One way)",
      "Private Transport (Parado TZ 2004-07 New Model) (1 Vehicle)",
      "Fuel- Toll Tax",
      "5 Nights’ Accommodation",
      "5 Breakfast"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Personal Expenses, Recreation, Boating, jeeps etc.",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "6_days_trip_to_skardu_by_air_private_tours",
    "name": "6 Days Trip to Skardu (By Air) - Private Tours",
    "location": "Skardu Valley",
    "region": "Skardu Valley",
    "duration": 6,
    "code": "223",
 "pdf": "/images/pdf/byairtrips/6_days_trip_to_skardu_(by_air)_-_private_tours.pdf",
    "description": "Experience the breathtaking beauty of Skardu with a 6-day private tour. Enjoy scenic flights, explore serene lakes, majestic waterfalls, high-altitude deserts, and vibrant cultural sites. Perfect for solo travelers, friends, and families.",
    "image": "/images/All_Tour_Images/SkarduValley/Picture7.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/SkarduValley/Picture8.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture2.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture3.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture4.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple",
      "Family",
      "Group"
    ],
    "transport": "By Air",
    "basePrice": 360000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 360000,
        "features": [
          "Rivage Resort Hotel Skardu",
          "Qayyam Skardu"
        ]
      },
      {
        "category": "Executive",
        "price": 400000,
        "features": [
          "Dera Lamsa Resort Skardu",
          "Guman resort",
          "PC Lagacy",
          "Rivage Resort Skardu"
        ]
      },
      {
        "category": "Luxury",
        "price": 450000,
        "features": [
          "Rivage Resort Shigar",
          "Himmel by Luxus (Deluxe room)",
          "Khoj Resorts (River view loft villa)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival and the Kachura Lakes",
        "description": "Explore the charming Beauty of Kachura and Shangrila Lake",
        "highlights": [
          "Morning Flight from Islamabad to Skardu",
          "Meet and greet at Skardu International Airport",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake)",
          "Upper Kachura Lake, followed by an exploration of the hidden Soq Valley",
          "Enjoy leisure time and stunning sunset views",
          "Overnight stay in Hotel"
        ]
      },
      {
        "day": 2,
        "title": "Waterfalls and Deserts",
        "description": "Discover the Beautiful Waterfall and Desert",
        "highlights": [
          "After breakfast, depart for a scenic drive to the magnificent Manthoka Waterfall",
          "Stop for photos at the unique Chocolate Rock",
          "Experience the Sarfaranga Cold Desert at dusk",
          "Overnight stay at Shigar Valley"
        ]
      },
      {
        "day": 3,
        "title": "Forts, Lakes, and Ancient Carvings",
        "description": "Experience the vibrant culture and scenic beauty of Shigar Valley",
        "highlights": [
          "After breakfast, depart for a scenic drive to the Shigar Fort",
          "Visit the beautiful Blind Lake",
          "Visit the expansive Sadpara Lake and the nearby Buddha Rock, a 7th-century carving",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 4,
        "title": "Basho Meadows Basho Village",
        "description": "Explore the charming Beauty of Basho Meadows",
        "highlights": [
          "Enjoy a final buffet breakfast at the resort",
          "Transfer to 4x4 jeeps for the adventurous drive to Basho Valley",
          "Visit Basho Village and the Basho Suspension Bridge",
          "Discover the lush, green Basho Meadows and explore the valley",
          "Back to Hotel",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 5,
        "title": "Skardu City & Chunda Valley Optional Visit",
        "description": "Enjoy a final relaxed morning",
        "highlights": [
          "Visit the Skardu Bazaar for local handicrafts, dry fruits, and Balti souvenirs",
          "Enjoy a final buffet breakfast at the resort",
          "Buffer Time/Optional Visit: Depending on the weather or interests, you can revisit a favorite spot or take a relaxing walk along the Indus River bank",
          "Walk down to Nangsoq Organic Village",
          "Back to Hotel",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 6,
        "title": "Departure to Islamabad",
        "description": "Take flight back from Skardu Airport",
        "highlights": [
          "Enjoy a final buffet breakfast at the resort",
          "Transfer to Skardu Airport for your return flight to Islamabad"
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat - One way)",
      "Private Transport (Parado TZ 2004-07 New Model) (1 Vehicle)",
      "Entry Tickets - Jeeps",
      "5 Nights’ Accommodation",
      "5 Breakfast"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Fuel- Toll Tax",
      "Personal Expenses, Recreation, Boating, etc.",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "7_days_by_air_trip_to_skardu_valley_for_couple",
    "name": "7 Days By Air Trip to Skardu Valley for Couple",
    "location": "Skardu Valley",
    "region": "Skardu Valley",
    "duration": 7,
    "code": "224",
    "pdf": "/images/pdf/byairtrips/7_days_by_air_trip_to_skardu_valley_for_couple.pdf",
    "description": "Experience the breathtaking beauty of Skardu Valley over 7 days, exploring lakes, waterfalls, deserts, forts, and ancient carvings. Enjoy scenic flights, luxurious accommodations, and unforgettable adventures in the heart of nature.",
    "image": "/images/All_Tour_Images/SkarduValley/Picture4.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/SkarduValley/Picture8.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture2.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture3.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture4.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Air",
    "basePrice": 400000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 400000,
        "features": [
          "Hotel Himalaya",
          "Al Noor Starlet Hotel",
          "Dirleh Resort"
        ]
      },
      {
        "category": "Premier",
        "price": 460000,
        "features": [
          "Tibet",
          "Hotel Himalaya",
          "Kinara Hotel Skardu",
          "Qayyam Skardu"
        ]
      },
      {
        "category": "Executive",
        "price": 550000,
        "features": [
          "Khar Resort Skardu",
          "Guman resort",
          "PC Lagacy",
          "Rivage Resort Skardu"
        ]
      },
      {
        "category": "Luxury",
        "price": 640000,
        "features": [
          "Khoj Resorts",
          "Rivage Resort Skardu"
        ]
      },
      {
        "category": "Ultra Luxury",
        "price": 740000,
        "features": [
          "Shangrila",
          "Himmel by Luxus",
          "Khoj Resorts"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival and the Kachura Lakes",
        "description": "",
        "highlights": [
          "Morning Flight from Islamabad to Skardu",
          "Meet and greet at Skardu International Airport",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake)",
          "Explore Upper Kachura Lake and the hidden Soq Valley",
          "Enjoy leisure time and stunning sunset views",
          "Overnight stay in Hotel"
        ]
      },
      {
        "day": 2,
        "title": "Waterfalls and Deserts",
        "description": "",
        "highlights": [
          "Scenic drive to the magnificent Manthoka Waterfall",
          "Stop for photos at the unique Chocolate Rock",
          "Experience the Sarfaranga Cold Desert at dusk",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 3,
        "title": "Forts, Lakes, and Ancient Carvings",
        "description": "",
        "highlights": [
          "Visit Shigar Fort",
          "Visit the beautiful Blind Lake",
          "Visit Sadpara Lake and the nearby Buddha Rock",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 4,
        "title": "Basho Meadows",
        "description": "",
        "highlights": [
          "Transfer to 4x4 jeeps for the drive to Basho Valley",
          "Visit Basho Village and the Basho Suspension Bridge",
          "Discover the lush, green Basho Meadows",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 5,
        "title": "Khaplu Valley Journey and Forts",
        "description": "",
        "highlights": [
          "Drive to enchanting Khaplu Valley",
          "Visit the magnificent Khaplu Palace",
          "Explore Chaqchan Mosque",
          "Walk through Khaplu's charming streets and bazaars",
          "Visit traditional apricot orchards",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 6,
        "title": "Skardu City & Chunda Valley Optional Visit",
        "description": "",
        "highlights": [
          "Visit the Skardu Bazaar for local handicrafts",
          "Optional visit to a favorite spot or walk along the Indus River bank",
          "Walk down to Nangsoq Organic Village",
          "Overnight stay at Skardu"
        ]
      },
      {
        "day": 7,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Transfer to Skardu Airport for return flight to Islamabad"
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat - One way)",
      "Private Transport (Parado TZ 2004 -07 New Model)",
      "Fuel- Toll Tax",
      "6 Nights’ Accommodation",
      "6 Breakfast"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Personal Expenses, Entry Tickets, Recreation, Boating, jeeps etc.",
      "Any items not mentioned in the services"
    ],
    "featured": false
  },
  {
    "id": "7_days_by_road_trip_to_skardu_and_deosai_national_park_couple",
    "name": "7 Days By Road Trip to Skardu and Deosai National Park",
    "location": "Skardu ",
    "region": "Skardu Valley",
    "duration": 7,
    "code": "172",
   "pdf": "/images/pdf/byroadtrips/7_days_by_road_trip_to_skardu_and_deosai_national_park_(couple).pdf",
    "description": "Experience a 7-day road trip to the breathtaking Skardu and Deosai National Park. Enjoy scenic views, explore the serene Shangri-La Resort, visit the stunning Manthoka Waterfall, and discover the high-altitude Sarfaranga Cold Desert. Immerse yourself in the rich culture and natural beauty of the region.",
    "image": "/images/All_Tour_Images/SkarduValley/Picture12.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/SkarduValley/Picture8.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture2.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture3.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture4.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 240000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 240000,
        "features": [
          "Tarangfa Hotel Chilas",
          "Hotel Himalaya",
          "Al Noor Starlet Hotel",
          "Dirleh Resort (Deluxe room)"
        ]
      },
      {
        "category": "Premier",
        "price": 280000,
        "features": [
          "Indus Hotel Chilas",
          "Tibet Hotel",
          "Hotel Himalaya (Executive room)",
          "Summit Hotel Skardu"
        ]
      },
      {
        "category": "Executive",
        "price": 330000,
        "features": [
          "Grace Continental Child",
          "Khar Resort Skardu",
          "Guman resort",
          "Qayyam Skardu",
          "Rivage Resort Skardu"
        ]
      },
      {
        "category": "Luxury",
        "price": 380000,
        "features": [
          "Shangrila Chilas",
          "Khoj Resorts (Deluxe room)",
          "Rivage Resort Skardu (Executive rooms)"
        ]
      },
      {
        "category": "Ultra Luxury",
        "price": 400000,
        "features": [
          "Shangrila Chilas",
          "Shangrila (Executive Room)",
          "Himmel by Luxus (Deluxe Room)",
          "Khoj Resorts (River view loft villa)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Chillas",
        "description": "",
        "highlights": [
          "Journey to Chillas 04:00 AM (Islamabad Pickup)",
          "Travel along the Hazara Motorway—head towards Balakot along the Karakoram Highway (KKH)",
          "Breakfast at Balakot—Stop for breakfast and refreshments",
          "Sightseeing & Scenic Stops – Short stops for scenic views, waterfalls, and the Kaghan Valley",
          "Lunch at Besal—Relax and have lunch (self-service)",
          "Visit Lulusar Lake and Babusar Top",
          "Arrival at Chilas—Reach Chilas by 7:00 PM",
          "Overnight Stay – Settle in for a restful night in Chilas"
        ]
      },
      {
        "day": 2,
        "title": "Chilas to Skardu & Junction",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Start travel for Skardu",
          "Begin the journey towards Skardu with stops at:",
          "Visit Nanga Parbat View Point",
          "Junction Point of Three Mountain Ranges (Himalayas, Karakoram, and Hindu Kush)",
          "Key Stop: Astak Nala, confluence of three mountains",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Overnight stay in a hotel"
        ]
      },
      {
        "day": 3,
        "title": "Waterfalls, Rock, and Deserts!",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Depart for a scenic drive to the magnificent Manthoka Waterfall",
          "En route: Experience the Sarfaranga Cold Desert at dusk, a high-altitude desert with stunning dunes",
          "Visit Shigar Fort (a one-of-a-kind heritage boutique hotel situated within a peaceful natural setting)",
          "Seek refuge and find adventure in a 400-year-old fort",
          "Visit Blind Lake (Jarba Zhou) is a stunning, tranquil lake in Shigar Valley",
          "Overnight stay at a Shigar"
        ]
      },
      {
        "day": 4,
        "title": "Valley, Lakes and Boating",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Departure: Arrive back in Skardu",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake)",
          "Upper Kachura Lake, followed by an exploration of the hidden Soq Valley",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Visit the Skardu Bazaar for local handicrafts, dry fruits, and Balti souvenirs",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Overnight stay in a hotel in Skardu"
        ]
      },
      {
        "day": 5,
        "title": "Roof of the World and Sadpara Lake",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Depart for Deosai National Park, one of the highest plateaus in the world, called the Roof of the World",
          "Visit Sadpara Lake Photography and Sightseeing",
          "Explore the stunning landscapes, meadows, and wildlife of Deosai",
          "Visit Bara Pani and Kala Pani",
          "Visit Sheosar Lake, an alpine lake situated at the western end of Deosai National Park",
          "Evening: Enjoy leisure time, stunning sunset views, and back to the hotel",
          "Overnight stay in a hotel"
        ]
      },
      {
        "day": 6,
        "title": "Skardu to Naran Valley",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Back To Islamabad",
          "Short stay in Nanga Parbat View Point, Mountain Junction Point",
          "Short at Babusar Top",
          "Arrival in Naran and transfer to the hotel",
          "Dinner 9:00 pm",
          "Overnight stay in Naran Valley"
        ]
      },
      {
        "day": 7,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Travel to Jheel Saif-ul-Malook via jeeps",
          "Visit Jheel Saif-ul-Malook (if we have time)",
          "Sightseeing & Photography: Jheel Saif-ul-malook",
          "Return to Islamabad: Arrival around 08:30 PM",
          "End of our services with satisfied clients"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "6 Nights’ Accommodation",
      "Fuel- Toll Tax",
      "6 Breakfast",
      "Toll-Tax-Challan"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating",
      "Jeep Expenses of Personal Nature",
      "Horse Ridding / Ski- Jeep",
      "Any item not mention in services include",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature, and also food and drinks",
      "Anything not specifically mentioned in the ‘What your Tour Price includes’ box"
    ],
    "featured": true
  },

  {
    "id": "5_days_by_road_trip_to_fairy_meadows_nanga_parbat_base_camp",
    "name": "5 Days By Road Trip to Fairy Meadows Nanga Parbat Base Camp",
    "location": "Nanga Parbat",
    "region": "Fairy Meadows Nanga Base Camp",
    "duration": 5,
    "code": "191",
  "pdf": "/images/pdf/byairtrips/6_days_by_air_trip_to_astor_minimarg_and_skardu_(couple).pdf",
    "description": "Experience a 5-day journey by road to the breathtaking Fairy Meadows and Nanga Parbat Base Camp. Enjoy scenic drives, adventurous treks, and the serene beauty of the mountains.",
    "image": "/images/All_Tour_Images/FairyMeadows/Picture9.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/FairyMeadows/Picture6.jpg",
      "/images/All_Tour_Images/FairyMeadows/Picture7.jpg",
      "/images/All_Tour_Images/FairyMeadows/Picture8.jpg",
      "/images/All_Tour_Images/FairyMeadows/Picture9.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 210000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 210000,
        "features": [
          "Tarangfa Hotel Chilas",
          "Fairy Meadows View Camping Side (2 nights)",
          "Demanchi Naran Valley"
        ]
      },
      {
        "category": "Executive",
        "price": 250000,
        "features": [
          "Tarangfa Hotel Chilas",
          "Fairy Meadows View Camping Side (2 nights)",
          "Demanchi Naran Valley"
        ]
      },
      {
        "category": "Luxury",
        "price": 300000,
        "features": [
          "Shangrila Hotel Chilas",
          "The Sarai Hotel & Resort Naran",
          "Northern Retreat by Hotel Demanchi"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Chilas",
        "description": "",
        "highlights": [
          "Journey to Chillas 04:00 AM (Islamabad Pickup)",
          "Travel along the Hazara Motorway—head towards Balakot along the Karakoram Highway",
          "Breakfast at Balakot—Stop for breakfast and refreshments",
          "Sightseeing & Scenic Stops – Short stops for scenic views, waterfalls, and the Kaghan Valley",
          "Lunch at Besal—Relax and have lunch (self-service)",
          "Visit Lulusar Lake and Babusar Top",
          "Arrival at Chilas—Reach Chilas by 7:00 PM",
          "Overnight Stay – Settle in for a restful night in Chilas"
        ]
      },
      {
        "day": 2,
        "title": "Skardu to Fairy Meadows Campside",
        "description": "",
        "highlights": [
          "Breakfast at Chilas move to Raikot Bridge",
          "Transfer to the Nanga Parbat region",
          "Arrive at Raikot Bridge",
          "Switch from your main vehicle to a local 4x4 Jeep for the adventurous ride to Tattu Village",
          "Begin the trek from Tattu Village to Fairy Meadows",
          "Hire a horse/porter at Tattu if needed",
          "Evening: Check into your hut or campsite, have dinner, and enjoy the breathtaking view of Nanga Parbat's 'Killer Mountain' face under the stars",
          "Overnight: Fairy Meadows (hut/camping)"
        ]
      },
      {
        "day": 3,
        "title": "Nanga Parbat Base Camp Trek",
        "description": "",
        "highlights": [
          "Morning: Enjoy breakfast with an iconic view of Nanga Parbat",
          "Begin the 4-6 hour round-trip trek to the Nanga Parbat View Point/Bayal Camp",
          "Bayal is a lush, forested area about 1.5-2 hours from Fairy Meadows",
          "The actual Nanga Parbat Base Camp is a further trek and is recommended only for fit trekkers",
          "Afternoon: Spend time soaking in the majesty of the 9th highest mountain in the world",
          "Overnight: Fairy Meadows (Hut/Camping)"
        ]
      },
      {
        "day": 4,
        "title": "Return to Naran Valley",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final morning at the meadows",
          "Begin the descent trek back to Tattu Village",
          "Take the 4x4 Jeep ride back to Raikot Bridge",
          "Meet your main vehicle at Raikot Bridge and begin the return drive back to Naran",
          "Evening: Check into your hotel in Naran for a much-needed rest",
          "Overnight stay in Naran Valley"
        ]
      },
      {
        "day": 5,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Travel to Jheel Saif-ul-Malook via jeeps",
          "Visit Jheel Saif-ul-Malook",
          "Sightseeing & Photography: Jheel Saif-ul-Malook",
          "Return to Islamabad: Arrival around 08:30 PM",
          "End of our services with satisfied clients"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI CAR New Model)",
      "Fuel- Toll Tax",
      "4 Nights’ Accommodation",
      "4 Breakfasts - 4 Dinner",
      "Jeep"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating",
      "Expenses of Personal Nature",
      "Horse Ridding / Ski",
      "Any item not mentioned in services include",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature, and also food and drinks",
      "Travel insurance"
    ],
    "featured": false
  },

  {
    "id": "3_days_trip_to_ratti_gali_lake",
    "name": "3 Days Trip to Ratti Gali Lake",
    "location": "Ratti Gali Lake",
    "region": "Ratti Gali Lake",
      "pdf": "/images/pdf/byroadtrips/3_daystriptorattigalilake.pdf",
    "duration": 3,
    "code": "201",
    "description": "Experience the breathtaking beauty of Ratti Gali Lake over a 3-day journey through the scenic Neelum Valley. Enjoy a blend of adventure and relaxation with guided treks, local exploration, and cozy bonfire nights.",
    "image": "/images/All_Tour_Images/RattiGaliLake/Picture1.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/RattiGaliLake/Picture1.jpg",
      "/images/All_Tour_Images/RattiGaliLake/Picture2.png",
      "/images/All_Tour_Images/RattiGaliLake/Picture3.jpg",
      "/images/All_Tour_Images/RattiGaliLake/Picture1.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 150000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 150000,
        "features": [
          "Neelum Cinaar Resort",
          "Ratti Gali Camping Side"
        ]
      },
      {
        "category": "Executive",
        "price": 170000,
        "features": [
          "Green Valley Resort",
          "Ratti Gali Camping Side"
        ]
      },
      {
        "category": "Luxury",
        "price": 200000,
        "features": [
          "Hotel Neelum Elites",
          "Ratti Gali Camping Side"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Neelum Valley",
        "description": "",
        "highlights": [
          "05:00 AM – Pick up Islamabad members.",
          "Murree Motorway Drive—Enjoy a scenic drive through the motorway with a short break at Kohala Bridge for photos.",
          "Muzaffarabad—Arrive in Muzaffarabad and stop for refreshment and a short break.",
          "Dhanni Waterfall—Continue the drive towards Keran, pausing at Dhanni Waterfall for sightseeing.",
          "Visit the Neelum Jhelum Hydropower Project.",
          "Continue journey along the Neelum Valley road with short scenic stops.",
          "Arrival at Dowarian—Reach Dowarian by late afternoon.",
          "Evening walk in the local area to experience village life.",
          "Relax, and explore the area.",
          "Evening Activities – Enjoy a cozy bonfire & musical night.",
          "Overnight Stay—Stay at a hotel in Dowarian/Keran."
        ]
      },
      {
        "day": 2,
        "title": "Jeep Safari, Waterfalls, Glacier, and Hiking!",
        "description": "",
        "highlights": [
          "Early Morning (07:00 AM): Breakfast and immediate departure from Dowarian Valley.",
          "Jeep departure from Dowarian to Ratti Gali Base Camp (approx. 1–1.5 hours on mountainous track).",
          "Short rest at base camp.",
          "Guided or self-paced trek to Ratti Gali Lake (30–45 minutes; moderate difficulty).",
          "Time at Ratti Gali Lake (2–3 hours):",
          "Sightseeing and photography.",
          "Walking around the lake.",
          "Enjoying alpine scenery, glaciers, and wildflowers.",
          "Return trek to base camp.",
          "Overnight Stay—Stay at a hotel in Dowarian/Keran. (Subject to the Weather)"
        ]
      },
      {
        "day": 3,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "08:00 AM Breakfast – Wake up and enjoy breakfast.",
          "Departure for Islamabad.",
          "Photography and Sightseeing.",
          "Jeep ride back to Dowarian.",
          "Departure from Dowarian.",
          "Visit Kutton and the famous Kutton Waterfall for scenic beauty.",
          "Scenic return drive through Neelum Valley.",
          "Optional short stops at Keran viewpoints or riverside locations (time permitting).",
          "Lunch in Muzaffarabad (self).",
          "Continue driving back to Islamabad.",
          "Arrival in Islamabad by evening (approximately 08:00–09:00 PM).",
          "Arriving at Islamabad around 08:00 PM (+/- 2 hours).",
          "End of services with satisfied clients and unforgettable memories!"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI CAR New Model)",
      "Fuel- Toll Tax",
      "2 Nights’ Accommodation",
      "3 Breakfasts",
      "Tour Guide - Jeep"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating - Jeep",
      "Expenses of Personal Nature",
      "Horse Ridding / Ski",
      "Any item not mentioned in services include",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature, and also food and drinks.",
      "Anything not specifically mentioned in the ‘What your Tour Price includes’ box."
    ],
    "featured": false
  },




  {
    "id": "8_days_trip_to_hunza_and_skardu_by_air_private",
    "name": "8 Days Trip to Hunza and Skardu (By Air) - Private",
    "location": "Hunza and Skardu",
    "region": "Skardu & Hunza",
      "pdf": "/images/pdf/byairtrips/8_days_trip_to_hunza_and_skardu_(by_air)_-_private.pdf",

    "duration": 8,
    "code": "252",
    "description": "Join us for an unforgettable group adventure exploring the stunning landscapes and vibrant culture of Hunza and Skardu. Perfect for solo travelers, friends, and families looking to explore together.",
    "image": "/images/All_Tour_Images/HunzaValley/Picture3.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/HunzaValley/Picture1.jpg",
      "/images/All_Tour_Images/HunzaValley/Picture2.jpg",
      "/images/All_Tour_Images/HunzaValley/Picture3.jpg",
      "/images/All_Tour_Images/HunzaValley/Picture5.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple",
      "Family",
      "Group"
    ],
    "transport": "By Air",
    "basePrice": 435000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 435000,
        "features": [
          "Hotel Himalaya / Summit Embassy Hotel / Dirleh Resort / (Deluxe room Skardu)",
          "Shaheen Resort Hunza(SRH) / Hunza Blossom In / (Deluxe room Hunza)"
        ]
      },
      {
        "category": "Premier",
        "price": 490000,
        "features": [
          "Tibet / Hotel Himalaya (Executive room) / Kinara Hotel Skardu / Qayyam Skardu",
          "Qayam Resort Hunza / Roomy Dastan Hunza"
        ]
      },
      {
        "category": "Executive",
        "price": 580000,
        "features": [
          "Khar Resort Skardu / Guman resort / PC Lagacy / Rivage Resort Skardu",
          "Hard Rock Hunza Resort / Villas Roomy Resort Hunza"
        ]
      },
      {
        "category": "Luxury",
        "price": 690000,
        "features": [
          "Khoj Resorts (Deluxe room) or Rivage Resort Skardu (Executive rooms) Skardu",
          "Horizon Resort Attabad Lake (Deluxe room) or Offto Resort Hunza"
        ]
      },
      {
        "category": "Ultra Luxury",
        "price": 800000,
        "features": [
          "Shangrila (Executive Room) / Himmel by Luxus (Deluxe room) /Khoj Resorts (River view loft villa) (Deluxe room Skardu Hotel)",
          "Best Western / Darbar Hotel / Hunza Serena Hotel (Deluxe room Hunza Hotel)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival and the Kachura Lakes",
        "description": "",
        "highlights": [
          "Morning Flight from Islamabad to Skardu (One of world scenic flight)",
          "Meet and greet at Skardu International Airport and transferred to your hotel for check-in or directly leave for tour.",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake).",
          "Upper Kachura Lake, followed by an exploration of the hidden Soq Valley.",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Overnight stay in Hotel."
        ]
      },
      {
        "day": 2,
        "title": "Waterfalls and Deserts",
        "description": "",
        "highlights": [
          "Morning: After breakfast, depart for a scenic drive to the magnificent Manthokha Waterfall.",
          "En route: Stop for photos at the unique Chocolate Rock.",
          "Evening: Experience the Sarfaranga Cold Desert at dusk, a high-altitude desert with stunning dunes.",
          "Overnight stay at Skardu."
        ]
      },
      {
        "day": 3,
        "title": "Lakes, and Ancient Fort",
        "description": "",
        "highlights": [
          "Morning: Following breakfast, Visit Shigar Fort",
          "Visit the beautiful Blind Lake",
          "Afternoon: Visit the expansive Sadpara Lake and the nearby Buddha Rock, a 7th-century carving.",
          "Overnight stay at Skardu."
        ]
      },
      {
        "day": 4,
        "title": "Skardu to Hunza Road Journey (KKH)",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort.",
          "Morning: Check out early. Leave for Long travel to Hunza.",
          "Road Transit: Drive from Skardu to Karimabad, Hunza. The drive is along the Skardu Road, merging onto the Karakoram Highway (KKH).",
          "Key Stop: Astak Nala, Confluence of three mountain.",
          "Stop at the Rakaposhi Viewpoint near Gilgit for lunch with a spectacular close-up view of the 7,788m peak.",
          "Evening: Arrive in Karimabad, check into your hotel, rest and relax.",
          "Overnight stay in Hotel."
        ]
      },
      {
        "day": 5,
        "title": "Hunza to Skardu Road Journey",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort.",
          "Immerse yourself in the region's history by visiting the two ancient fortresses: the 900-year-old Altit Fort and the 700-year-old Baltit Fort. (Anyone of these).",
          "Afternoon: Explore the Karimabad Bazaar for local souvenirs, traditional shawls, and organic Hunzai products (like dried apricots and apricot oil).",
          "Sunset: Drive up to Duikar (Eagle's Nest) for a breathtaking sunset panorama over the surrounding peaks, including Ultar Sar and Ladyfinger.",
          "Overnight stay in Hotel."
        ]
      },
      {
        "day": 6,
        "title": "Hunza History & Sunset Panorama",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort.",
          "Full Day Excursion: Drive north into Upper Hunza / Gojal Valley.",
          "Key Stops: Visit the stunning Attabad Lake (the mesmerizing turquoise color is beautiful in November).",
          "Continue north to the dramatic, Jagged Passu Cones and the nearby thrilling Hussaini Suspension Bridge.",
          "Optional: If time and conditions permit, you can drive further north towards Sost (the last town before the Chinese border).",
          "Note: A full day trip to Khunjerab Pass is not recommended in winter, due to extreme snow and cold. (Can be managed at Guest Choice)",
          "Overnight stay at Hunza."
        ]
      },
      {
        "day": 7,
        "title": "Hunza to Skardu Road Journey",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort.",
          "Road Transit: Begin the return drive from Karimabad back to Skardu City",
          "Activity: Stop for photos at any viewpoints you missed on the way up. The journey will take approximately 8–10 hours.",
          "Evening: Arrive back in Skardu, check into your hotel",
          "Visit the Skardu Bazaar for local handicrafts, dry fruits, and Balti souvenirs.",
          "Overnight stay at Skardu."
        ]
      },
      {
        "day": 8,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort.",
          "Transfer: You will be transferred to Skardu Airport for your return flight to Islamabad, filled with unforgettable memories."
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat - One way)",
      "Private Transport (Parado TZ 2004-07 New Model) (1 Vehicle)",
      "Fuel- Toll Tax",
      "7 Nights’ Accommodation",
      "8 Breakfast"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Personal Expenses, Recreation, Boating, jeeps etc.",
      "Any items not mentioned in the services."
    ],
    "featured": true
  },
  {
    "id": "6_days_by_road_trip_to_minimarg_astor_and_skardu_couple",
    "name": "6 Days By Road Trip to Minimarg Astor and Skardu (Couple)",
    "location": "Minimarg, Astor, Skardu",
    "region": "Minimarg Astor Valley",
    "duration": 6,
    "code": "171",
    "description": "Experience a 6-day adventure through the stunning landscapes of Minimarg, Astor, and Skardu. This road trip offers breathtaking views, cultural exploration, and the natural beauty of Northern Pakistan, including visits to Rama Meadows, Deosai National Park, and the famous Rainbow Lake.",
     "pdf": "/images/pdf/byairtrips/6_days_by_air_trip_to_astor_minimarg_and_skardu_(couple).pdf",

    "image": "/images/All_Tour_Images/MinimargAstor/Picture12.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/MinimargAstor/Picture9.jpg",
      "/images/All_Tour_Images/MinimargAstor/Picture10.jpg",
      "/images/All_Tour_Images/MinimargAstor/Picture11.jpg",
      "/images/All_Tour_Images/MinimargAstor/Picture12.jpg",
    ],
    "categories": [
      "Deluxe",
      "Executive",
      "Luxury"
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 290000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 290000,
        "features": [
          "Tarangfa Lodges Chilas or Indus Hotel (1 night)",
          "Rama Meadows Camping Site (1 night)",
          "Minimarg Camping Side (1 night)",
          "Tarishing Camping Side (1 night)",
          "Hotel Home Naran (1 night)"
        ]
      },
      {
        "category": "Executive",
        "price": 350000,
        "features": [
          "Shangrila Hotel Chilas (1 night)",
          "Rama Meadows Camping Site (1 night)",
          "Minimarg Camping Side (1 night)",
          "Tarishing Camping Side (1 night)",
          "Mulberry Lodge Astore / Northern Retreat by Hotel Demanchi (1 night)"
        ]
      },
      {
        "category": "Luxury",
        "price": 4200000,
        "features": [
          "Shangrila Hotel Chilas (1 night)",
          "Rama Meadows Camping Site (1 night)",
          "Minimarg Camping Side (1 night)",
          "Tarishing Camping Side (1 night)",
          "Mulberry Lodge Astore / Swiss Rock Hotel & Resort Naran (2 nights)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Chilas",
        "description": "Begin your journey from Islamabad and travel through scenic routes to Chilas, passing through the beautiful Hazara Motorway and Karakoram Highway.",
        "highlights": [
          "Journey to Chillas 04:00 AM (Islamabad Pickup)",
          "Travel along the Hazara Motorway—head towards Balakot along the Karakoram Highway",
          "Breakfast at Balakot—Stop for breakfast and refreshments",
          "Sightseeing & Scenic Stops – Short stops for scenic views, waterfalls, and the Kaghan Valley",
          "Lunch at Besal—Relax and have lunch (self-service)",
          "Visit Lulusar Lake and Babusar Top",
          "Arrival at Chilas—Reach Chilas by 7:00 PM",
          "Overnight Stay – Settle in for a restful night in Chilas"
        ]
      },
      {
        "day": 2,
        "title": "Roof of the World and Rama Meadows",
        "description": "",
        "highlights": [
          "Breakfast at Skardu Valley",
          "Transfer to the Nanga Parbat region",
          "Arrive at Astor Valley",
          "Switch from your main vehicle to a local 4x4 Jeep for the adventurous ride to Rama Meadows",
          "Move to Rama Meadows & Rama Lake",
          "Visit the beautiful Rama Lake and spend some time exploring the area",
          "Night Stay: at the Camping in Rama"
        ]
      },
      {
        "day": 3,
        "title": "Tarishing & Sunset Panorama",
        "description": "",
        "highlights": [
          "Morning: Enjoy an open-air breakfast at the Rama Meadows",
          "Move to Tarishing, Rupal Face of Nanga Parbat",
          "Explore local life: wooden houses, terraced fields, and warm hospitality",
          "Short hike to nearby ridges for breathtaking views of the Rupal Face of Nanga Parbat",
          "Depart for Deosai National Park, one of the highest plateaus in the world",
          "Visit Shausar Lake",
          "Night Stay at Chilam Chowki"
        ]
      },
      {
        "day": 4,
        "title": "Rainbow Lakes and the Indian Border",
        "description": "",
        "highlights": [
          "Breakfast at Chilam Chowki",
          "Depart for Minimarg, the last village of Pakistan before the Indian border",
          "Move to Burzil Top & Minimarg Domail",
          "Visit the village and explore its unique culture and way of life",
          "Head towards the stunning views of the surrounding mountains",
          "Visit the famous Rainbow Lake of Minimarg",
          "Return to Chilim for a night or stay at the Minimarg Camping Site"
        ]
      },
      {
        "day": 5,
        "title": "Domail, Deosai Park then Astor",
        "description": "",
        "highlights": [
          "Breakfast at Chilim",
          "Depart for Islamabad via the Babusar, passing through the beautiful valleys and scenic landscape",
          "Short Stay at Babusar Top",
          "Arrival in Naran and transfer to the hotel",
          "Dinner 9:00 pm",
          "Overnight stay in Naran Valley"
        ]
      },
      {
        "day": 6,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Travel to Jheel Saif-ul-Malook via jeeps",
          "Visit Jheel Saif-ul-Malook (if we have time)",
          "Sightseeing & Photography: Jheel Saif-ul-malook",
          "Return to Islamabad: Arrival around 08:30 PM",
          "End of our services with satisfied clients"
        ]
      }
    ],
    "included": [
      "Air Tickets both Sides (With Window Seat-One way)",
      "Private Transport (Car New Model) (1 Vehicle)",
      "Fuel - Toll Tax, and Entry Tickets",
      "5 Nights’ Accommodation",
      "5 Breakfast - Jeep - Guide"
    ],
    "notIncluded": [
      "Lunch & Dinner",
      "Personal Expenses, Recreation, Boating, jeeps etc.",
      "Any items not mentioned in the services",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature, and also food and drinks",
      "Anything not specifically mentioned in the ‘What your Tour Price includes’ box"
    ],
    "featured": true
  },
  {
    "id": "10_days_by_road_trip_to_hunza_and_skardu_couple",
    "name": "10 Days By Road Trip to Hunza and Skardu (Couple)",
    "location": "Hunza and Skardu",
    "region": "Skardu & Hunza",
    "duration": 10,
    "code": "200",
     "pdf": "/images/pdf/byroadtrips/10_days_by_road_trip_to_hunza_and_skardu_(couple).pdf",

    "description": "Explore the breathtaking landscapes of Hunza and Skardu over a 10-day road trip. Experience the beauty of Khunjerab Pass, Deosai National Park, and the serene lakes and valleys. Enjoy local culture, stunning views, and comfortable accommodations.",
    "image": "/images/All_Tour_Images/SkarduValley/Picture22.jpg",
    "galleryImages": [
      "/images/All_Tour_Images/SkarduValley/Picture11.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture12.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture13.jpg",
      "/images/All_Tour_Images/SkarduValley/Picture18.webp",
    ],
    "categories": [
      "Deluxe",
      "Premier",
      "Executive",
      "Luxury",
      "Ultra Luxury",
    ],
    "packageTypes": [
      "Couple"
    ],
    "transport": "By Road",
    "basePrice": 325000,
    "packages": [
      {
        "category": "Deluxe",
        "price": 325000,
        "features": [
          "Tarangfa Hotel Chilas",
          "Hotel Himalaya / Al Noor Starlet Hotel / Dirleh Resort (Deluxe room)"
        ]
      },
      {
        "category": "Premier",
        "price": 370000,
        "features": [
          "Indus Hotel Chilas",
          "Tibet / Hotel Himalaya (Executive room) / Summit Hotel Skardu"
        ]
      },
      {
        "category": "Executive",
        "price": 430000,
        "features": [
          "Grace Continental Child",
          "Khar Resort Skardu / Guman resort / Qayyam Skardu / Rivage Resort Skardu"
        ]
      },
      {
        "category": "Luxury",
        "price": 480000,
        "features": [
          "Shangrila Chilas",
          "Khoj Resorts (Deluxe room) or Rivage Resort Skardu (Executive rooms)"
        ]
      },
      {
        "category": "Ultra Luxury",
        "price": 530000,
        "features": [
          "Shangrila Chilas",
          "Shangrila (Executive Room) / Himmel by Luxus (Deluxe Room) / Khoj Resorts (River view loft villa)"
        ]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Islamabad to Chillas",
        "description": "",
        "highlights": [
          "Journey to Chillas 04:00 AM (Islamabad Pickup)",
          "Travel along the Hazara Motorway—head towards Balakot along the Karakoram Highway (KKH)",
          "Breakfast at Balakot—Stop for breakfast and refreshments",
          "Sightseeing & Scenic Stops – Short stops for scenic views, waterfalls, and the Kaghan Valley",
          "Lunch at Besal—Relax and have lunch (self-service)",
          "Visit Lulusar Lake and Babusar Top",
          "Arrival at Chilas—Reach Chilas by 7:00 PM",
          "Overnight Stay – Settle in for a restful night in Chilas"
        ]
      },
      {
        "day": 2,
        "title": "Chilas to Skardu & Junction",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Start travel for Skardu",
          "Visit Nanga Parbat View Point",
          "Junction Point of Three Mountain Ranges (Himalayas, Karakoram, and Hindu Kush)",
          "Key Stop: Astak Nala, confluence of three mountains",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Overnight stay in a hotel"
        ]
      },
      {
        "day": 3,
        "title": "Waterfalls, Rock, and Deserts",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Depart for a scenic drive to the magnificent Manthoka Waterfall",
          "En route: Experience the Sarfaranga Cold Desert at dusk, a high-altitude desert with stunning dunes",
          "Visit Shigar Fort (a one-of-a-kind heritage boutique hotel situated within a peaceful natural setting)",
          "Seek refuge and find adventure in a 400-year-old fort",
          "Visit Blind Lake (Jarba Zhou) is a stunning, tranquil lake in Shigar Valley",
          "Overnight stay at a Shigar"
        ]
      },
      {
        "day": 4,
        "title": "Valley, Lakes and Boating",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Departure: Arrive back in Skardu",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake)",
          "Upper Kachura Lake, followed by an exploration of the hidden Soq Valley",
          "Evening: Enjoy leisure time and stunning sunset views",
          "Visit the Skardu Bazaar for local handicrafts, dry fruits, and Balti souvenirs",
          "Overnight stay in a hotel in Skardu"
        ]
      },
      {
        "day": 5,
        "title": "Roof of the World and Sadpara Lake",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Depart for Deosai National Park, one of the highest plateaus in the world, called the Roof of the World",
          "Visit Sadpara Lake Photography and Sightseeing",
          "Explore the stunning landscapes, meadows, and wildlife of Deosai",
          "Visit Bara Pani and Kala Pani",
          "Visit Sheosar Lake, an alpine lake situated at the western end of Deosai National Park",
          "Evening: Enjoy leisure time, stunning sunset views, and back to the hotel",
          "Overnight stay in a hotel"
        ]
      },
      {
        "day": 6,
        "title": "Skardu to Hunza Road Journey (KKH)",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Check out early leave for long travel to Hunza",
          "Road Transit: Drive from Skardu to Karimabad, Hunza",
          "The drive is along the Skardu Road, merging onto the Karakoram Highway (KKH)",
          "Key Stop: Astak Nala, confluence of three mountains",
          "Stop at the Rakaposhi Viewpoint near Gilgit for lunch with a spectacular close-up view of the 7,788 m peak",
          "Evening: Arrive in Karimabad, check into your hotel, and rest and relax",
          "Overnight stay at a hotel"
        ]
      },
      {
        "day": 7,
        "title": "Hunza Exploration Offers Stunning Karakoram",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Immerse yourself in the region's history by visiting the two ancient fortresses: the 900-year-old Altit Fort and the 700-year-old Baltit Fort",
          "Afternoon: Explore the Karimabad Bazaar for local souvenirs, traditional shawls, and organic Hunzai products (like dried apricots and apricot oil)",
          "Sunset: Drive up to Duikar (Eagle's Nest) for a breathtaking sunset panorama over the surrounding peaks, including Ultar Sar and Ladyfinger",
          "Overnight stay in a hotel"
        ]
      },
      {
        "day": 8,
        "title": "Hunza History & Sunset Panorama",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Full-Day Excursion: Drive north into Upper Hunza/Gojal Valley",
          "Key Stops: Visit the stunning Attabad Lake (the mesmerizing turquoise color is beautiful)",
          "Continue north to the dramatic, jagged Passu Cones and the nearby thrilling Hussaini Suspension Bridge",
          "Optional: If time and conditions permit, you can drive further north towards Sost (the last town before the Chinese border)",
          "Note: A full-day trip to Khunjerab Pass",
          "Overnight stay at Hunza"
        ]
      },
      {
        "day": 9,
        "title": "Hunza to Naran Road Journey through Karakoram",
        "description": "",
        "highlights": [
          "Morning: Enjoy a buffet breakfast at the resort",
          "Back To Islamabad",
          "Short stay in Nanga Parbat View Point, Mountain Junction Point",
          "Short at Babusar Top",
          "Arrival in Naran and transfer to the hotel",
          "Dinner 9:00 pm",
          "Overnight stay in Naran Valley"
        ]
      },
      {
        "day": 10,
        "title": "Departure to Islamabad",
        "description": "",
        "highlights": [
          "Morning: Enjoy a final buffet breakfast at the resort",
          "Travel to Jheel Saif-ul-Malook via jeeps",
          "Visit Jheel Saif-ul-Malook (if we have time)",
          "Sightseeing & Photography: Jheel Saif-ul-malook",
          "Return to Islamabad: Arrival around 08:30 PM",
          "End of our services with satisfied clients"
        ]
      }
    ],
    "included": [
      "Private Transport (GLI Car New Model)",
      "9 Nights’ Accommodation",
      "Fuel- Toll Tax",
      "9 Breakfast",
      "Toll-Tax-Challan"
    ],
    "notIncluded": [
      "Any Kind of Entry/Activity Ticket",
      "Expenses for Boating",
      "Jeep Expenses of Personal Nature",
      "Horse Riding / Ski-Rafting",
      "Any item not mentioned in services include",
      "Portage, tips, laundry, telephone charges, transfers, all items of a personal nature, and also food and drinks",
      "Travel insurance"
    ],
    "featured": false
  },
];

export function getCategoryBadgeClass(category: TourCategory): string {
  const classes: Record<TourCategory, string> = {
    // Deluxe variants
    Deluxe: "bg-blue-100 text-blue-800",
    Deluxe_higher: "bg-blue-200 text-blue-900",
    deluxe_higher: "bg-blue-200 text-blue-900",
    "Deluxe Higher": "bg-blue-200 text-blue-900",
    deluxe_lower: "bg-blue-50 text-blue-700",
    "Premier": "bg-blue-300 text-blue-950",
    // Executive variants
    Executive: "bg-purple-100 text-purple-800",
    executive: "bg-purple-100 text-purple-800",
    executive_higher: "bg-purple-200 text-purple-900",
    // Luxury variants
    Luxury: "bg-amber-100 text-amber-800",
    "Luxury Higher": "bg-amber-200 text-amber-900",
    luxury_higher: "bg-amber-200 text-amber-900",
    luxury_lower: "bg-amber-50 text-amber-700",
    "Ultra Luxury": "bg-amber-300 text-amber-950",
    // Individual types
    Single: "bg-gray-100 text-gray-800",
    Solo: "bg-teal-100 text-teal-800",
    Couple: "bg-pink-100 text-pink-800",
    Family: "bg-green-100 text-green-800",
    Group: "bg-indigo-100 text-indigo-800",
    Private: "bg-rose-100 text-rose-800",
    // Group variants
    group: "bg-indigo-100 text-indigo-800",
    group_single: "bg-indigo-50 text-indigo-700",
    group_solo: "bg-indigo-50 text-indigo-700",
    group_couple: "bg-indigo-200 text-indigo-900",
  };
  return classes[category] || "";
}