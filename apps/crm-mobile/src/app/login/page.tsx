import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignInForm from "ui/src/SignInForm";

export const metadata = {
  title: "Login",
};

export default async function Login() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return <SignInForm />;
}
