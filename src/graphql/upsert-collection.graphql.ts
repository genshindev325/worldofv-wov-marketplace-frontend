import { gql } from "graphql-request";

export const MutationUpsertCollection = gql`
    mutation UpsertCollection(
        $collectionId: String
        $name: String
        $description: String
        $isVisible: Boolean
        $thumbnailImage: Upload
        $bannerImage: Upload
    ) {
        collection: updateCollection(
            collectionId: $collectionId
            name: $name
            description: $description
            isVisible: $isVisible
            thumbnailImage: $thumbnailImage
            bannerImage: $bannerImage
        ) {
            collectionId
            blockchainId
            creatorAddress
            name
            description
            customUrl
            thumbnailImageUrl
            bannerImageUrl
            isVerified
            isVisible
        }
    }
`;
