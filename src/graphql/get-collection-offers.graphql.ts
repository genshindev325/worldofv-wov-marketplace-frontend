export const QueryGetCollectionOffers = `
    query($userAddress: String!, $smartContractAddress: String!) {
        getOffersForUser(
            address: $userAddress
            type: CREATED
            filters: { smartContractAddress: $smartContractAddress, type: COLLECTION }
        ) {
            offerId
        }
    }
`;
