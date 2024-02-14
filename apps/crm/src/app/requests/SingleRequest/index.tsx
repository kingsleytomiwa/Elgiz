import prisma from "db";
import RequestDetails from "../RequestDetails";
import { cache } from "react";
import { getUserSession } from "src/app/layout";

const getRequest = cache(async (id: string, hotelId: string) => {
    return await prisma.request.findUnique({
        where: {
            id,
            hotelId,
        },
        include: {
            worker: { select: { name: true, color: true } },
            guest: { select: { name: true, room: true } },
            history: { include: { staff: { select: { name: true } } } },
        },
    });
});

const SingleRequest = async ({
    searchParams
}) => {
    if (!searchParams.selected) {
        return;
    }

    const session = await getUserSession();
    const request = await getRequest(searchParams.selected, session?.user.hotelId!);

    return (
        <RequestDetails
            request={request as any}
        />
    );
};

export default SingleRequest;
