import { gql } from "graphql-request";

export const QueryGetAllBrands = gql`
    query GetAllBrands {
        brands: getAllBrands {
            id
            name
            description
            thumbnailImageUrl
            position
        }
    }
`;
