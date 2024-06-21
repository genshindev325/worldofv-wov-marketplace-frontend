export const QueryGetPreviousOffers = `
    query(
        $userAddress: String!
        $smartContractAddress: String!
        $editionIds: [String!]!
    ) {
        getOffersForUser(
            type: CREATED
            address: $userAddress
            filters: {
                smartContractAddress: $smartContractAddress
                editionIds: $editionIds
            }
            pagination: {
                page: 1
                perPage: 1000
            }
        ) {
            offers {
                offerId
                editionId
                price
                currency
            }
        }
    }
`;
