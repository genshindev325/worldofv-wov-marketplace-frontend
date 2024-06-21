import { gql } from "graphql-request";

export const QueryGetGenesisBySet = gql`
    query GetGenesisCountBySet($ownerAddress: String!) {
        getGenesisCountBySet(ownerAddress: $ownerAddress) {
            set
            count
        }
    }
`;

export const QueryGetGenesisTotal = gql`
    query GetGenesisTotal(
        $ownerAddress: String!
        $smartContractAddress: String!
    ) {
        getOwnedCountByCollection(
            ownerAddress: $ownerAddress
            smartContractAddress: $smartContractAddress
        )
    }
`;

export const QueryGetStakingRewards = gql`
    query GetStakingRewards(
        $ownerAddress: String!
        $smartContractAddress: String!
    ) {
        getGenerationRateForUser(
            ownerAddress: $ownerAddress
            smartContractAddress: $smartContractAddress
        )
    }
`;

export const QueryGetMissingTokens = gql`
    query getMissingTokens(
        $ownerAddress: String!
        $set: String!
        $pagination: PaginationArgs
    ) {
        getMissingTokens(
            ownerAddress: $ownerAddress
            set: $set
            pagination: $pagination
        ) {
            tokens {
                country
                name
                media {
                    url
                    mimeType
                    size
                }
                collectionName
                collectionThumbnail
                collectionCustomUrl
            }
            meta {
                hasMore
                total
            }
        }
    }
`;
