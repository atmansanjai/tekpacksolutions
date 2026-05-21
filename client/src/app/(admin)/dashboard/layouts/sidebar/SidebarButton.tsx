"use client";

import { cn } from "@/app/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarButtonProps {
    label: string;
    href: string;
}

export default function SidebarButton({ label, href }: SidebarButtonProps) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={cn(
                "bg-background border-background border-2 px-2 py-1 font-medium transition-colors duration-200 ease-in-out",
                isActive && "bg-light text-primary border-primary/10 border-2"
            )}
        >
            {label}
        </Link>
    );
}
