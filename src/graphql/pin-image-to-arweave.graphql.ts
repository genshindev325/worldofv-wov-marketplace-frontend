import { gql } from "graphql-request";

export const MutationPinImageToArweave = gql`
    mutation PinImageToArweave($image: Upload!) {
        txId: pinImageToArweave(image: $image)
    }
`;
