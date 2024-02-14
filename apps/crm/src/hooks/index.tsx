"use client";

import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

export function useHandleParams() {
    const { replace } = useRouter();
    const pathname = usePathname();

    const [, startTransition] = useTransition();

    return useCallback((pairs: [string, string][], ruthless = false) => {
        const params = new URLSearchParams(window.location.search);

        pairs.forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        const final = `${pathname}?${params.toString()}`;

        if (ruthless) {
            replace(final);
            return;
        }

        startTransition(() => {
            replace(final);
        });
    }, [pathname, replace]);
}

export function useParamsState<T>(initialState: T) {
    const [state, setState] = useState(initialState);
    const handleParams = useHandleParams();
    const searchParams = useSearchParams();

    const setParamsState = useCallback((newState: Partial<T>) => {
        setState(prevState => {
            const nextState = { ...prevState, ...newState };

            Object.entries(newState).forEach(([key, value]) => {
                if (searchParams?.get(key) === value) {
                    nextState[key] = value;
                }
                if (value === undefined) {
                    delete nextState[key as keyof T];
                }
            });

            handleParams(Object.entries(nextState));

            return nextState;
        });

    }, [handleParams, searchParams]);

    return [state, setParamsState] as [T, typeof setParamsState];
}
