import { gql } from "graphql-request";

export const QueryGetTokenActivity = gql`
    query GetTokenActivity(
        $address: String!
        $tokenId: String!
        $page: Float!
        $perPage: Float!
        $fromDate: String
    ) {
        getTokenActivity(
            smartContractAddress: $address
            tokenId: $tokenId
            page: $page
            perPage: $perPage
            fromDate: $fromDate
        ) {
            hasMore
            events {
                event
                dateTime
                resourceId
                smartContractAddress
                tokenId
                editionId
                price
                payment
                fromAddress
                toAddress
                fromUser {
                    name
                }
                toUser {
                    name
                }
                asset {
                    url
                    mimeType
                }
            }
        }
    }
`;
