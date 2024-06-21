import { gql } from "graphql-request";

export const MutationPinMetadataToArweave = gql`
    mutation PinMetadataToArweave(
        $name: String!
        $image: Upload!
        $description: String
        $collectionName: String
        $attributes: [TokenAttribute!]
        $categories: [String!]
    ) {
        data: pinMetadataToArweave(
            name: $name
            image: $image
            description: $description
            collectionName: $collectionName
            attributes: $attributes
            categories: $categories
        ) {
            metadataTxId
            imageTxId
        }
    }
`;
