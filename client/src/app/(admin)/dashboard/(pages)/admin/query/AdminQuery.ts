import { graphql } from "relay-runtime";

export const AdminQuery = graphql`
    query AdminQuery(
        $first: Int
        $last: Int
        $after: String
        $before: String
        $filter: AdminFilter
        $sort: AdminSort
    ) {
        ...AdminPaginationFragment
            @arguments(
                first: $first
                last: $last
                after: $after
                before: $before
                filter: $filter
                sort: $sort
            )
    }
`;
