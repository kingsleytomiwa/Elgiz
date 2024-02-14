import ForgotPasswordForm from "ui/src/ForgotPasswordForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Forgot Password"
};

export default async function ForgotPassword() {
  const session = await getServerSession();

  if (session) {
    redirect('/');
  }

  return <ForgotPasswordForm />;
};
