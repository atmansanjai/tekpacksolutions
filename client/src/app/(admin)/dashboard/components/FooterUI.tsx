"use client";

import { cn } from "@/app/utils/cn";
import React from "react";
import { MdDoubleArrow, MdOutlineDoubleArrow } from "react-icons/md";

export interface FooterUIProps {
    label: string;
    totalCount: number;
    currentCount: number;
    currentPage: number;
    pageSize: number;

    hasNextPage?: boolean;
    hasPreviousPage?: boolean;

    onNextPage?: () => void;
    onPreviousPage?: () => void;
}

const FooterUI = React.memo(
    ({
        onPreviousPage,
        onNextPage,
        hasNextPage,
        hasPreviousPage,
        label,
        totalCount,
        currentCount,
        currentPage,
        pageSize,
    }: FooterUIProps) => {
        const start = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;

        const end = Math.min(start + currentCount - 1, totalCount);
        return (
            <footer className="flex h-14 items-center justify-between bg-white p-2">
                <div className="flex items-center gap-2">
                    <button
                        className={cn(
                            "bg-primary text-light flex cursor-pointer items-center gap-2 p-2 px-4",
                            !hasPreviousPage && "cursor-not-allowed opacity-50"
                        )}
                        onClick={onPreviousPage}
                        disabled={!hasPreviousPage}
                    >
                        <MdOutlineDoubleArrow className="rotate-180" />
                        <span>Previous</span>
                    </button>

                    <button
                        className={cn(
                            "bg-primary text-light flex cursor-pointer items-center justify-center gap-2 p-2 px-4",
                            !hasNextPage && "cursor-not-allowed opacity-50"
                        )}
                        onClick={onNextPage}
                        disabled={!hasNextPage}
                    >
                        <span>Next</span>
                        <MdDoubleArrow />
                    </button>
                </div>

                <div className="mr-20 flex items-center gap-x-2 text-sm text-neutral-600">
                    <div className={"flex items-center gap-2"}>
                        <span>Page</span>
                        <span className="font-semibold">{currentPage}</span>
                        <span>-</span>
                    </div>
                    <p className={"flex items-center gap-2"}>
                        <span>Showing</span>
                        <span className="font-semibold">
                            {start} - {end}
                        </span>
                        <span>of Total</span>
                        <span className="font-semibold">{totalCount}</span>
                        <span> {label}</span>
                    </p>
                </div>
            </footer>
        );
    }
);

export default FooterUI;
