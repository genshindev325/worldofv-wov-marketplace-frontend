import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const QueryGetAuctionHistory = gql`
    ${FragmentAsset}

    query GetAuctionHistory($auctionId: String!, $bidsOnly: Boolean) {
        history: auctionHistory(auctionId: $auctionId, bidsOnly: $bidsOnly) {
            id
            auctionId
            tokenId
            smartContractAddress
            event
            txID
            timestamp
            price
            updatedDate
            user {
                address
                profileId
                name
                customUrl
                verified
                verifiedLevel
                blacklisted
                assets {
                    ...Asset
                }
            }
        }
    }
`;
