import { JWT } from "backend-utils";
import ResetPasswordForm from "components/forms/ResetPasswordForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Reset Password"
};

export default async function ResetPassword({ searchParams }) {
  if (!searchParams.token) {
    redirect("/");
  };

  try {
    const payload = await JWT.decode(searchParams?.token, process.env.JWT_SECRET!);

    if (!payload) {
      redirect("/");
    };

    return <ResetPasswordForm {...payload} />;
  } catch (e) {
    redirect("/");
  }
};
