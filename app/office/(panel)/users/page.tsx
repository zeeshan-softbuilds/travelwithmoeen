import { redirect } from "next/navigation";
import { UsersPanel } from "@/components/office/users/UsersPanel";
import { getOfficeSession, getOfficeUsers } from "@/lib/http/office-session";

export default async function UsersPage() {
  const actor = await getOfficeSession();
  if (!actor?.canManageUsers) redirect("/office");
  const users = await getOfficeUsers();
  return <UsersPanel users={users} selfId={actor.id} />;
}
