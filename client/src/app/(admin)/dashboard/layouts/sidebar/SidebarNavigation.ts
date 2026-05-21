export interface SidebarNavigationItem {
    sidebarLabel: string;
    sidebarHref: string;
}

export const SidebarNavigations: SidebarNavigationItem[] = [
    { sidebarLabel: "Admin", sidebarHref: "/dashboard/admin" },
    { sidebarLabel: "Sector", sidebarHref: "/dashboard/sector" },
    { sidebarLabel: "Category", sidebarHref: "/dashboard/category" },
    { sidebarLabel: "Machine", sidebarHref: "/dashboard/machine" },
    { sidebarLabel: "Solution", sidebarHref: "/dashboard/solution" },
];
