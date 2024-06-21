import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const FragmentOwnerFields = gql`
    ${FragmentAsset}

    fragment OwnerFields on MarketplaceEdition {
        owner {
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
    }
`;

export const QueryGetEditions = gql`
    ${FragmentOwnerFields}

    query GetEditions($tokenId: String!, $smartContractAddress: String!) {
        editions: getTokenEditions(
            tokenId: $tokenId
            smartContractAddress: $smartContractAddress
        ) {
            items {
                editionId
                smartContractAddress
                stakingContractAddress
                saleId
                salePrice
                saleAddressVIP180
                ownerAddress
                cooldownEnd
                isFreeShipping
                ...OwnerFields
            }
        }
    }
`;
