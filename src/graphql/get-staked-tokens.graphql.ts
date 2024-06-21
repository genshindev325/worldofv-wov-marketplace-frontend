import { gql } from "graphql-request";

export const QueryGetStakedTokens = gql`
    query GetStakedTokens(
        $ownerAddress: String!
        $collectionId: String!
        $stakingContractAddress: String
    ) {
        tokens: getStakedTokens(
            ownerAddress: $ownerAddress
            collectionId: $collectionId
            stakingContractAddress: $stakingContractAddress
        ) {
            items {
                smartContractAddress
                tokenId
                editionId
                stakingContractAddress
            }
        }
    }
`;
