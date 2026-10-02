import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { BlogSection } from "@/data/blog";
import type { DestinationSection } from "@/data/destinations";
import type { TourCategory, TourPackage, PackageType } from "@/data/tours";

export const userRole = pgEnum("user_role", ["owner", "manager", "editor"]);
export const priceSource = pgEnum("price_source", ["excel", "website"]);

export const loginFailures = pgTable(
  "login_failures",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    failedAt: timestamp("failed_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("login_failures_email_failed_at_idx").on(table.email, table.failedAt)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tours = pgTable("tours", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  region: text("region").notNull(),
  duration: integer("duration").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  pdf: text("pdf").notNull(),
  code: text("code").notNull(),
  galleryImages: jsonb("gallery_images").$type<string[]>().notNull(),
  categories: jsonb("categories").$type<TourCategory[]>().notNull(),
  packageTypes: jsonb("package_types").$type<PackageType[]>().notNull(),
  transport: text("transport").notNull(),
  basePrice: integer("base_price").notNull(),
  packages: jsonb("packages").$type<TourPackage[]>().notNull(),
  included: jsonb("included").$type<string[]>().notNull(),
  notIncluded: jsonb("not_included").$type<string[]>().notNull(),
  featured: boolean("featured").notNull().default(false),
  priceSource: priceSource("price_source").notNull().default("excel"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const tourDays = pgTable(
  "tour_days",
  {
    id: serial("id").primaryKey(),
    tourId: text("tour_id")
      .notNull()
      .references(() => tours.id, { onDelete: "cascade" }),
    dayNumber: integer("day_number").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    highlights: jsonb("highlights").$type<string[]>().notNull(),
  },
  (table) => [uniqueIndex("tour_days_tour_day_idx").on(table.tourId, table.dayNumber)],
);

export const places = pgTable("places", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  bannerImage: text("banner_image").notNull(),
  location: text("location"),
  listingNumber: integer("listing_number").notNull(),
  content: jsonb("content").$type<DestinationSection[]>().notNull(),
});

export const posts = pgTable("posts", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  author: text("author").notNull(),
  date: text("date").notNull(),
  coverImage: text("cover_image").notNull(),
  content: jsonb("content").$type<BlogSection[]>().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const photos = pgTable("photos", {
  id: integer("id").primaryKey(),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  category: text("category").notNull(),
  span: text("span"),
  homeOnly: boolean("home_only").notNull().default(false),
});

export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  location: text("location").notNull(),
  text: text("text").notNull(),
  rating: integer("rating").notNull(),
});

export const slides = pgTable("slides", {
  id: integer("id").primaryKey(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  rotation: integer("rotation").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const hotelRates = pgTable(
  "hotel_rates",
  {
    id: serial("id").primaryKey(),
    place: text("place").notNull(),
    startCity: text("start_city").notNull(),
    grade: text("grade").notNull(),
    twin: integer("twin").notNull(),
    triple: integer("triple").notNull(),
    hotelName: text("hotel_name").notNull().default(""),
    offered: boolean("offered").notNull().default(true),
  },
  (table) => [uniqueIndex("hotel_rates_place_city_grade_idx").on(table.place, table.startCity, table.grade)],
);

export const vehicleRates = pgTable(
  "vehicle_rates",
  {
    id: serial("id").primaryKey(),
    place: text("place").notNull(),
    startCity: text("start_city").notNull(),
    mode: text("mode").notNull(),
    vehicle: text("vehicle").notNull(),
    rent: integer("rent").notNull(),
    fuel: integer("fuel").notNull(),
    toll: integer("toll").notNull(),
    seats: integer("seats").notNull(),
    live: boolean("live").notNull().default(true),
  },
  (table) => [uniqueIndex("vehicle_rates_place_city_mode_vehicle_idx").on(table.place, table.startCity, table.mode, table.vehicle)],
);

export const airExtras = pgTable("air_extras", {
  id: serial("id").primaryKey(),
  islamabadTicket: integer("islamabad_ticket").notNull(),
  lahoreAdd: integer("lahore_add").notNull(),
  karachiAdd: integer("karachi_add").notNull(),
  welcomePack: integer("welcome_pack").notNull(),
  entry: integer("entry").notNull(),
  infantExtra: integer("infant_extra").notNull(),
  sticker: integer("sticker").notNull(),
});

export const jeepLines = pgTable("jeep_lines", {
  id: serial("id").primaryKey(),
  place: text("place").notNull(),
  mode: text("mode").notNull(),
  label: text("label").notNull(),
  people: integer("people").notNull(),
  amount: integer("amount").notNull(),
  live: boolean("live").notNull().default(true),
});

export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  percent: integer("percent").notNull(),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  place: text("place").notNull(),
  startCity: text("start_city").notNull(),
  mode: text("mode").notNull(),
  days: integer("days").notNull(),
  adults: integer("adults").notNull(),
  children: integer("children").notNull(),
  lapInfants: integer("lap_infants").notNull(),
  seatInfants: integer("seat_infants").notNull(),
  grade: text("grade").notNull(),
  vehicle: text("vehicle").notNull(),
  otherNote: text("other_note").notNull().default(""),
  guide: boolean("guide").notNull(),
  meals: boolean("meals").notNull(),
  seasonPercent: integer("season_percent").notNull(),
  subtotal: integer("subtotal").notNull(),
  profit: integer("profit").notNull(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const quoteNights = pgTable("quote_nights", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  night: integer("night").notNull(),
  rate: integer("rate").notNull(),
  hotelName: text("hotel_name").notNull(),
});

export const quoteDays = pgTable("quote_days", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  vehicle: text("vehicle").notNull(),
  rent: integer("rent").notNull(),
  fuel: integer("fuel").notNull(),
  toll: integer("toll").notNull(),
  cleared: boolean("cleared").notNull().default(false),
});

export const quoteExtras = pgTable("quote_extras", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey(),
  phoneDisplay: text("phone_display").notNull(),
  phoneE164: text("phone_e164").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  mapsUrl: text("maps_url").notNull(),
  facebookUrl: text("facebook_url").notNull(),
  instagramUrl: text("instagram_url").notNull(),
  tiktokUrl: text("tiktok_url").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
});
