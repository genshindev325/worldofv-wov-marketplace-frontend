import { CardPlaceholder } from "@/components/cards/CardPlaceholder";
import useGraphQL from "@/hooks/useGraphQL";
import { useCallback } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { SortTokensByEnum, VerifiedStatusEnum } from "../../generated/graphql";
import { Card } from "../cards/CardV2";
import { Box } from "../common/Box";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import Link from "../Link";
import HomeSwiper from "./HomeSwiper";

export default function HomeEndingSoonAuctions() {
    const { sdk } = useGraphQL();

    const fetchTokensOnAuction = useCallback(async () => {
        const response = await sdk.GetTokens({
            sortBy: SortTokensByEnum.AuctionEndingSoon,
            filters: {
                verifiedLevel: VerifiedStatusEnum.VerifiedAndCurator,
                onAuctionOnly: true,
            },
            pagination: {
                page: 1,
                perPage: 6,
            },
        });

        return response.tokens?.items || [];
    }, [sdk]);

    const { data } = useSWR("ENDING_SOON_AUCTIONS", fetchTokensOnAuction, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
    });

    return (
        <HomeSwiper
            decorator={
                <Flex alignItems="center" ml="auto" mr={3}>
                    <Box display={{ _: "none", a: "block" }}>
                        <Link
                            href="/marketplace?category=all&creator=verified-and-curator&page=1&payment=ALL&query=&sort=auction-ending-soon&tokenType=all"
                            passHref
                        >
                            <Text variant="bodyBold2" color="primary" as="a">
                                See All Auctions
                            </Text>
                        </Link>
                    </Box>
                </Flex>
            }
            ItemComponent={StyledCard}
            PlaceholderComponent={CardPlaceholder}
            title="Auctions"
            items={data}
            swiperProps={{
                slidesPerView: 1,
                breakpoints: {
                    447: { slidesPerView: 2 },
                    767: { slidesPerView: 3 },
                    1023: { slidesPerView: 4 },
                    1339: { slidesPerView: 5 },
                    1600: { slidesPerView: 6 },
                },
            }}
        />
    );
}

const StyledCard = styled(Card)`
    box-shadow: 0px 4px 20px -6px rgba(15, 15, 15, 0.12);
`;
