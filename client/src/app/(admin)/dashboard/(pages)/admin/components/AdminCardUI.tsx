"use client";

import ToggleButtonUI from "@/app/(admin)/dashboard/components/ToggleButtonUI";
import { cn } from "@/app/utils/cn";
import React from "react";
import { IoPersonSharp } from "react-icons/io5";

interface AdminCardUIProps {
    readonly email: any;
    readonly id: string;
    readonly isActive: boolean;
    readonly name: string;
    readonly slug: string;
}

const AdminCardUI = React.memo(
    ({ id, name, email, isActive, slug }: AdminCardUIProps) => {
        return (
            <div
                data-id={id}
                className={
                    "hover:border-light/50 hover:bg-light/10 flex h-38 cursor-pointer items-center justify-start gap-5 border-4 border-white bg-white p-3"
                }
            >
                <div
                    className={
                        "bg-light/50 flex items-center justify-center p-5"
                    }
                >
                    <IoPersonSharp className={"text-primary text-6xl"} />
                </div>
                <div
                    className={
                        "flex h-full w-full flex-col items-start justify-between gap-1 py-2"
                    }
                >
                    <div>
                        <div
                            className={"flex items-center justify-start gap-2"}
                        >
                            <p className={"text-foreground/50 font-semibold"}>
                                Name :
                            </p>
                            <p>{name}</p>
                        </div>
                        <div
                            className={"flex items-center justify-start gap-2"}
                        >
                            <p className={"text-foreground/50 font-semibold"}>
                                Email :
                            </p>
                            <p>{email}</p>
                        </div>
                    </div>
                    <div
                        className={
                            "flex w-full items-center justify-between gap-2"
                        }
                    >
                        <p
                            className={cn(
                                "p-1 px-3 text-xs font-semibold",
                                isActive
                                    ? "bg-green-600/10 text-green-600"
                                    : "bg-red-600/10 text-red-600"
                            )}
                        >
                            {isActive ? "Active" : "Inactive"}
                        </p>
                        <ToggleButtonUI
                            isActive={isActive}
                            toggle={() => console.log("toggle")}
                        />
                    </div>
                </div>
            </div>
        );
    }
);

export default AdminCardUI;
