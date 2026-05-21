import { graphql } from "relay-runtime";

export const AdminFragment = graphql`
    fragment AdminFragment on Admin{
        id
        email
        isActive
        name
        slug
    }
`;
