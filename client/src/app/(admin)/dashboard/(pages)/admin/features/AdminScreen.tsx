"use client";

import AdminContainer from "@/app/(admin)/dashboard/(pages)/admin/features/AdminContainer";

import { AdminQuery as AdminQueryType } from "@/__generated__/AdminQuery.graphql";
import { AdminQuery } from "@/app/(admin)/dashboard/(pages)/admin/query/AdminQuery";
import { useLazyLoadQuery } from "react-relay";

export interface AdminScreenProps {
    variables: any;
}

export default function AdminScreen({ variables }: AdminScreenProps) {
    const queryData = useLazyLoadQuery<AdminQueryType>(AdminQuery, variables, {
        fetchPolicy: "store-only",
    });

    return <AdminContainer queryRef={queryData} />;
}
