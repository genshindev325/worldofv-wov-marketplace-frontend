import { Interval } from "@/generated/graphql";
import useGraphQL from "@/hooks/useGraphQL";
import { useMemo } from "react";
import useSWR from "swr";
import { Box } from "../common/Box";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import Link from "../Link";
import HomeTopBuyersHeader from "./HomeTopBuyersHeader";
import HomeTopBuyersTable from "./HomeTopBuyersTable";

const HomeTopBuyers = () => {
    const { sdk } = useGraphQL();

    const { data, isValidating } = useSWR(
        "HOME_BUYERS_STATS",
        () =>
            sdk.GetBuyersStats({
                pagination: { perPage: 10 },
                timeframe: Interval.H24,
            }),
        { revalidateOnFocus: false }
    );

    const buyersStats = useMemo(() => {
        const buyersStats = data?.getBuyersStats?.buyersStats;
        return buyersStats && buyersStats.length % 2 === 0
            ? buyersStats
            : buyersStats?.slice(0, -1);
    }, [data]);

    const buyersStatsFirstHalf = useMemo(
        () => buyersStats?.slice(0, buyersStats?.length / 2),
        [buyersStats]
    );
    const buyersStatsSecondHalf = useMemo(
        () => buyersStats?.slice(buyersStats?.length / 2),
        [buyersStats]
    );

    return (
        <Box>
            <Flex justifyContent="space-between" alignItems="last baseline">
                <Box>
                    <Text
                        as="h3"
                        variant="bodyBold1"
                        mb={1}
                        fontSize={{ _: 5, m: 6, d: 7 }}
                        style={{ position: "relative" }}
                        width="fit-content"
                    >
                        Top Buyers
                    </Text>
                    <Text variant="bodyBold1" color="neutral" mb={5}>
                        On World of V{" "}
                    </Text>
                </Box>
                <Link href="/top-buyers" passHref>
                    <Text as="a" color="primary" variant="bodyBold2">
                        See All
                    </Text>
                </Link>
            </Flex>
            <Box position="relative">
                <Flex
                    mb={4}
                    justifyContent={{ _: "center", f: "flex-end" }}
                ></Flex>
                {!isValidating && (
                    <Flex
                        justifyContent="space-between"
                        flexDirection={{ _: "column", w: "row" }}
                    >
                        <Box width={{ _: "100%", w: "49%" }}>
                            <HomeTopBuyersHeader interval={Interval.H24} />
                            {buyersStatsFirstHalf?.map((buyerStats, idx) => (
                                <HomeTopBuyersTable
                                    buyerStats={buyerStats}
                                    key={idx}
                                    idx={idx}
                                />
                            ))}
                        </Box>

                        <Box width={{ _: "100%", w: "49%" }}>
                            <Box display={{ _: "none", w: "block" }}>
                                <HomeTopBuyersHeader interval={Interval.H24} />
                            </Box>
                            {buyersStatsSecondHalf?.map((buyerStats, idx) => (
                                <HomeTopBuyersTable
                                    buyerStats={buyerStats}
                                    key={idx}
                                    idx={idx + buyersStatsSecondHalf.length}
                                />
                            ))}
                        </Box>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

export default HomeTopBuyers;
