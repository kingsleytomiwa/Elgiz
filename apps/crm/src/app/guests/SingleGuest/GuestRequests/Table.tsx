"use client";

import { Request, RequestStatus } from '@prisma/client';
import EntityTable from 'components/EntityTable';
import { format } from 'date-fns';
import { useTranslation } from 'i18n';
import { useRouter } from 'next/navigation';
import React from 'react';
import { CellStatus } from 'ui';
import { dateTimeFormat } from 'utils';

interface Props {
    requests: Pick<Request, 'createdAt' | 'id' | 'section' | 'status'>[];
}

const GuestRequestsTable: React.FC<Props> = ({ requests }) => {
    const { t } = useTranslation({ ns: "portal" });
    const router = useRouter();

    return (
        <EntityTable
            data={requests}
            isLoading={false}
            columns={[
                {
                    key: "section",
                    label: "category",
                    minWidth: 200,
                },
                {
                    key: "status",
                    label: "status",
                    minWidth: 200,
                    //@ts-ignore
                    format: (status: string) => (
                        <CellStatus
                            text={`${Object.values(RequestStatus).findIndex((el) => el === status) + 1
                                } - ${t(status.toLowerCase())}`}
                        />
                    ),
                },
                {
                    key: "createdAt",
                    label: "request_time",
                    minWidth: 200,
                    format: (date: Date) => format(date, dateTimeFormat),
                },
            ]}
            onSelect={r => router.push(`/requests?selected=${r.id}`)}
            needsPagination={false}
            shouldSetParams={false}
        />
    );
};

export default GuestRequestsTable;
