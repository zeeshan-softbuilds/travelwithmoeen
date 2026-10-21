import { redirect } from "next/navigation";
import { LoginForm } from "@/components/office/LoginForm";
import { getOfficeSession } from "@/lib/http/office-session";

export default async function OfficeLoginPage() {
  const user = await getOfficeSession();
  if (user) redirect("/office");
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <main id="main" className="login" tabIndex={-1}>
        <div className="login-box">
          <div className="login-brand">
            <span className="logo" aria-hidden="true">
              TM
            </span>
            <b>Travel With Moeen Office</b>
          </div>
          <LoginForm />
        </div>
      </main>
    </>
  );
}
