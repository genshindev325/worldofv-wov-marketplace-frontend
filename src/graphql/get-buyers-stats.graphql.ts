import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const QueryGetBuyersStats = gql`
    ${FragmentAsset}
    query GetBuyersStats(
        $pagination: AplosPaginationArgs!
        $timeframe: Interval!
    ) {
        getBuyersStats(pagination: $pagination, timeframe: $timeframe) {
            buyersStats {
                buyerAddress
                itemsBought
                volumeVET
                volumeWOV
                volumeSumInVet
                percentageChange
                totalItemsBought
                totalVolumeVET
                totalVolumeWOV
                totalVolumeSumInVet
                user {
                    address
                    name
                    customUrl
                    verified
                    verifiedLevel
                    assets {
                        ...Asset
                    }
                }
            }
        }
    }
`;
