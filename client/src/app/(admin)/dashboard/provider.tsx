"use client";

import { getEnvironment } from "@/relay/environment";
import React from "react";
import { RelayEnvironmentProvider } from "react-relay";

export default function Providers({ children }: { children: React.ReactNode }) {
    const environment = React.useMemo(() => getEnvironment(), []);
    return (
        <RelayEnvironmentProvider environment={environment}>
            {children}
        </RelayEnvironmentProvider>
    );
}
