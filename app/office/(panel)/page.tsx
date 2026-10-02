import { getOfficeSession } from "@/lib/http/office-session";

export default async function OfficeHomePage() {
  const user = await getOfficeSession();
  if (!user) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-semibold">Office</h1>
      {user.canEditContent ? (
        <p className="mt-3 text-slate-700">You can edit tours, places, the blog, the gallery, reviews, home slides, and site details.</p>
      ) : null}
      {user.canManageUsers ? (
        <p className="mt-3 text-slate-700">You can create a login, remove a login, and change a role.</p>
      ) : null}
      {user.canEditRates ? (
        <p className="mt-3 text-slate-700">You can change rates, the season, vehicles, jeep lines, and a quote.</p>
      ) : null}
      {user.role === "manager" ? (
        <p className="mt-3 text-slate-700">You cannot edit public page text.</p>
      ) : null}
    </div>
  );
}
