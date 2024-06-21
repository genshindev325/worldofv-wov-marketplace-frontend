import { gql } from "graphql-request";

export const MutationUpsertVerifiedDrop = gql`
    mutation UpsertVerifiedDrop(
        $id: String
        $position: Int!
        $dateTime: String!
        $imageUrl: String
        $title: String
        $address: String
        $collectionId: String
        $tokenId: String
    ) {
        drop: upsertVerifiedDrop(
            id: $id
            position: $position
            dateTime: $dateTime
            imageUrl: $imageUrl
            title: $title
            address: $address
            collectionId: $collectionId
            tokenId: $tokenId
        ) {
            id
        }
    }
`;
