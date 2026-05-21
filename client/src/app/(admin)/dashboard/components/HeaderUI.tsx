import React from "react";

interface HeaderUIProps {
    title: string;
    actionLabel?: string;
    action?: () => void;
}

const HeaderUI = React.memo(({ title, actionLabel, action }: HeaderUIProps) => {
    return (
        <div className={"flex h-15 items-center justify-between bg-white p-2"}>
            <h1 className={"text-primary font-semibold uppercase"}>{title}</h1>
            {actionLabel && action && (
                <button
                    onClick={action}
                    className={"bg-primary text-light p-2 px-4"}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
});

export default HeaderUI;
