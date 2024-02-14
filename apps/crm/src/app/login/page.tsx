import SignInForm from "ui/src/SignInForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login"
};

export default async function Login() {
  const session = await getServerSession();

  if (session) {
    redirect('/');
  }

  return <SignInForm />;
};
