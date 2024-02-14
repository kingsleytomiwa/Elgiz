"use client";

import Timer from 'components/Timer';
import React from 'react';
import { formatTimeDifference } from 'utils';

interface Props {
    completedAt?: Date | null;
    createdAt: Date;
}

const RequestTimer: React.FC<Props> = ({ completedAt, createdAt }) => {
    if (completedAt) {
        return formatTimeDifference(createdAt, completedAt);
    }

    return (
        <Timer creationDate={createdAt} />
    );
};

export default RequestTimer;
