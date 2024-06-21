import { gql } from "graphql-request";

export const QueryCheckSecretCode = gql`
    query CheckSecretCode($clientId: String!, $secretCode: String!) {
        validCode: checkSecretCode(clientId: $clientId, secretCode: $secretCode)
    }
`;
