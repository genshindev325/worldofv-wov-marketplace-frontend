import { gql } from "graphql-request";

export const QueryGetCollectionActivity = gql`
    query GetCollectionActivity(
        $address: String!
        $page: Float!
        $perPage: Float!
        $fromDate: String
    ) {
        getCollectionActivity(
            smartContractAddress: $address
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
                }
            }
        }
    }
`;
