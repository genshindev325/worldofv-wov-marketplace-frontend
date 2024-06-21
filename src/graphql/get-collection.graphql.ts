import { gql } from "graphql-request";

export const FragmentCollection = gql`
    fragment Collection on CollectionDTO {
        collectionId
        blockchainId
        smartContractAddress
        stakingContractAddresses
        isStakingActive
        name
        description
        customUrl
        thumbnailImageUrl
        bannerImageUrl
        minimumOffer
        isVerified
        isVisible
        isMinting
        type
        creator {
            address
            name
        }
    }
`;

export const QueryGetCollection = gql`
    ${FragmentCollection}

    query GetCollection(
        $collectionId: String
        $smartContractAddress: String
        $customUrl: String
    ) {
        collection: getCollection(
            collectionId: $collectionId
            smartContractAddress: $smartContractAddress
            customUrl: $customUrl
        ) {
            ...Collection
        }
    }
`;
