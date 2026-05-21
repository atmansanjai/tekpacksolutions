import SidebarButton from "@/app/(admin)/dashboard/layouts/sidebar/SidebarButton";
import { SidebarNavigations } from "@/app/(admin)/dashboard/layouts/sidebar/SidebarNavigation";

export default function Sidebar() {
    return (
        <div
            className={
                "flex h-full w-full flex-col items-start justify-between bg-white p-1"
            }
        >
            <div className={"flex w-full flex-col gap-1"}>
                {SidebarNavigations.map((nav) => (
                    <SidebarButton
                        key={nav.sidebarLabel}
                        label={nav.sidebarLabel}
                        href={nav.sidebarHref}
                    />
                ))}
            </div>
        </div>
    );
}
