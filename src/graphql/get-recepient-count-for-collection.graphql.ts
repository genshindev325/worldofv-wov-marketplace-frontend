import { gql } from "graphql-request";

export const QueryGetRecepientCountForCollection = gql`
    query getRecepientCountForCollection(
        $smartContractAddress: String!
        $page: Float!
        $perPage: Float!
        $fromDate: String
    ) {
        getRecepientCountForCollection(
            smartContractAddress: $smartContractAddress
            page: $page
            perPage: $perPage
            fromDate: $fromDate
        ) {
            hasMore
            users {
                count
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
