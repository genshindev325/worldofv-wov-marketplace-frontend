import { gql } from "graphql-request";

export const QueryGetUserCollections = gql`
    query GetUserCollections($userAddress: String!) {
        getCollections(filters: { creatorAddress: $userAddress }) {
            items {
                collectionId
                name
            }
        }
    }
`;
