export default interface IMinimumOfferData {
    price: string | null;
    editionCount: number;
    collection: {
        collectionId: string;
        smartContractAddress: string;
        name: string;
        thumbnailImageUrl: string;
        customUrl?: string;
    };
}
