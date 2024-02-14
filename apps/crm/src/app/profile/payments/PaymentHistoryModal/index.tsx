import { Box, Typography } from '@mui/material';
import React, { cache } from 'react';
import Wrapper from './Wrapper';
import prisma from 'db';
import { getUserSession } from 'src/app/layout';
import { getCycleLabel } from 'utils';
import CloseButton from './CloseButton';
import PaymentActionButton from './PaymentActionButton';

interface Props {
    open: boolean;
}

const getPayments = cache((hotelId: string) => prisma.payment.findMany({
    where: {
        hotelId
    },
    orderBy: {
        startDate: 'desc'
    }
}));

const PaymentHistoryModal: React.FC<Props> = async ({ open }) => {
    const session = await getUserSession();
    const payments = await getPayments(session!.user.hotelId!);

    return (
        <Wrapper open={open}>
            <Box sx={{ width: "1205px" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: "600", fontSize: "14px" }}>История платежей</Typography>
                    <CloseButton />
                </Box>
                <Box
                    sx={{
                        marginX: "24px",
                        paddingX: "24px",
                        marginTop: "60px",
                        background: "#F3F4F6",
                        paddingY: "16px",
                        display: "flex",
                        fontWeight: "600",
                        fontSize: "12px",
                    }}
                >
                    <Typography sx={{ flex: 1, textTransform: "uppercase", minWidth: "313px" }}>
                        Расчетный период
                    </Typography>
                    <Typography sx={{ flex: 1, textTransform: "uppercase" }}>Сумма платежа</Typography>
                    <Typography sx={{ flex: 1, textTransform: "uppercase" }}>способ оплаты</Typography>
                    <Typography sx={{ flex: 1, textTransform: "uppercase", minWidth: "344px" }}>
                        квитанция об оплате
                    </Typography>
                </Box>

                {payments.map(item => (
                    <Box
                        key={item.id}
                        sx={{
                            marginX: "24px",
                            paddingX: "24px",
                            paddingY: "16px",
                            display: "flex",
                            fontWeight: "600",
                            fontSize: "12px",
                        }}
                    >
                        <Typography sx={{ flex: 1, minWidth: "313px" }}>{getCycleLabel(item.startDate, item.period)}</Typography>
                        <Typography sx={{ flex: 1 }}>{item.amount}</Typography>
                        <Typography sx={{ flex: 1 }}>
                            {item.type === "PAYPAL" ? "Банковская карта/PayPal" : "Банковский перевод"}
                        </Typography>
                        <Box sx={{ flex: 1, minWidth: "344px" }}>
                            <PaymentActionButton payment={item} />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Wrapper>
    );
};

export default PaymentHistoryModal;
