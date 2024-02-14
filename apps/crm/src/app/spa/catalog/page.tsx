import { redirect } from "next/navigation";
import { getUserSession } from "src/app/layout";
import ServicesCatalog from "./ServicesCatalog";

export default async function Page() {
    const session = await getUserSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <ServicesCatalog hotelId={session.user.hotelId!} />
    );
}
