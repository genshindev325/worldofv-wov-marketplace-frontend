import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const FragmentMarketplaceCollection = gql`
    fragment MarketplaceCollection on MarketplaceCollection {
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

export const FragmentMarketplaceUser = gql`
    ${FragmentAsset}

    fragment MarketplaceUser on MarketplaceUser {
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

export const FragmentMarketplaceEdition = gql`
    fragment MarketplaceEdition on MarketplaceEdition {
        editionId
        ownerAddress
        saleId
        salePrice
        saleAddressVIP180
        stakingContractAddress
        cooldownEnd
    }
`;

export const FragmentMarketplaceToken = gql`
    ${FragmentMarketplaceCollection}
    ${FragmentMarketplaceUser}
    ${FragmentMarketplaceEdition}

    fragment MarketplaceToken on MarketplaceToken {
        tokenId
        smartContractAddress
        name
        creatorAddress
        editionsCount
        editionsOnSale
        categories
        attributes
        score
        rank
        collectionId
        mintedAt
        minimumSaleId
        minimumSalePrice
        minimumSaleAddressVIP180
        highestOfferId
        highestOfferPrice
        highestOfferAddressVIP180
        minimumAuctionId
        minimumAuctionReservePrice
        minimumAuctionHighestBid
        minimumAuctionAddressVIP180
        minimumAuctionEndTime
        stakingEarnings
        creator {
            ...MarketplaceUser
        }
        collection {
            ...MarketplaceCollection
        }
        editions {
            ...MarketplaceEdition
        }
        assets {
            ...Asset
        }
    }
`;

export const QueryGetTokens = gql`
    ${FragmentMarketplaceToken}

    query GetTokens(
        $pagination: PaginationArgs
        $filters: GetTokensFilterArgs
        $sortBy: SortTokensByEnum
    ) {
        tokens(pagination: $pagination, filters: $filters, sortBy: $sortBy) {
            items {
                ...MarketplaceToken
            }
            meta {
                total
                hasMore
            }
        }
    }
`;
