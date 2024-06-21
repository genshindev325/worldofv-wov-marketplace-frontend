import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const QuerySearchByString = gql`
    ${FragmentAsset}

    query SearchUsersByString($text: String!, $limit: Float) {
        searchByString(text: $text, limit: $limit) {
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
