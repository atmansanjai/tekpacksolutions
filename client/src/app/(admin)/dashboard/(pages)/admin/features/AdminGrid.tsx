import AdminCard from "@/app/(admin)/dashboard/(pages)/admin/features/AdminCard";
import { cn } from "@/app/utils/cn";

interface AdminGridProps {
    admins: any[];
    isPending?: boolean;
}

export default function AdminGrid({ admins, isPending }: AdminGridProps) {
    return (
        <div
            className={cn(
                `grid flex-1 grid-cols-3 items-start justify-center gap-2 p-2 transition-opacity`,
                isPending ? "opacity-50" : "opacity-100"
            )}
        >
            {admins.map((admin) => (
                <AdminCard key={admin.id} adminFragmentRef={admin} />
            ))}
        </div>
    );
}
x