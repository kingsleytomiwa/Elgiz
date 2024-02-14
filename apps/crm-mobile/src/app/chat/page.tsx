import ChatsContainer from "../../../components/ChatsContainer";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ownerAuthOptions } from "backend-utils";

export default async function Chats() {
  const session = await getServerSession(ownerAuthOptions);

  if (!session) {
    redirect("/login");
  }
  return <ChatsContainer name={session.user.name!} />;
}
