import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const QuerySearchByString = gql`
    ${FragmentAsset}

    query SearchByString($text: String!, $limit: Float) {
        searchByString(text: $text, limit: $limit) {
            collections {
                name
                collectionId
                smartContractAddress
                thumbnailImageUrl
                isVerified
                customUrl
            }
            tokens {
                name
                smartContractAddress
                tokenId
                asset {
                    url
                    mimeType
                }
                collection {
                    isVerified
                }
            }
            users {
                name
                address
                customUrl
                verified
                verifiedLevel

                assets {
                    ...Asset
                }
            }
        }
    }
`;
