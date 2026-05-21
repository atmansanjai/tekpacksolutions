"use client";

import { AdminFragment$key } from "@/__generated__/AdminFragment.graphql";
import AdminCardUI from "@/app/(admin)/dashboard/(pages)/admin/components/AdminCardUI";
import { AdminFragment } from "@/app/(admin)/dashboard/(pages)/admin/query/AdminFragment";
import { useFragment } from "react-relay";

export interface AdminCardProps {
    adminFragmentRef: AdminFragment$key;
}

export default function AdminCard({ adminFragmentRef }: AdminCardProps) {
    const data = useFragment(AdminFragment, adminFragmentRef);
    return (
        <AdminCardUI
            id={data.id}
            name={data.name}
            email={data.email}
            isActive={data.isActive}
            slug={data.slug}
        />
    );
}
