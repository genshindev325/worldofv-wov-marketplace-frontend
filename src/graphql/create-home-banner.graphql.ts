import { gql } from "graphql-request";

export const MutationCreateHomeBanner = gql`
    mutation CreateHomeBanner(
        $image: String!
        $position: Int!
        $collectionId: String
        $artist: String
        $url: String
    ) {
        banner: createHomeBanner(
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
