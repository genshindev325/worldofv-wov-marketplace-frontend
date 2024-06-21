import { gql } from "graphql-request";

export const QueryUpsertVerifiedDrop = gql`
    mutation UpsertTopUser(
        $kind: TopUserKind!
        $address: String!
        $position: Int!
    ) {
        user: upsertTopUser(
            kind: $kind
            address: $address
            position: $position
        ) {
            address
            position
        }
    }
`;
