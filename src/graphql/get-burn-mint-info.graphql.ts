import { gql } from "graphql-request";

export const FragmentBurnMintCollection = gql`
    fragment BurnMintCollection on CollectionDTO {
        collectionId
        name
        customUrl
        description
        thumbnailImageUrl
        bannerImageUrl
        smartContractAddress
        burnContractAddress
        cooldownContractAddress
    }
`;

export const QueryGetBurnMintInfo = gql`
    ${FragmentBurnMintCollection}
    query GetBurnMintInfo($smartContractAddress: String, $customUrl: String) {
        collection: getCollection(
            smartContractAddress: $smartContractAddress
            customUrl: $customUrl
        ) {
            ...BurnMintCollection
        }
    }
`;
