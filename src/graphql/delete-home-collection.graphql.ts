import { gql } from "graphql-request";

export const MutationDeleteHomeCollection = gql`
    mutation DeleteHomeCollection($id: String!) {
        deleteHomeCollection(id: $id)
    }
`;
