import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const FragmentAggregatedTokenCollection = gql`
    fragment AggregatedTokenCollection on CollectionDTO {
        collectionId
        blockchainId
        smartContractAddress
        stakingContractAddresses
        creatorAddress
        name
        customUrl
        thumbnailImageUrl
        isVerified
        isVisible
        type
        importedAt
    }
`;

export const FragmentAggregatedTokenCreator = gql`
    fragment AggregatedTokenCreator on User {
        address
        name
        customUrl
        blacklisted
        verified
        verifiedLevel

        assets {
            ...Asset
        }
    }
`;

export const FragmentAggregatedToken = gql`
    ${FragmentAggregatedTokenCollection}
    ${FragmentAggregatedTokenCreator}

    fragment AggregatedToken on AggregatedToken {
        tokenId
        smartContractAddress
        name
        description
        creatorAddress
        editionsCount
        royalty
        mintedAt
        attributes
        score
        rank
        stakingEarnings
        collection {
            ...AggregatedTokenCollection
        }
        creator {
            ...AggregatedTokenCreator
        }
        assets {
            ...Asset
        }
    }
`;

export const QueryGetToken = gql`
    ${FragmentAsset}
    ${FragmentAggregatedToken}

    query GetToken($tokenId: String!, $smartContractAddress: String!) {
        token: getToken(
            tokenId: $tokenId
            smartContractAddress: $smartContractAddress
        ) {
            ...AggregatedToken
        }
    }
`;
