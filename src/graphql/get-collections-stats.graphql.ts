import { gql } from "graphql-request";

export const QueryGetHomepageCollectionsStats = gql`
    query GetCollectionsStats(
        $pagination: AplosPaginationArgs!
        $timeframe: Interval!
    ) {
        getCollectionsStats(pagination: $pagination, timeframe: $timeframe) {
            collectionStats {
                smartContactAddress
                name
                itemsSold
                percentageChange
                volumeVET
                volumeWOV
                volumeSumInVet
                ownerCount
                totalItemsSold
                totalVolumeVET
                totalVolumeWOV
                totalVolumeSumInVet
                averagePriceVET
                averagePriceWOV
                floorPrice {
                    price
                    currency
                }
                collection {
                    type
                    collectionId
                    thumbnailImageUrl
                    isVerified
                    isStakingActive
                    name
                    isVisible
                }
            }
        }
    }
`;
