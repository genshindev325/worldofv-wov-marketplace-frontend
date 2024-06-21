import { gql } from "graphql-request";

export const QueryGetOwnedWoVCollections = gql`
    query GetOwnedWoVCollections($ownerAddress: String) {
        collections: getWoVCollections(ownerAddress: $ownerAddress) {
            collectionId
            name
            stakingContractAddresses
            customUrl
            thumbnailImageUrl
            isVerified
        }
    }
`;

export const QueryGetWoVCollectionsByBrand = gql`
    query GetWoVCollectionsByBrand($brandId: String) {
        collections: getWoVCollections(brandId: $brandId) {
            collectionId
            name
            description
            customUrl
            mintPageUrl
            thumbnailImageUrl
            bannerImageUrl
            isVerified
            isMinting
            isStakingActive
        }
    }
`;
