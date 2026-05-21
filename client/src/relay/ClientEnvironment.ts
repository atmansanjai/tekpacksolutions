import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";
import { RelayRecordMap } from "@/relay/environment";

let clientEnvironment: Environment | undefined;

export function createClientEnvironment(
  fetchGraphQL: FetchFunction,
  initialRecords?: RelayRecordMap,
): Environment {
  if (!clientEnvironment) {
    clientEnvironment = new Environment({
      network: Network.create(fetchGraphQL),
      store: new Store(new RecordSource(initialRecords)),
    });
  }

  return clientEnvironment;
}