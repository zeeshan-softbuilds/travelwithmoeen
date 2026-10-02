import { spawn } from "child_process";
import { unlink } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { hotelRates, loginFailures, photos, tours, users } from "../lib/db/schema";
import { signInRefusalLine } from "../lib/auth/login-guard";
import { createUserAs, removeUserAs } from "../lib/office/users";
import { authenticate } from "../lib/auth/authenticate";
import { importRates } from "../lib/import-rates";
import { buildQuote, GUEST_GRADES } from "../lib/quote";
import { loadCatalog } from "../lib/rates";

const LOGIN_ERROR = "That email or password is not right.";
const PROBE_PASSWORD = "step2-probe-password";
const EDITOR_EMAIL = "editor-step2-security@travelwithmoeen.test";
const EDITOR_PASSWORD = "Step2Editor-pass";
const MANAGER_EMAIL = "manager-step2-security@travelwithmoeen.test";
const MANAGER_PASSWORD = "Step2Manager-pass";

const JPEG = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
  "base64",
);
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);
const WEBP = Buffer.from("UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==", "base64");

function officeBase() {
  const configured = process.env.API_BASE_URL?.trim().replace(/\/$/, "");
  return configured || "http://localhost:3000";
}

function assertNoSecret(text: string, password: string) {
  const secret = process.env.SESSION_SECRET ?? "";
  if (secret && text.includes(secret)) {
    throw new Error("A response contained SESSION_SECRET.");
  }
  if (password && text.includes(password)) {
    throw new Error("A response contained the password.");
  }
}

function sessionCookie(response: Response) {
  const lines = response.headers.getSetCookie?.() ?? [];
  const match = lines.find((line) => line.startsWith("twm_office="));
  return match ? match.split(";")[0] : "";
}

function cookieCleared(response: Response) {
  const lines = response.headers.getSetCookie?.() ?? [];
  return lines.some((line) => line.startsWith("twm_office=") && (/Max-Age=0/i.test(line) || line.startsWith("twm_office=;")));
}

async function officePost(pathname: string, form: FormData, cookie: string) {
  let response: Response;
  try {
    response = await fetch(`${officeBase()}${pathname}`, {
      method: "POST",
      body: form,
      headers: cookie ? { cookie } : {},
    });
  } catch {
    throw new Error(`The office API is not running at ${officeBase()}. Start it with npm run dev.`);
  }
  const text = await response.text();
  let body: { ok?: boolean; error?: string } = {};
  try {
    body = JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    body = {};
  }
  return { status: response.status, body, text, response };
}

async function signIn(email: string, password: string) {
  const form = new FormData();
  form.set("email", email);
  form.set("password", password);
  const result = await officePost("/api/office/login", form, "");
  assertNoSecret(result.text, password);
  return result;
}

function runStep1() {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("npm", ["run", "check:step1"], {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error("The Step 1 checks failed."));
    });
  });
}

function photoForm(name: string, bytes: Buffer, alt: string, browserType: string) {
  const form = new FormData();
  form.set("photo", new File([new Uint8Array(bytes)], name, { type: browserType }));
  form.set("alt", alt);
  form.set("category", "private");
  return form;
}

async function savedPhoto(alt: string) {
  const [row] = await db.select().from(photos).where(eq(photos.alt, alt)).limit(1);
  if (!row) throw new Error(`The ${alt} photo was not saved.`);
  const base = path.basename(row.src);
  if (base !== row.src.replace(/^\/uploads\//, "") || base.includes("..") || row.src.includes("\\")) {
    throw new Error(`The stored photo name has a folder path: ${row.src}`);
  }
  if (!/^\/uploads\/\d+-[a-f0-9]{16}\.(jpg|png|webp)$/.test(row.src)) {
    throw new Error(`The stored photo name was not a plain file name: ${row.src}`);
  }
  return row;
}

async function removePhoto(id: number, src: string, cookie: string) {
  const form = new FormData();
  form.set("id", String(id));
  const removed = await officePost("/api/office/photos/delete", form, cookie);
  if (removed.status !== 200 || !removed.body.ok) {
    throw new Error(`The test photo could not be removed: ${removed.status}`);
  }
  await unlink(path.join(process.cwd(), "public", "uploads", path.basename(src))).catch(() => undefined);
}

async function main() {
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD;
  if (!ownerEmail || !ownerPassword) {
    throw new Error("OWNER_EMAIL and OWNER_PASSWORD are required.");
  }

  const line = signInRefusalLine("person@example.com", new Date("2026-09-30T00:00:00.000Z"));
  if (line !== "Sign-in refused for person@example.com at 2026-09-30T00:00:00.000Z" || line.includes(PROBE_PASSWORD)) {
    throw new Error("The sign-in log line must contain the email and the time only.");
  }

  await runStep1();

  await db.delete(loginFailures).where(eq(loginFailures.email, ownerEmail));
  await db.delete(loginFailures).where(eq(loginFailures.email, EDITOR_EMAIL));
  await db.delete(loginFailures).where(eq(loginFailures.email, MANAGER_EMAIL));
  await db.delete(loginFailures).where(eq(loginFailures.email, "nobody-step2@travelwithmoeen.test"));
  await db.delete(users).where(eq(users.email, EDITOR_EMAIL));
  await db.delete(users).where(eq(users.email, MANAGER_EMAIL));

  const unknown = await signIn("nobody-step2@travelwithmoeen.test", PROBE_PASSWORD);
  const wrong = await signIn(ownerEmail, PROBE_PASSWORD);
  if (unknown.status !== 401 || wrong.status !== 401 || unknown.body.error !== LOGIN_ERROR || wrong.body.error !== LOGIN_ERROR) {
    throw new Error("A bad email and a bad password did not return the same 401 error.");
  }
  if (unknown.body.error !== wrong.body.error) {
    throw new Error("The login error text changed between an unknown email and a wrong password.");
  }

  const missing = await officePost("/api/office/tours", new FormData(), "");
  assertNoSecret(missing.text, PROBE_PASSWORD);
  if (missing.status !== 401 || missing.body.ok) {
    throw new Error(`An office save with no cookie returned ${missing.status}.`);
  }

  const owner = await authenticate(ownerEmail, ownerPassword);
  if (!owner) throw new Error("The Owner password was refused.");
  const created = await createUserAs(owner, {
    email: EDITOR_EMAIL,
    password: EDITOR_PASSWORD,
    role: "editor",
  });
  if (!created.ok) throw new Error("The Owner could not create the Step 2 Editor.");
  const managerCreated = await createUserAs(owner, {
    email: MANAGER_EMAIL,
    password: MANAGER_PASSWORD,
    role: "manager",
  });
  if (!managerCreated.ok) throw new Error("The Owner could not create the Step 2 Manager.");

  let editorCookie = "";
  const saved: { id: number; src: string }[] = [];
  try {
  const editorLogin = await signIn(EDITOR_EMAIL, EDITOR_PASSWORD);
  if (editorLogin.status !== 200 || !editorLogin.body.ok) {
    throw new Error("The Step 2 Editor could not sign in.");
  }
  editorCookie = sessionCookie(editorLogin.response);
  if (!editorCookie) throw new Error("Login did not set a session cookie.");

  const textFile = await officePost(
    "/api/office/photos",
    photoForm("notes.jpg", Buffer.from("this is a text file"), "step2-text", "image/jpeg"),
    editorCookie,
  );
  if (textFile.status !== 400 || textFile.body.error !== "Use a JPEG, PNG, or WebP file.") {
    throw new Error(`A text file renamed to .jpg was not refused: ${textFile.status} ${textFile.body.error ?? ""}`);
  }

  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  const svgFile = await officePost(
    "/api/office/photos",
    photoForm("icon.svg", svg, "step2-svg", "image/svg+xml"),
    editorCookie,
  );
  if (svgFile.status !== 400 || svgFile.body.error !== "Use a JPEG, PNG, or WebP file.") {
    throw new Error(`An SVG file was not refused: ${svgFile.status} ${svgFile.body.error ?? ""}`);
  }

  const oversized = Buffer.alloc(5 * 1024 * 1024 + 1);
  oversized[0] = 0xff;
  oversized[1] = 0xd8;
  oversized[2] = 0xff;
  const bigFile = await officePost(
    "/api/office/photos",
    photoForm("big.jpg", oversized, "step2-big", "image/jpeg"),
    editorCookie,
  );
  if (bigFile.status !== 400 || bigFile.body.error !== "The file is larger than 5 MB.") {
    throw new Error(`A file over 5 MB was not refused: ${bigFile.status} ${bigFile.body.error ?? ""}`);
  }

    const uploads = [
      { name: "tiny.jpg", bytes: JPEG, alt: "step2-jpeg", type: "image/jpeg" },
      { name: "tiny.png", bytes: PNG, alt: "step2-png", type: "image/png" },
      { name: "tiny.webp", bytes: WEBP, alt: "step2-webp", type: "image/webp" },
    ];
    for (const upload of uploads) {
      const result = await officePost("/api/office/photos", photoForm(upload.name, upload.bytes, upload.alt, upload.type), editorCookie);
      if (result.status !== 200 || !result.body.ok) {
        throw new Error(`A real ${upload.type} at under 5 MB was refused: ${result.status} ${result.body.error ?? ""}`);
      }
      saved.push(await savedPhoto(upload.alt));
    }

    const priceAttempt = await officePost("/api/office/rates", new FormData(), editorCookie);
    if (priceAttempt.status !== 403 || priceAttempt.body.ok) {
      throw new Error(`The Editor price save returned ${priceAttempt.status}.`);
    }

    const managerLogin = await signIn(MANAGER_EMAIL, MANAGER_PASSWORD);
    if (managerLogin.status !== 200 || !managerLogin.body.ok) {
      throw new Error("The Step 2 Manager could not sign in.");
    }
    const managerCookie = sessionCookie(managerLogin.response);
    if (!managerCookie) throw new Error("The Manager login did not set a session cookie.");
    const managerPhoto = await officePost(
      "/api/office/photos",
      photoForm("tiny.jpg", JPEG, "step2-manager", "image/jpeg"),
      managerCookie,
    );
    if (managerPhoto.status !== 403 || managerPhoto.body.ok || managerPhoto.body.error !== "You cannot edit a photo.") {
      throw new Error(`A Manager photo upload returned ${managerPhoto.status} ${managerPhoto.body.error ?? ""}`);
    }

    const logout = await officePost("/api/office/logout", new FormData(), editorCookie);
    if (!logout.body.ok || !cookieCleared(logout.response)) {
      throw new Error("Logout did not clear the session cookie.");
    }
    const afterLogout = await officePost("/api/office/tours", new FormData(), "");
    if (afterLogout.status !== 401) {
      throw new Error(`An office save after logout returned ${afterLogout.status}.`);
    }
    const badLogout = await officePost("/api/office/logout", new FormData(), "twm_office=not-a-session");
    if (badLogout.status !== 401 || !cookieCleared(badLogout.response)) {
      throw new Error("Logout left a bad session cookie in place.");
    }

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const failed = await signIn(EDITOR_EMAIL, PROBE_PASSWORD);
      if (failed.status !== 401 || failed.body.error !== LOGIN_ERROR) {
        throw new Error(`Failed sign-in ${attempt + 1} was not a normal refusal.`);
      }
    }
    const locked = await signIn(EDITOR_EMAIL, EDITOR_PASSWORD);
    if (locked.status !== 401 || locked.body.ok || locked.body.error !== LOGIN_ERROR) {
      throw new Error("The 11th sign-in inside 15 minutes was accepted.");
    }
    const failureRows = await db.select({ id: loginFailures.id }).from(loginFailures).where(eq(loginFailures.email, EDITOR_EMAIL));
    if (failureRows.length !== 10) {
      throw new Error(`Expected 10 recorded sign-in failures and found ${failureRows.length}.`);
    }
    const expiredAt = new Date(Date.now() - 16 * 60 * 1000);
    await db.update(loginFailures).set({ failedAt: expiredAt }).where(eq(loginFailures.email, EDITOR_EMAIL));
    const aged = await db
      .select({ failedAt: loginFailures.failedAt })
      .from(loginFailures)
      .where(eq(loginFailures.email, EDITOR_EMAIL));
    const cutoff = new Date(Date.now() - 15 * 60 * 1000);
    if (aged.length !== 10 || aged.some((row) => row.failedAt >= cutoff)) {
      throw new Error("The ten old sign-in failures were not outside the 15 minute window.");
    }
    const afterWindow = await signIn(EDITOR_EMAIL, EDITOR_PASSWORD);
    if (afterWindow.status !== 200 || !afterWindow.body.ok) {
      throw new Error("The right password was refused after the 15 minute window.");
    }
  } finally {
    for (const photo of saved) {
      await removePhoto(photo.id, photo.src, editorCookie).catch(() => undefined);
    }
    await db.delete(photos).where(eq(photos.alt, "step2-jpeg"));
    await db.delete(photos).where(eq(photos.alt, "step2-png"));
    await db.delete(photos).where(eq(photos.alt, "step2-webp"));
    await db.delete(loginFailures).where(eq(loginFailures.email, EDITOR_EMAIL));
    await db.delete(loginFailures).where(eq(loginFailures.email, MANAGER_EMAIL));
    await db.delete(loginFailures).where(eq(loginFailures.email, ownerEmail));
    await db.delete(loginFailures).where(eq(loginFailures.email, "nobody-step2@travelwithmoeen.test"));
    await db.delete(photos).where(eq(photos.alt, "step2-manager"));
    const editor = await authenticate(EDITOR_EMAIL, EDITOR_PASSWORD);
    if (editor) await removeUserAs(owner, editor.id);
    const manager = await authenticate(MANAGER_EMAIL, MANAGER_PASSWORD);
    if (manager) await removeUserAs(owner, manager.id);
    await db.delete(users).where(eq(users.email, EDITOR_EMAIL));
    await db.delete(users).where(eq(users.email, MANAGER_EMAIL));
  }

  await assertQuotes();
  console.info("Step 2 security checks passed.");
  process.exit(0);
}

async function assertQuotes() {
  const unplaced = await importRates();
  if (unplaced.length > 0) throw new Error(`The import left ${unplaced.length} rows without a place.`);
  const catalog = await loadCatalog();
  if (catalog.air.karachiAdd !== 30000) throw new Error("The Karachi air extra is not 30,000.");
  if ((GUEST_GRADES as readonly string[]).includes("Premier")) throw new Error("Premier is offered to guests.");

  const base = {
    place: "Skardu Valley",
    startCity: "Islamabad",
    mode: "road" as const,
    days: 5,
    adults: 2,
    children: 0,
    lapInfants: 0,
    seatInfants: 0,
    grade: "Deluxe",
    vehicle: "Gli Car",
    guide: false,
    meals: false,
    seasonPercent: 20 as const,
  };
  const premier = buildQuote({ ...base, grade: "Premier" }, catalog);
  if (premier.ok) throw new Error("Premier was quoted.");
  const quote = buildQuote(base, catalog);
  if (!quote.ok || quote.subtotal !== 117000 || quote.total !== 140400) {
    throw new Error(`The Skardu quote was ${quote.ok ? quote.total : quote.error}.`);
  }
  const fifteen = buildQuote({ ...base, seasonPercent: 15 }, catalog);
  if (!fifteen.ok || fifteen.subtotal !== 117000 || fifteen.profit === quote.profit || fifteen.total !== 134550) {
    throw new Error("15 percent did not change only the profit.");
  }
  const karachiRoad = buildQuote({ ...base, startCity: "Karachi" }, catalog);
  if (karachiRoad.ok) throw new Error("A road quote started in Karachi.");
  const karachiAir = buildQuote(
    { ...base, startCity: "Karachi", mode: "air", days: 4, adults: 1, vehicle: "Prado" },
    catalog,
  );
  const tickets = karachiAir.ok ? karachiAir.lines.find((line) => line.label === "Air tickets") : undefined;
  if (!karachiAir.ok || tickets?.amount !== 90000) throw new Error("The Karachi air quote did not include 30,000.");
  const guestResponse = await fetch(`${officeBase()}/api/quote`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(base),
  });
  const guestBody = (await guestResponse.json()) as { total?: number; profit?: number; lines?: unknown };
  if (guestResponse.status !== 200 || guestBody.total !== 140400 || guestBody.profit !== undefined || guestBody.lines !== undefined) {
    throw new Error("The guest quote did not return one total.");
  }

  const edited = buildQuote({ ...base, nightEdits: [{ night: 2, rate: 20000 }] }, catalog);
  if (!edited.ok || edited.nights[1]?.rate !== 20000 || edited.nights.some((night, index) => index !== 1 && night.rate !== 9000)) {
    throw new Error("Night two changed another night.");
  }
  if (edited.averageNightly !== 11750) throw new Error("The average nightly rate did not follow night two.");
  const cleared = buildQuote({ ...base, dayEdits: [{ day: 1, cleared: true }] }, catalog);
  const vehicleBefore = quote.lines.find((line) => line.label === "Vehicle")?.amount ?? 0;
  const vehicleAfter = cleared.ok ? cleared.lines.find((line) => line.label === "Vehicle")?.amount ?? 0 : 0;
  if (!cleared.ok || vehicleBefore - vehicleAfter !== 15000 || cleared.days[1]?.rent !== 8000) {
    throw new Error("Clearing one day did not remove that day's rent.");
  }

  const jeep = buildQuote(
    { ...base, place: "Kalash Valley & Chitral", days: 6, vehicle: "Gli Car" },
    catalog,
  );
  const jeepLine = jeep.ok ? jeep.lines.find((line) => line.amount === 90000) : undefined;
  if (!jeep.ok || !jeepLine || jeep.lines.some((line) => line.amount === 90000 * 6 || line.amount === 90000 * 3)) {
    throw new Error("The jeep amount was multiplied by the number of days.");
  }

  const taobat = await db.select().from(hotelRates).where(eq(hotelRates.place, "Taobat"));
  const taobatDeluxe = taobat.find((row) => row.grade === "Deluxe" && row.startCity === "Islamabad");
  if (!taobatDeluxe || taobatDeluxe.twin === 6000 || taobatDeluxe.twin !== 9000) {
    throw new Error("The live Taobat deluxe twin is still 6,000.");
  }
  const naran = await db.select().from(hotelRates).where(eq(hotelRates.place, "Naran Kaghan & Babusar Top"));
  const naranDeluxe = naran.find((row) => row.grade === "Deluxe" && row.startCity === "Islamabad");
  if (!naranDeluxe || naranDeluxe.twin !== 15000) throw new Error("Naran was not left as stored.");
  const [ratti] = await db.select().from(tours).where(eq(tours.code, "201")).limit(1);
  if (!ratti || ratti.priceSource !== "website" || ratti.basePrice !== 150000) {
    throw new Error("Ratti Gali is not on the website price of 150,000.");
  }

  const owner = await authenticate(process.env.OWNER_EMAIL?.trim().toLowerCase() ?? "", process.env.OWNER_PASSWORD ?? "");
  if (!owner) throw new Error("The Owner password was refused.");
  await db.delete(users).where(eq(users.email, MANAGER_EMAIL));
  const managerCreated = await createUserAs(owner, { email: MANAGER_EMAIL, password: MANAGER_PASSWORD, role: "manager" });
  if (!managerCreated.ok) throw new Error("The Owner could not create the Step 2 Manager.");
  try {
    const managerLogin = await signIn(MANAGER_EMAIL, MANAGER_PASSWORD);
    const managerCookie = sessionCookie(managerLogin.response);
    const hotel = taobatDeluxe;
    const form = new FormData();
    form.set("kind", "hotel");
    form.set("id", String(hotel.id));
    form.set("twin", "-1");
    form.set("triple", "12000");
    form.set("hotelName", hotel.hotelName);
    const negative = await officePost("/api/office/rates", form, managerCookie);
    if (negative.status !== 400 || negative.body.ok) throw new Error(`A negative rate returned ${negative.status}.`);
    const blank = new FormData();
    blank.set("kind", "hotel");
    blank.set("id", String(hotel.id));
    blank.set("twin", "");
    blank.set("triple", "12000");
    const missing = await officePost("/api/office/rates", blank, managerCookie);
    if (missing.status !== 400) throw new Error(`A blank rate returned ${missing.status}.`);
    const text = new FormData();
    text.set("kind", "hotel");
    text.set("id", String(hotel.id));
    text.set("twin", "nine");
    text.set("triple", "12000");
    const word = await officePost("/api/office/rates", text, managerCookie);
    if (word.status !== 400) throw new Error(`A non-numeric rate returned ${word.status}.`);
  } finally {
    const manager = await authenticate(MANAGER_EMAIL, MANAGER_PASSWORD);
    if (manager) await removeUserAs(owner, manager.id);
    await db.delete(users).where(eq(users.email, MANAGER_EMAIL));
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
