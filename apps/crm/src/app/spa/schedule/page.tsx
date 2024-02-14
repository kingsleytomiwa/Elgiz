import { redirect } from "next/navigation";
import { getUserSession } from "src/app/layout";
import ServicesSchedule from "./ServicesSchedule";
import { Suspense } from "react";
import SingleRequest from "src/app/requests/SingleRequest";

export default async function Page({ searchParams }) {
    const session = await getUserSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <>
            <ServicesSchedule />

            <Suspense>
                <SingleRequest searchParams={searchParams} />
            </Suspense>
        </>
    );
}
