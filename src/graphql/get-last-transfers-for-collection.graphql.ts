import { gql } from "graphql-request";

export const QueryGetLastTransfersForCollection = gql`
    query getLastTransfersForCollection(
        $smartContractAddress: String!
        $page: Float!
        $perPage: Float!
        $fromDate: String
    ) {
        getLastTransfersForCollection(
            smartContractAddress: $smartContractAddress
            page: $page
            perPage: $perPage
            fromDate: $fromDate
        ) {
            hasMore
            users {
                dateTime
                user {
                    address
                    profileImageUrl
                    verifiedLevel
                    verified
                    name
                    customUrl
                }
            }
        }
    }
`;
