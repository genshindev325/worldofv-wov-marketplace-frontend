import { gql } from "graphql-request";

export const QueryGetTokenExists = gql`
    query GetTokenExists(
        $tokenId: String
        $name: String
        $smartContractAddress: String!
    ) {
        exists: getTokenExists(
            tokenId: $tokenId
            name: $name
            smartContractAddress: $smartContractAddress
        )
    }
`;
