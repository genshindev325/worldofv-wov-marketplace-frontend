export const MutationUpsertMinimumOffer = `
    mutation($smartContractAddress: String!, $price: String) {
        upsertMinimumOffer(
            smartContractAddress: $smartContractAddress
            price: $price
        ) {
            price
        }
    }
`;
