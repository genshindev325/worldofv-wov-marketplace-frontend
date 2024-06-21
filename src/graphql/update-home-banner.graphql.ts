import { gql } from "graphql-request";

export const MutationUpsertHomeBanner = gql`
    mutation UpdateHomeBanner(
        $id: String!
        $image: String
        $position: Int
        $collectionId: String
        $artist: String
        $url: String
    ) {
        banner: updateHomeBanner(
            id: $id
            image: $image
            position: $position
            collectionId: $collectionId
            artist: $artist
            url: $url
        ) {
            id
        }
    }
`;
