import { gql } from "graphql-request";

export const MutationDeleteHomeBanner = gql`
    mutation DeleteHomeBanner($id: String!) {
        deleteHomeBanner(id: $id)
    }
`;
