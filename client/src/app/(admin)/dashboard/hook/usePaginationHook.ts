"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface PaginationHookProps {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    endCursor?: string | null;
    startCursor?: string | null;
    dataCount: number;
}

const usePaginationHook = ({
    hasNextPage,
    hasPreviousPage,
    endCursor,
    startCursor,
    dataCount,
}: PaginationHookProps) => {
    const router = useRouter();

    const searchParams = useSearchParams();

    const [isPending, startTransition] = React.useTransition();

    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const updateUrlParams = React.useCallback(
        (newParams: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(newParams).forEach(([key, value]) => {
                if (value === null) {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });

            router.push(`?${params.toString()}`);
        },
        [router, searchParams]
    );

    const goToNextPage = React.useCallback(() => {
        if (!hasNextPage || !endCursor) {
            return;
        }
        startTransition(() => {
            updateUrlParams({
                page: String(currentPage + 1),
                first: String(dataCount),
                after: endCursor,
                last: null,
                before: null,
            });
        });
    }, [hasNextPage, endCursor, currentPage, dataCount, updateUrlParams]);

    const goToPreviousPage = React.useCallback(() => {
        if (!hasPreviousPage || !startCursor) {
            return;
        }
        startTransition(() => {
            updateUrlParams({
                page: String(Math.max(1, currentPage - 1)),
                last: String(dataCount),
                before: startCursor,
                first: null,
                after: null,
            });
        });
    }, [hasPreviousPage, startCursor, currentPage, dataCount, updateUrlParams]);

    return {
        currentPage,
        isPending,
        goToNextPage,
        goToPreviousPage,
    };
};

export default usePaginationHook;
