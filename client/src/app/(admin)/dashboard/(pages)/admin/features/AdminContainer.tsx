"use client";

import AdminGrid from "@/app/(admin)/dashboard/(pages)/admin/features/AdminGrid";
import { AdminPaginationFragment } from "@/app/(admin)/dashboard/(pages)/admin/query/AdminPaginationFragment";
import FooterUI from "@/app/(admin)/dashboard/components/FooterUI";
import HeaderUI from "@/app/(admin)/dashboard/components/HeaderUI";
import usePaginationHook from "@/app/(admin)/dashboard/hook/usePaginationHook";
import { useMemo } from "react";
import { usePaginationFragment } from "react-relay";

export interface AdminContainerProps {
    queryRef: any;
}

export default function AdminContainer({ queryRef }: AdminContainerProps) {
    const { data } = usePaginationFragment(AdminPaginationFragment, queryRef);

    const [admins, adminLength] = useMemo(() => {
        const edges = data?.admins?.edges ?? [];
        const nodes = edges.map((edge: any) => edge?.node).filter(Boolean);
        return [nodes, edges.length];
    }, [data?.admins?.edges]);

    const { hasNextPage, hasPreviousPage, endCursor, startCursor } =
        data.admins?.pageInfo ?? {};

    const totalCount = data.admins?.pageInfo?.totalCount ?? 0;

    const { currentPage, isPending, goToNextPage, goToPreviousPage } =
        usePaginationHook({
            hasNextPage,
            hasPreviousPage,
            endCursor,
            startCursor,
            dataCount: 12,
        });

    return (
        <section className="flex h-screen w-full flex-col gap-2">
            <HeaderUI title={"Admins"} />
            <AdminGrid admins={admins} isPending={isPending} />
            <FooterUI
                label={"Admins"}
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={12}
                currentCount={adminLength}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                onNextPage={goToNextPage}
                onPreviousPage={goToPreviousPage}
            />
        </section>
    );
}
