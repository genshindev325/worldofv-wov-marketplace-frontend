import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";
import { FragmentAggregatedToken } from "./get-token.graphql";

export const FragmentSellerFields = gql`
    fragment SellerFields on User {
        address
        name
        customUrl
        blacklisted
        verified
        verifiedLevel
        email

        assets {
            ...Asset
        }
    }
`;

export const QueryGetAuction = gql`
    ${FragmentAsset}
    ${FragmentSellerFields}
    ${FragmentAggregatedToken}

    query GetAuction(
        $auctionId: String!
        $includeToken: Boolean
        $includeSeller: Boolean
    ) {
        auction: getAuction(
            auctionId: $auctionId
            includeToken: $includeToken
            includeSeller: $includeSeller
        ) {
            auctionId
            tokenId
            editionId
            smartContractAddress
            sellerAddress
            settlorAddress
            highestBidderAddress
            reservePrice
            highestBid
            addressVIP180
            startingTime
            endTime
            status
            createdAt
            updatedAt
            seller {
                ...SellerFields
            }
            token {
                ...AggregatedToken
            }
        }
    }
`;
