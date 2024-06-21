import { isUUID } from "class-validator";
import { NextPage, NextPageContext } from "next";
import { NextQueryParamProvider } from "next-query-params";
import Web3 from "web3";
import { CollectionPageContent } from "../../components/collection/CollectionPageContent";
import Head from "../../components/Head";
import { CollectionFragment } from "../../generated/graphql";
import {
    BatchSelectProvider,
    TokenBatchSelectContext,
} from "../../providers/BatchSelectProvider";
import CollectionProvider from "../../providers/CollectionProvider";
import { GraphQLService } from "../../services/GraphQLService";

interface CollectionProps {
    collection: CollectionFragment;
    referer: string | null;
    host: string | null;
}

const Collection: NextPage<CollectionProps> = ({
    collection,
    referer,
    host,
}) => (
    <>
        <Head
            title={collection.name}
            description={collection.description}
            image={collection.thumbnailImageUrl || collection.bannerImageUrl}
        />

        <NextQueryParamProvider>
            <CollectionProvider {...{ collection, referer, host }}>
                <BatchSelectProvider
                    context={TokenBatchSelectContext}
                    getId={(t) => t.tokenId}
                >
                    <CollectionPageContent />
                </BatchSelectProvider>
            </CollectionProvider>
        </NextQueryParamProvider>
    </>
);

export async function getServerSideProps(context: NextPageContext) {
    const identifier = context.query?.id as string;

    if (identifier) {
        const collectionIdentifier = isUUID(identifier)
            ? { collectionId: identifier }
            : Web3.utils.isAddress(identifier)
            ? { smartContractAddress: identifier }
            : { customUrl: identifier };

        const sdk = GraphQLService.sdk();

        const [collectionReq, statsReq] = await Promise.allSettled([
            sdk.GetCollection(collectionIdentifier),
            sdk.GetCollectionStats(collectionIdentifier),
        ]);

        if (collectionReq.status === "fulfilled") {
            return {
                props: {
                    collection: {
                        ...collectionReq.value.collection,
                        stats:
                            statsReq.status === "fulfilled"
                                ? statsReq.value.stats
                                : null,
                    },
                    referer: context.req?.headers.referer ?? null,
                    host: context.req?.headers.host ?? null,
                },
            };
        }
    }

    return {
        redirect: {
            destination: "/",
        },
    };
}

export default Collection;
