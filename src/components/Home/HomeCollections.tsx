import { CardPlaceholder } from "@/components/cards/CardPlaceholder";
import useGraphQL from "@/hooks/useGraphQL";
import useSWR from "swr";
import { Box } from "../common/Box";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import DropCollectionCard from "../DropCollectionCard";
import Link from "../Link";
import HomeSwiper from "./HomeSwiper";

export default function HomeCollections() {
    const { sdk } = useGraphQL();
    const { data } = useSWR("HOME_COLLECTIONS", () => sdk.GetHomeCollections());

    return (
        <HomeSwiper
            decorator={
                <Flex alignItems="center" ml="auto" mr={3}>
                    <Box display={{ _: "none", a: "block" }}>
                        <Link href="/collections" passHref>
                            <Text variant="bodyBold2" color="primary" as="a">
                                See All Collections
                            </Text>
                        </Link>
                    </Box>
                </Flex>
            }
            ItemComponent={DropCollectionCard}
            PlaceholderComponent={CardPlaceholder}
            items={data?.collections}
            title="Collections"
            swiperProps={{
                slidesPerView: 1,
                breakpoints: {
                    576: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1200: { slidesPerView: 3 },
                    1400: { slidesPerView: 3 },
                },
            }}
        />
    );
}
