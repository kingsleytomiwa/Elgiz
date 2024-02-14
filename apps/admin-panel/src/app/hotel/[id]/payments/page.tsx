import { cache } from "react";
import prisma, { getHotel as _getHotel } from "db";
import { Box } from "@mui/material";
import { dateTimeFormat } from "utils";
import AddPaymentForm from "./AddPaymentForm";
import { format } from "date-fns";
import Table from "./Table";

const formatPaymentDate = (date: Date) => format(date, dateTimeFormat);

const getHotel = cache(_getHotel);

export const metadata = {
    title: "Hotel details",
};

const getPayments = cache((hotelId: string) => prisma.payment.findMany({
    where: {
        hotelId,
    },
    orderBy: { startDate: "desc" },
}));

export default async function Page({ params }: { params: { id: string; }; }) {
    const hotel = await getHotel(params.id);
    const payments = await getPayments(params.id);

    return (
        <>
            <AddPaymentForm hotelId={hotel!.id} />

            <Box sx={{ maxWidth: "1446px" }}>
                <Table
                    data={payments.map(data => ({
                        ...data,
                        startDate: formatPaymentDate(data.createdAt!),
                        endDate: formatPaymentDate(data.endDate!),
                    })) as any}
                />
            </Box>
        </>
    );
}
