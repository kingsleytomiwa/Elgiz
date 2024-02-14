"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { languagesAndLocales } from "utils/constants";

export default function Page() {
    const { t, i18n } = useTranslation();

    const [hotel, setHotel] = useState({
        name: 'Hilton',
        email: 'german+alexeidoe2@aconite.io',
        phone: '23084342',
        address: 'Rua do Passeio Alegre 1',
        city: 'Las Vegas',
        country: 'USA',
        responsiblePersonName: 'Alexei Doe',
        responsiblePersonPosition: 'Manager',
        guestsAmount: 50,
    });

    async function createSubscription() {
        return fetch("/api/subscription", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...hotel,
                rooms: 1,
                period: 3,
                extras: ['restaurant', 'fitness', 'room-service']
            }),
        })
            .then((response) => response.text())
            .then((id) => id);
    }

    async function onApprove(data) {
        await fetch("/api/subscription/approve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
    }

    return (
        <PayPalScriptProvider
            options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                locale: languagesAndLocales?.find(l => l.lang === i18n.language)?.locale,
                currency: "EUR",
                vault: true,
            }}
        >
            <div className="max-w-[300px] w-[300px]">
                <PayPalButtons
                    // createOrder={createOrder}
                    onApprove={onApprove}
                    createSubscription={createSubscription}
                />
            </div>
        </PayPalScriptProvider>
    );
}
