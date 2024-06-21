import { GraphQLService } from "@/services/GraphQLService";

export async function getCollectionStats(collectionId: string) {
    const [
        //collectionReq,
        statsReq,
    ] = await Promise.allSettled([
        // sdk.GetCollection({ collectionId }),
        GraphQLService.sdk().GetCollectionStats({ collectionId }),
    ]);

    return statsReq.status === "fulfilled" ? statsReq.value.stats : null;
    // if (collectionReq.status === "fulfilled") {
    // return {
    // collection: {
    // ...collectionReq.value.collection,
    // stats: statsReq.status === "fulfilled" ? statsReq.value.stats : null,
    // },
    // };
    // }
}
