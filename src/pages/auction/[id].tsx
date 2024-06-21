import { NextPageContext } from "next";
import styled from "styled-components";
import { SWRConfig, unstable_serialize } from "swr";
import AuctionProvider from "../../components/Auction/AuctionProvider";
import AuctionWrapper from "../../components/Auction/AuctionWrapper";
import Head from "../../components/Head";
import { QueryGetAuctionHistory } from "../../graphql/get-auction-history.graphql";
import { QueryGetAuction } from "../../graphql/get-auction.graphql";
import { GraphQLService } from "../../services/GraphQLService";
import { TokenData } from "../../types/TokenData";
import { CustomNextPage } from "../_app";

const Auction: CustomNextPage<any> = ({ auction, history, fallback }) => {
    const tokenData = new TokenData({ tokenData: auction?.auction?.token });

    const asset =
        tokenData.assets == null
            ? null
            : tokenData.assets.find(
                  (asset) => asset.size === "ANIMATED_INSIDE_1024"
              ) ||
              tokenData.assets.find(
                  (asset) => asset.size === "ANIMATED_INSIDE_512"
              ) ||
              tokenData.assets[tokenData.assets.length - 1];

    return (
        <>
            <Head title={`${tokenData?.name} - Auction`} image={asset?.url} />

            <SWRConfig value={{ fallback }}>
                <AuctionProvider
                    initialAuctionData={auction}
                    initialHistoryData={history}
                >
                    <Container>
                        <AuctionWrapper />
                    </Container>
                </AuctionProvider>
            </SWRConfig>
        </>
    );
};

Auction.noFooter = true;

const Container = styled.div`
    min-height: calc(100vh - 80px - 64px - 64px);
    padding: 64px 0 64px;
`;

export async function getServerSideProps(context: NextPageContext) {
    const auctionId = context.query?.id as string;

    if (auctionId) {
        const sdk = GraphQLService.sdk();

        const resAuction = await sdk.GetAuction({
            auctionId,
            includeToken: true,
            includeSeller: true,
        });

        if (resAuction.auction) {
            const resHistory = await sdk.GetAuctionHistory({
                auctionId,
                bidsOnly: resAuction.auction.status !== "SETTLED",
            });

            return {
                props: {
                    auction: resAuction,
                    history: resHistory,
                    fallback: {
                        [unstable_serialize([QueryGetAuction, { auctionId }])]:
                            resAuction,
                        [unstable_serialize([
                            QueryGetAuctionHistory,
                            {
                                auctionId,
                                bidsOnly:
                                    resAuction.auction.status !== "SETTLED",
                            },
                        ])]: resHistory,
                    },
                },
            };
        }
    }

    return {
        props: {
            auction: undefined,
            fallback: {},
        },
    };
    // return { redirect: { destination: "/" } };
}

export default Auction;
