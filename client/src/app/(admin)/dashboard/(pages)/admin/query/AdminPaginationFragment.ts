import { graphql } from "relay-runtime";

export const AdminPaginationFragment = graphql`
    fragment AdminPaginationFragment on Query
    @refetchable(queryName: "AdminPaginationQuery")
    @argumentDefinitions(
        first: { type: "Int" }
        after: { type: "String" }
        last: { type: "Int" }
        before: { type: "String" }
        filter: { type: "AdminFilter" }
        sort: { type: "AdminSort" }
    ) {
        admins(
            first: $first
            last: $last
            after: $after
            before: $before
            filter: $filter
            sort: $sort
        )
            @connection(
                key: "AdminQuery_admins"
                filters: ["filter", "sort", "after", "before"]
            ) {
            edges {
                cursor
                node {
                    id
                    ...AdminFragment
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor
                startCursor
                totalCount
            }
        }
    }
`;
