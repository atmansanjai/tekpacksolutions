"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleButton = React.memo(() => {
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8000/auth/google/callback";
    };

    return (
        <button
            onClick={handleGoogleLogin}
            className={
                "bg-foreground text-background/80 flex w-1/2 items-center justify-center space-x-2 p-3"
            }
        >
            <FcGoogle className={"text-2xl"} />
            <span> Login using Google Verification</span>
        </button>
    );
});

export default GoogleButton;
