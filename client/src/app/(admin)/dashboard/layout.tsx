import Sidebar from "@/app/(admin)/dashboard/layouts/sidebar/Sidebar";
import Providers from "@/app/(admin)/dashboard/provider";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Providers>
            <section className={"flex h-screen w-screen"}>
                <aside className={"h-full w-50"}>
                    <Sidebar />
                </aside>
                <main className={"h-full w-full flex-1 "}>{children}</main>
            </section>
        </Providers>
    );
}
