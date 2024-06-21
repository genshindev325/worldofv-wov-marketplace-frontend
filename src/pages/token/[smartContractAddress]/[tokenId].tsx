import { NextPageContext } from "next";
import styled from "styled-components";
import { SWRConfig, unstable_serialize } from "swr";
import Head from "../../../components/Head";
import ProductDetail from "../../../components/ProductDetail/ProductDetail";
import ProductDetailContent from "../../../components/ProductDetail/ProductDetailContent";
import ProductDetailProvider from "../../../components/ProductDetail/ProductDetailProvider";
import TokenHistory from "../../../components/ProductDetail/TokenHistory";
import { QueryGetCollection } from "../../../graphql/get-collection.graphql";
import { QueryGetEditions } from "../../../graphql/get-editions.graphql";
import { QueryGetToken } from "../../../graphql/get-token.graphql";
import {
    BatchSelectProvider,
    OfferBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import { GraphQLService } from "../../../services/GraphQLService";
import common from "../../../styles/_common";
import mixins from "../../../styles/_mixins";
import { IEditionData } from "../../../types/EditionData";
import { OfferData } from "../../../types/OfferData";
import { TokenData } from "../../../types/TokenData";
import { CustomNextPage } from "../../_app";

const { media } = mixins;
const { container } = common;

interface DetailsPageProps {
    initialEdition: string;
    token: any;
    collectionStats?: any;
    editions: IEditionData[];
    fallback: any;
}

const Details: CustomNextPage<DetailsPageProps> = ({
    initialEdition,
    token,
    collectionStats,
    editions,
    fallback,
}) => {
    const tokenData = new TokenData({ tokenData: token.token });

    const asset =
        tokenData.assets.find(
            (asset) => asset.size === "ANIMATED_INSIDE_1024"
        ) ||
        tokenData.assets.find(
            (asset) => asset.size === "ANIMATED_INSIDE_512"
        ) ||
        tokenData.assets[tokenData.assets.length - 1];

    return (
        <>
            <Head
                title={tokenData.name}
                description={tokenData.description}
                image={
                    asset.mimeType.startsWith("video") ? undefined : asset.url
                }
            />

            <SWRConfig value={{ fallback }}>
                <ProductDetailProvider
                    initialTokenData={token}
                    initialEditionsData={editions}
                    initialEdition={initialEdition}
                    collectionStats={collectionStats}
                >
                    <BatchSelectProvider
                        context={OfferBatchSelectContext}
                        getId={(o: OfferData) => o.offerId}
                    >
                        <Container>
                            <InnerContainer>
                                <ProductDetail />
                                <ProductDetailContent />
                            </InnerContainer>
                            <TokenHistory />
                        </Container>
                    </BatchSelectProvider>
                </ProductDetailProvider>
            </SWRConfig>
        </>
    );
};

Details.noFooter = true;

const Container = styled.div`
    min-height: calc(100vh - 80px - 64px - 64px);
    padding-top: 64px;
    ${media.s`
        padding-top: 24px;
    `}
`;

const InnerContainer = styled.div`
    ${container};
    display: flex;
    height: 100%;
    min-height: inherit;

    ${media.t`
        display: block;
    `}
`;

export async function getServerSideProps(context: NextPageContext) {
    const smartContractAddress = context.query.smartContractAddress as string;
    let tokenId = context.query?.tokenId as string;

    if (tokenId != "undefined") {
        const editionNumber = parseInt(tokenId.slice(-5));
        const initialEdition = editionNumber ? tokenId : null;

        if (
            smartContractAddress ===
            process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS
        ) {
            tokenId = tokenId.replace(/.{5}$/, "00000");
        }

        const findTokenParams = {
            tokenId,
            smartContractAddress,
        };

        const findCollectionParams = {
            smartContractAddress,
        };

        const [tokenRes, editionRes, collectionRes] =
            await GraphQLService.client().batchRequests([
                { document: QueryGetToken, variables: findTokenParams },
                { document: QueryGetEditions, variables: findTokenParams },
                {
                    document: QueryGetCollection,
                    variables: findCollectionParams,
                },
            ]);

        const collectionStatsRes =
            collectionRes.data.collection !== null &&
            collectionRes.data.collection.type === "EXTERNAL"
                ? await GraphQLService.sdk().GetCollectionStats({
                      smartContractAddress: smartContractAddress,
                  })
                : null;

        return {
            props: {
                initialEdition,
                token: tokenRes?.data,
                collectionStats: collectionStatsRes?.stats || {},
                editions: editionRes?.data,
                fallback: {
                    [unstable_serialize([QueryGetToken, findTokenParams])]:
                        tokenRes,
                    [unstable_serialize([QueryGetEditions, findTokenParams])]:
                        editionRes,
                },
            },
        };
    }

    return {
        redirect: {
            destination: "/",
        },
    };
}

export default Details;
