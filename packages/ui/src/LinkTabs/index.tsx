"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import {
    Tab,
    Tabs,
} from "@mui/material";
import Link from 'next/link';
import { useTranslation } from 'i18n';

interface Props {
    isAdmin?: boolean;
    links: {
        path: string;
        label: string;
    }[];
}

const LinkTabs: React.FC<Props> = ({ links, isAdmin = false }) => {
    const pathname = usePathname();
    const [value, setValue] = React.useState(0);
    const { t } = useTranslation({ ns: "portal" });

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        // event.type can be equal to focus with selectionFollowsFocus.
        if (
            event.type !== 'click' ||
            (event.type === 'click' &&
                samePageLinkNavigation(
                    event as React.MouseEvent<HTMLAnchorElement, MouseEvent>,
                ))
        ) {
            setValue(newValue);
        }
    };

    return (
        <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor={"transparent" as "primary"}
        >
            {links.map((link, index) => (
                <Tab
                    key={link.path}
                    LinkComponent={Link}
                    href={link.path}
                    sx={{
                        width: "360px",
                        backgroundColor: pathname === link.path ? "#3F51B5" : "#DDE3EE",
                        color: pathname === link.path ? "#ffffff !important" : "#121828",
                        borderBottom: 0,
                        ...getLinkStyle(index, links.length)
                    }}
                    label={isAdmin ? link.label : t(link.label)}
                />
            ))}
        </Tabs>
    );
};

function samePageLinkNavigation(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
) {
    if (
        event.defaultPrevented ||
        event.button !== 0 || // ignore everything but left-click
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
    ) {
        return false;
    }
    return true;
}

function getLinkStyle(index: number, length: number) {
    if (index === 0) {
        return {
            borderRadius: "100px 0px 0px 100px",
        };
    }

    if (index === length - 1) {
        return {
            borderRadius: "0px 100px 100px 0px",
        };
    }

    return {
        borderRadius: 0,
    };
};

export default LinkTabs;
