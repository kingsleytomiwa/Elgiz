"use client";

import React, { useEffect } from 'react';

const RedirectToMobile: React.FC = () => {
    useEffect(() => {
        if (window.navigator && /Mobi|Android/i.test(navigator.userAgent) && process.env.NODE_ENV === "production") {
            window.location.href = "https://m.portal.elgiz.io";
        }
    }, []);

    return (
        <></>
    );
};

export default RedirectToMobile;
