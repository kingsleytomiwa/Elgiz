import React, { Suspense, cache } from 'react';
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import { format } from "date-fns";
import { Position, TransactionType } from '@prisma/client';
import { getUserSession } from 'src/app/layout';
import { redirect } from 'next/navigation';
import CancelButton from './CancelButton';
import EditButton from './EditButton';
import prisma from 'db';
import RoomsField from './RoomsField';
import PaymentMethodSelect from './PaymentMethodSelect';
import RenewalSelect from './RenewalSelect';
import FormWrapper from './FormWrapper';
import { Period, calculateTotalPrice } from 'utils/billing';
import PayButton from './PayButton';
import PaymentModal from './PaymentModal';
import { displayNumber, getCycleLabel, isWithinDays } from 'utils';
import PaymentHistoryModal from './PaymentHistoryModal';
import ShowPaymentHistoryButton from './ShowPaymentHistoryButton';

const getHotel = cache(prisma.hotel.findFirst);
const getLastPayment = cache((hotelId: string, isPaid = true) => {
    return prisma.payment.findFirst({
        where: { hotelId, isPaid },
        orderBy: { createdAt: "desc" },
    });
});

const Page: React.FC = async ({ searchParams }: { searchParams: { edit: string; pay: string; history: string; }; }) => {
    const session = await getUserSession();

    if (session?.user.position !== Position.OWNER) {
        redirect("/profile");
    }

    const payment = await getLastPayment(session.user.hotelId!);

    if (!payment) {
        return <>There are no payments for this hotel</>;
    }

    const hotel = await getHotel({
        where: { id: session.user.hotelId! },
    });
    const method = hotel!.paypalSubscriptionId ? TransactionType.PAYPAL : TransactionType.BANK_TRANSFER;
    const isEdit = searchParams.edit === "true";

    const canPayNow = isWithinDays(payment.endDate!);
    const upcomingCycle = getCycleLabel(payment.endDate!, payment.period);

    const paymentPendingConfirmation = await getLastPayment(session.user.hotelId!, false) !== null;

    return (
        <>
            <FormWrapper>
                <Box sx={{ position: "relative", height: "550px", width: "100%" }}>
                    <Box
                        sx={{
                            paddingX: "48px",
                            paddingY: "24px",
                            height: "100%",
                            width: "100%",
                            background: "white",
                        }}
                    >

                        {isEdit ? (
                            <>
                                <Box
                                    sx={{
                                        marginTop: "8px",
                                        color: "#121828",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        height: "25px",
                                    }}
                                >
                                    Изменение настроек подписки
                                </Box>
                                <Box
                                    sx={{
                                        maxWidth: "1183px",
                                        width: "100%",
                                        display: "flex",
                                        gap: "48px",
                                        marginTop: "40px",
                                    }}
                                >
                                    <Box sx={{ flex: 1, opacity: "0.5" }}>
                                        <Typography
                                            sx={{
                                                color: "#374151",
                                                opacity: "0.5",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            длительность подписки
                                        </Typography>
                                        <Typography sx={{ color: "#121828", fontSize: "14px", marginTop: "16px" }}>
                                            {payment.period === 3
                                                ? payment.period + " месяца"
                                                : payment.period + " месяцев"}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ flex: 1, opacity: "0.5" }}>
                                        <Typography
                                            sx={{
                                                color: "#374151",
                                                opacity: "0.5",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Подписка активна до
                                        </Typography>
                                        <Typography sx={{ color: "#121828", fontSize: "14px", marginTop: "16px" }}>
                                            {format(payment.endDate!, "dd MMMM yyyy")}
                                        </Typography>
                                    </Box>

                                    <RoomsField rooms={hotel?.rooms!} />
                                    <PaymentMethodSelect method={method} />

                                    {hotel?.paypalSubscriptionId && (
                                        <RenewalSelect autoRenewal={hotel?.autoRenewal!} />
                                    )}
                                </Box>
                            </>
                        ) : (
                            <>
                                <EditButton />
                                <Box
                                    sx={{
                                        maxWidth: "1183px",
                                        width: "100%",
                                        display: "flex",
                                        gap: "48px",
                                        marginTop: "40px",
                                    }}
                                >
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                color: "#374151",
                                                opacity: "0.5",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            длительность подписки
                                        </Typography>
                                        <Typography sx={{ color: "#121828", fontSize: "14px", marginTop: "16px" }}>
                                            {payment.period === 3
                                                ? payment.period + " месяца"
                                                : payment.period + " месяцев"}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                color: "#374151",
                                                opacity: "0.5",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Подписка активна до
                                        </Typography>
                                        <Typography sx={{ color: "#121828", fontSize: "14px", marginTop: "16px" }}>
                                            {format(payment.endDate!, "dd MMMM yyyy")}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                color: "#374151",
                                                opacity: "0.5",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Количество номеров
                                        </Typography>
                                        <Typography sx={{ color: "#121828", fontSize: "14px", marginTop: "16px" }}>
                                            {hotel!.rooms}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                color: "#374151",
                                                opacity: "0.5",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Способ оплаты
                                        </Typography>
                                        <Typography sx={{ color: "#121828", fontSize: "14px", marginTop: "16px" }}>
                                            {method === "PAYPAL"
                                                ? "Банковская карта/PayPal"
                                                : "Банковский перевод"}
                                        </Typography>
                                    </Box>

                                    {hotel?.paypalSubscriptionId && (
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                sx={{
                                                    color: "#374151",
                                                    opacity: "0.5",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                Автопродление
                                            </Typography>

                                            <Typography sx={{ color: "#121828", fontSize: "14px", marginTop: "16px" }}>
                                                {hotel?.autoRenewal ? 'Включено' : 'Отключено'}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </>
                        )}

                        <Box sx={{ margin: "64px -48px 48px -48px", borderTop: "1px solid #121828" }} />
                        <Box sx={{ display: "flex", gap: "24px" }}>
                            {method === TransactionType.BANK_TRANSFER && (
                                <PayButton disabled={!canPayNow || paymentPendingConfirmation} />
                            )}

                            <ShowPaymentHistoryButton />
                        </Box>

                        {method === TransactionType.BANK_TRANSFER && (
                            <>
                                {(!canPayNow && !paymentPendingConfirmation) && (
                                    <Typography sx={{ mt: 2, width: 550 }}>
                                        {'"'}Оплатить{'"'} станет доступно за полтора месяца до окончания текущего периода подписки.
                                    </Typography>
                                )}

                                {paymentPendingConfirmation && (
                                    <Typography sx={{ mt: 2, width: 550 }}>
                                        Запрос об оплате уже был отправлен, как только запрос будет подтвержден или отклонен, то вы сможете отправить повторное уведомление.
                                    </Typography>
                                )}
                            </>
                        )}

                        <Box sx={{ display: "flex", gap: "120px", width: "100%", marginTop: "48px" }}>
                            <Box>
                                <Typography
                                    sx={{
                                        color: "#374151",
                                        opacity: "0.5",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Сумма к следующей оплате
                                </Typography>
                                <Typography
                                    sx={{ marginTop: "16px", color: "#3F51B5", fontSize: "32px", fontWeight: "700" }}
                                >
                                    EUR {displayNumber(calculateTotalPrice(hotel!.rooms!, payment.period as Period).total)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: "#374151",
                                        opacity: "0.5",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Следующий расчетный период
                                </Typography>
                                <Typography sx={{ marginTop: "16px" }}>
                                    {upcomingCycle}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {isEdit && (
                    <Box
                        sx={{
                            display: "flex",
                            gap: "16px",
                            marginTop: "24px",
                            marginLeft: "auto",
                            width: "fit-content",
                            // opacity: isViewPayment ? "1" : "0",
                            // pointerEvents: isViewPayment ? "auto" : "none",
                            zIndex: 11,
                            transition: ".3s ease",
                        }}
                    >
                        <CancelButton />
                        <Button
                            type='submit'
                            sx={{
                                color: "white",
                                padding: "16px 42px",
                                background: "#3F51B5",
                                borderRadius: "20px",
                                "&:hover": {
                                    opacity: "0.8",
                                    background: "#3F51B5",
                                },
                            }}
                        >
                            Сохранить
                        </Button>
                    </Box>
                )}
            </FormWrapper>

            {method === TransactionType.BANK_TRANSFER && canPayNow && !paymentPendingConfirmation && (
                <PaymentModal
                    open={searchParams.pay === "true"}
                    cycle={upcomingCycle}
                    hotelEmail={hotel?.email!}
                />
            )}

            <Suspense>
                <PaymentHistoryModal open={searchParams.history === 'true'} />
            </Suspense>

            {/*
      <Dialog
        isOpened={isModalHistory}
        isDisabled={false}
        onCancel={() => setIsModalHistory(false)}
        onSubmit={() => setIsModalHistory(false)}
        buttons={false}
      >
        <Box sx={{ width: "1205px" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: "600", fontSize: "14px" }}>История платежей</Typography>
            <Button onClick={() => setIsModalHistory(false)}>
              <ClearIcon sx={{ color: "#3F51B5" }} />
            </Button>
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
          {historyPayment.map((item, i) => (
            <Box
              key={i}
              sx={{
                marginX: "24px",
                paddingX: "24px",
                paddingY: "16px",
                display: "flex",
                fontWeight: "600",
                fontSize: "12px",
              }}
            >
              <Typography sx={{ flex: 1, minWidth: "313px" }}>{item.period}</Typography>
              <Typography sx={{ flex: 1 }}>{item.amount}</Typography>
              <Typography sx={{ flex: 1 }}>
                {activePayment.type === "PAYPAL" ? "Банковская карта/PayPal" : "Банковский перевод"}
              </Typography>
              <Box sx={{ flex: 1, minWidth: "344px" }}>
                {item.receipt ? (
                  <a>
                    <Button
                      sx={{
                        minWidth: 0,
                        textAlign: "left",
                        width: "fit-content",
                        borderBottom: "1px solid #3F51B5",
                        borderRadius: "0px",
                        padding: "0px",
                      }}
                    >
                      Скачать
                    </Button>
                  </a>
                ) : (
                  <Button
                    sx={{
                      minWidth: 0,
                      textAlign: "left",
                      width: "fit-content",
                      borderBottom: "1px solid #3F51B5",
                      borderRadius: "0px",
                      padding: "0px",
                    }}
                  >
                    Запросить
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Dialog> */}
        </>
    );
};

export default Page;
