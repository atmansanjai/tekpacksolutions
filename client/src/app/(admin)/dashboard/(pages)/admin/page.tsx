// src/app/(admin)/dashboard/(pages)/admin/page.tsx
import AdminScreen from "@/app/(admin)/dashboard/(pages)/admin/features/AdminScreen";
import { AdminQuery } from "@/app/(admin)/dashboard/(pages)/admin/query/AdminQuery";
import useSearchParamsHook from "@/app/(admin)/dashboard/hook/useSearchParamsHook";
import { PrefetchQuery } from "@/relay/PrefetchQuery";
import RelayHydrate from "@/relay/RelayHydrate";

interface PageProps {
    searchParams: Promise<{
        after?: string;
        before?: string;
        first?: string;
        last?: string;
    }>;
}

export default async function Admin({ searchParams }: PageProps) {
    const params = await searchParams;

    const variables = useSearchParamsHook({
        searchParams: params,
        dataCount: 12,
    });

    const records = await PrefetchQuery(AdminQuery, variables);

    return (
        <RelayHydrate records={records}>
            <AdminScreen variables={variables} />
        </RelayHydrate>
    );
}
