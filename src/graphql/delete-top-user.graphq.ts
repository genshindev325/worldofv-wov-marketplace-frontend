import { gql } from "graphql-request";

export const MutationDeleteVerifiedDrop = gql`
    mutation DeleteTopUser($kind: TopUserKind!, $address: String!) {
        deleted: deleteTopUser(kind: $kind, address: $address)
    }
`;
