import { GraphQLExecutionError } from "@/relay/GraphQLExecutionError";
import { cookies } from "next/dist/server/request/cookies";
import {
    GraphQLResponse,
    Observable,
    RequestParameters,
    Variables,
} from "relay-runtime";

const HTTP_ENDPOINT = "http://localhost:8000/graphql";

export function fetchGraphQL(params: RequestParameters, variables: Variables) {
    return Observable.create((sink) => {
        const controller = new AbortController();

        (async () => {
            const isServer = typeof window === "undefined";
            let cookieHeader = "";

            if (isServer) {
                const cookieStore = await cookies();
                cookieHeader = cookieStore.toString();
            }

            try {
                const response = await fetch(HTTP_ENDPOINT, {
                    method: "POST",
                    credentials: "include",
                    cache: "no-store",
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json",
                        cookie: cookieHeader,
                    },
                    body: JSON.stringify({
                        documentId: params.id,
                        query: params.id ? undefined : params.text,
                        variables,
                    }),
                });

                // 1. Handle HTTP Network Errors (e.g., 500 Internal Server Error, 404)
                if (!response.ok) {
                    throw new Error(
                        `Network response was not ok: ${response.status}`
                    );
                }

                const json: GraphQLResponse = await response.json();
                const result = Array.isArray(json) ? json[0] : json;

                // 2. Handle GraphQL Specific Errors (e.g., validation, resolver crashes)
                if (result?.errors && result.errors.length > 0) {
                    // Throw the custom error containing the entire array
                    throw new GraphQLExecutionError(result.errors);
                }

                sink.next(json);
                sink.complete();
            } catch (error) {
                // 3. Forward the error to Relay's sink so the UI layer is notified
                sink.error(error as Error);
            }
        })();

        return () => {
            controller.abort();
        };
    });
}
