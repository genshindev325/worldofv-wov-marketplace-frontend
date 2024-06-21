import { gql } from "graphql-request";

export const QueryGetUserActivity = gql`
    query GetUserActivity(
        $address: String!
        $page: Float!
        $perPage: Float!
        $fromDate: String
    ) {
        getUserActivity(
            userAddress: $address
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
                token {
                    name
                    rank
                }
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
                collection {
                    name
                    thumbnailImageUrl
                    customUrl
                }
            }
        }
    }
`;
