import React from "react";

export interface ToggleButtonProps {
    isActive: boolean;
    toggle: () => void;
}

const ToggleButtonUI = React.memo(({ isActive, toggle }: ToggleButtonProps) => {
    return (
        <label className="group relative inline-flex cursor-pointer items-center">
            <input
                type="checkbox"
                className="peer sr-only"
                checked={isActive}
                onChange={toggle}
            />

            <div className="peer-checked:bg-primary h-7 w-12 rounded-full bg-neutral-300 shadow-inner transition-all duration-300" />

            <div className="absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 peer-checked:translate-x-5" />
        </label>
    );
});

export default ToggleButtonUI;
