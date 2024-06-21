import { gql } from "graphql-request";

export const MutationConsumeSecretCode = gql`
    mutation ConsumeSecretCode(
        $clientId: String!
        $secretCode: String!
        $metadata: JSONObject!
    ) {
        validCode: consumeSecretCode(
            clientId: $clientId
            secretCode: $secretCode
            metadata: $metadata
        )
    }
`;
