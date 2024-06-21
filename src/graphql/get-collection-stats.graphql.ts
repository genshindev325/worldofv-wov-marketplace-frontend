import { gql } from "graphql-request";

export const QueryGetCollectionStats = gql`
    query GetCollectionStats(
        $collectionId: String
        $smartContractAddress: String
        $customUrl: String
    ) {
        stats: getCollectionStats(
            collectionId: $collectionId
            smartContractAddress: $smartContractAddress
            customUrl: $customUrl
        ) {
            itemsCount
            ownersCount
            floorPrices {
                price
                addressVIP180
            }
            offersCount
            highestCollectionOffer {
                price
                addressVIP180
            }
        }
    }
`;
