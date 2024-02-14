"use client";

import { useTranslation } from 'i18n';
import React from 'react';
import CardsRow, { CardsRowProps } from 'ui/src/CardsRow';

const LocalizedCardsRow: React.FC<CardsRowProps> = ({ cards }) => {
    const { t } = useTranslation({ ns: 'portal' });

    return (
        <CardsRow cards={cards.map(card => ({
            ...card,
            title: t(card.title),
            hint: card.hint ? t(card.hint) : undefined,
        }))}
        />
    );
};

export default LocalizedCardsRow;
