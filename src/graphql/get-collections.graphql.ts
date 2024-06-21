import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const QueryGetCollections = gql`
    ${FragmentAsset}

    query GetCollections($filters: GetCollectionsFilterArgs!) {
        collections: getCollections(filters: $filters) {
            items {
                collectionId
                customUrl
                name
                isVisible
                thumbnailImageUrl

                creator {
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

            meta {
                total
                hasMore
            }
        }
    }
`;
