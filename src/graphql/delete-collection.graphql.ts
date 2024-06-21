export const MutationDeleteCollection = `
mutation DeleteCollection($collectionId: String) {
    deleteCollection(collectionId: $collectionId) {
        done
    }
}
`;
