import { gql } from "graphql-request";

export const MutationDeleteVerifiedDrop = gql`
    mutation DeleteVerifiedDrop($id: String!) {
        deleteVerifiedDrop(id: $id)
    }
`;
