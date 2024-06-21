import { gql } from "graphql-request";

export const MutationUpdateFreeShipping = gql`
    mutation UpdateFreeShipping(
        $smartContractAddress: String!
        $editionId: String!
        $isFreeShipping: Boolean!
    ) {
        updateFreeShipping(
            smartContractAddress: $smartContractAddress
            editionId: $editionId
            isFreeShipping: $isFreeShipping
        )
    }
`;
