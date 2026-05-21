import { fetchQuery, GraphQLTaggedNode, Variables } from "relay-runtime";
import { getEnvironment, RelayRecordMap } from "../relay/environment";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";

export async function PrefetchQuery(
  query: GraphQLTaggedNode,
  variables: Variables = {},
): Promise<RelayRecordMap> {
  const environment: RelayModernEnvironment = getEnvironment();

  await fetchQuery(environment, query, variables).toPromise();

  return environment.getStore().getSource().toJSON();
}
