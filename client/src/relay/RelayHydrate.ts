"use client";
import React from "react";
import { useRelayEnvironment } from "react-relay";
import { RecordSource } from "relay-runtime";
import { RelayRecordMap } from "@/relay/environment";

export default function RelayHydrate({
                                         records,
                                         children,
                                     }: {
    records: RelayRecordMap;
    children: React.ReactNode;
}) {
    const environment = useRelayEnvironment();

    React.useInsertionEffect(() => {
        const clientEnv = typeof window !== "undefined";
        if (clientEnv && records) {
            const store = environment.getStore();
            store.publish(new RecordSource(records));
            store.notify();
        }
    }, [environment, records]);

    return children;
}
