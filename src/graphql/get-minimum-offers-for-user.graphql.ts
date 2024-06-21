export const QueryGetMinimumOffersForUser = `
    query GetMinimumOffersForUser($userAddress: String!) {
        offers: getMinimumOffersForUser(userAddress: $userAddress) {
            price
            editionCount
            collection {
                collectionId
                smartContractAddress
                name
                thumbnailImageUrl
                customUrl
            }
        }
    }
`;
