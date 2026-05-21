import { graphql } from "relay-runtime";

export const AdminBySlugQuery = graphql`
    query AdminBySlugQuery($slug: String!) {
        adminBySlug(slug: $slug) {
            ...AdminFragment
        }
    }
`;
