import useGraphQL from "@/hooks/useGraphQL";
import { useMemo } from "react";
import useSWR from "swr";
import { CollectionType, Interval } from "../../generated/graphql";
import { Box } from "../common/Box";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import Link from "../Link";
import HomeCollectionStat from "./HomeCollectionStat";
import HomeTrendingHeader from "./HomeTrendingHeader";

const HomeTrendingCollections = () => {
    const { sdk } = useGraphQL();
    const { data } = useSWR("HOMEPAGE_COLLECTIONS_STATS", () =>
        sdk.GetCollectionsStats({
            pagination: {
                perPage: 10,
            },
            timeframe: Interval.H24,
        })
    );
    const collectionsStats = useMemo(() => {
        const stats = data?.getCollectionsStats?.collectionStats;

        const woviesStat = stats?.find(
            (collection) =>
                collection.smartContactAddress ===
                "0x5e6265680087520dc022d75f4c45f9ccd712ba97"
        );

        // Art NFTs do not have a database entry so we set the metadata manually.
        if (woviesStat) {
            woviesStat.name = "ART NFTs";
            woviesStat.collection = {
                name: "ART NFTs",
                collectionId: "",
                isStakingActive: false,
                type: CollectionType.External,
                isVerified: true,
                thumbnailImageUrl: "img/ART_PFP.png",
            };
        }

        return stats;
    }, [data]);

    const collectionsStatsFirstHalf = useMemo(
        () => collectionsStats?.slice(0, collectionsStats?.length / 2),
        [collectionsStats]
    );
    const collectionStatsSecondHalf = useMemo(
        () => collectionsStats?.slice(collectionsStats?.length / 2),
        [collectionsStats]
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
                        Trending Collections
                    </Text>
                    <Text variant="bodyBold1" color="neutral" mb={5}>
                        On VeChain
                    </Text>
                </Box>
                <Link href="/trending-collections" passHref>
                    <Text as="a" color="primary" variant="bodyBold2">
                        See All
                    </Text>
                </Link>
            </Flex>

            <Flex
                justifyContent="space-between"
                flexDirection={{ _: "column", w: "row" }}
            >
                <Box width={{ _: "100%", w: "49%" }}>
                    <HomeTrendingHeader interval={Interval.H24} />
                    {collectionsStatsFirstHalf?.map((collectionStats, idx) => (
                        <HomeCollectionStat
                            collectionStats={collectionStats}
                            idx={idx}
                            key={idx}
                        />
                    ))}
                </Box>
                <Box width={{ _: "100%", w: "49%" }}>
                    <Box display={{ _: "none", w: "block" }}>
                        <HomeTrendingHeader interval={Interval.H24} />
                    </Box>
                    {collectionStatsSecondHalf?.map((collectionStats, idx) => (
                        <HomeCollectionStat
                            collectionStats={collectionStats}
                            idx={idx + 5}
                            key={idx}
                        />
                    ))}
                </Box>
            </Flex>
        </Box>
    );
};

export default HomeTrendingCollections;
