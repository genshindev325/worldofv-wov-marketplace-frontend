import { gql } from "graphql-request";

export const FragmentAsset = gql`
    fragment Asset on AssetDTO {
        size
        url
        mimeType
    }
`;
