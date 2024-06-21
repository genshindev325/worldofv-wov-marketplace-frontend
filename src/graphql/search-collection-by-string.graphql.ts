import { gql } from "graphql-request";

export const QuerySearchCollectionsByString = gql`
    query SearchCollectionsByString($text: String!) {
        searchCollectionsByString(text: $text) {
            collections {
                collectionId
            }
        }
    }
`;
