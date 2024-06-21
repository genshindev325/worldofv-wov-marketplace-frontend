import { gql } from "graphql-request";

export const FragmentTokenAttributes = gql`
    fragment TokenAttributes on CollectionTokenAttributesItem {
        key
        values {
            value
            count
        }
    }
`;

export const QueryGetCollectionTokenAttributes = gql`
    ${FragmentTokenAttributes}
    query GetCollectionTokenAttributes($collectionId: String!) {
        attributes: getCollectionTokenAttributes(collectionId: $collectionId) {
            ...TokenAttributes
        }
    }
`;
