import { Environment, RecordSource } from "relay-runtime";
import { createServerEnvironment } from "@/relay/ServerEnvironment";
import { fetchGraphQL } from "@/relay/fetchGraphQL";
import { createClientEnvironment } from "@/relay/ClientEnvironment";

export type RelayRecordMap = { [key: string]: any };

let clientEnv: Environment | undefined;

export function getEnvironment(initialRecords?: RelayRecordMap): Environment {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return createServerEnvironment(fetchGraphQL);
  }

  if (!clientEnv) {
    clientEnv = createClientEnvironment(fetchGraphQL, initialRecords);
  }

  if (initialRecords) {
    const source = new RecordSource(initialRecords);
    clientEnv.getStore().publish(source);
    clientEnv.getStore().notify();
  }

  return clientEnv;
}
