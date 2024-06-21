import { CollectionType, Interval } from "@/generated/graphql";
import useGraphQL from "@/hooks/useGraphQL";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { Box } from "../common/Box";
import { Button } from "../common/Button";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import FlatLoader from "../FlatLoader";
import TrendingCollectionsHeader from "./TrendingCollectionsHeader";
import TrendingCollectionsTable from "./TrendingCollectionsTable";

const TrendingCollectionsContent = () => {
    const [interval, setInterval] = useState(Interval.H24);
    const { sdk } = useGraphQL();

    const { data, isValidating, mutate } = useSWR(
        "COLLECTIONS_STATS",
        () =>
            sdk.GetCollectionsStats({
                pagination: { perPage: 50 },
                timeframe: interval,
            }),
        { revalidateOnFocus: false }
    );

    useEffect(() => {
        mutate();
    }, [interval, mutate]);

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

    const intervals = [
        { interval: Interval.H24, text: "24h" },
        { interval: Interval.D7, text: "7d" },
        { interval: Interval.D30, text: "30d" },
    ];

    return (
        <Box mx={5}>
            <Text
                as="h2"
                variant="bodyBold1"
                textAlign="center"
                mt={6}
                fontSize={40}
            >
                Trending
            </Text>
            <Text variant="body1" color="accent" textAlign="center" mt={2}>
                Top performing collections on VeChain{" "}
            </Text>

            <Box mt={6} position="relative">
                <Flex mb={4} justifyContent={{ _: "center", f: "flex-end" }}>
                    {intervals.map((elem) => (
                        <StyledButton
                            key={elem.interval}
                            onClick={() => setInterval(elem.interval)}
                            outline={interval === elem.interval ? false : true}
                        >
                            {elem.text}
                        </StyledButton>
                    ))}
                </Flex>
                {isValidating ? (
                    <FlatLoader
                        size={150}
                        style={{
                            position: "absolute",
                            width: "20%",
                            top: "150px",
                            margin: "auto",
                            left: 0,
                            right: 0,
                        }}
                    />
                ) : (
                    <>
                        <TrendingCollectionsHeader interval={interval} />
                        {collectionsStats?.map((collectionStats, idx) => (
                            <TrendingCollectionsTable
                                collectionStats={collectionStats}
                                idx={idx}
                                key={idx}
                            />
                        ))}
                    </>
                )}
            </Box>
        </Box>
    );
};

const StyledButton = styled(Button)`
    border-radius: 0 !important;
    :first-child {
        border-radius: 15px 0 0 15px !important;
    }
    :last-child {
        border-radius: 0 15px 15px 0 !important;
    }
`;

export default TrendingCollectionsContent;
