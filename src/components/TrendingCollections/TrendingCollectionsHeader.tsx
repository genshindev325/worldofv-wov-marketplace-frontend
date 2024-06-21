import { Interval } from "@/generated/graphql";
import { useMemo } from "react";
import { Box } from "../common/Box";
import { Divider } from "../common/Divider";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";

interface TrendingCollectionsHeaderProps {
    interval: Interval;
}

const TrendingCollectionsHeader: React.FC<TrendingCollectionsHeaderProps> = ({
    interval,
}) => {
    const FormattedInterval = useMemo(
        () =>
            interval !== Interval.All
                ? interval?.slice(1) + interval?.slice(0, 1).toLowerCase()
                : "Total",
        [interval]
    );
    return (
        <Box position="sticky" backgroundColor="background" top={82} zIndex={1}>
            <Flex
                justifyContent={{ _: "space-between", d: "flex-start" }}
                alignItems="center"
                height={60}
            >
                <Text
                    ml="2.5%"
                    width={{ _: "unset", d: "17.5%" }}
                    variant="captionBold2"
                    fontWeight={900}
                >
                    Collection
                </Text>
                <Flex
                    width={{ _: "20%", d: "16%" }}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text
                        variant="captionBold2"
                        fontWeight={900}
                        whiteSpace="nowrap"
                    >
                        {FormattedInterval} Volume
                    </Text>
                    <Text
                        variant="captionBold2"
                        fontWeight={900}
                        whiteSpace="nowrap"
                    >
                        (VET + WoV)
                    </Text>
                </Flex>
                <Text
                    display={{ _: "none", d: "inline" }}
                    variant="captionBold2"
                    fontWeight={900}
                    whiteSpace="nowrap"
                    width="4%"
                >
                    {FormattedInterval} %
                </Text>
                <Text
                    width="8%"
                    whiteSpace="nowrap"
                    display={{ _: "none", d: "inline" }}
                    variant="captionBold2"
                    fontWeight={900}
                    textAlign="center"
                >
                    {FormattedInterval} Sales #
                </Text>

                <Text
                    width="10%"
                    whiteSpace="nowrap"
                    display={{ _: "none", d: "inline" }}
                    variant="captionBold2"
                    fontWeight={900}
                    textAlign="center"
                >
                    Floor
                </Text>
                <Text
                    width="10%"
                    whiteSpace="nowrap"
                    display={{ _: "none", d: "inline" }}
                    variant="captionBold2"
                    fontWeight={900}
                    textAlign="center"
                >
                    Avg Price
                </Text>
                <Text
                    width="10%"
                    whiteSpace="nowrap"
                    display={{ _: "none", d: "inline" }}
                    variant="captionBold2"
                    fontWeight={900}
                    textAlign="center"
                >
                    Owners
                </Text>
                <Text
                    width="6%"
                    whiteSpace="nowrap"
                    display={{ _: "none", d: "inline" }}
                    variant="captionBold2"
                    fontWeight={900}
                    textAlign="center"
                >
                    Tot Sales #
                </Text>
                <Text
                    width="20%"
                    display={{ _: "none", d: "inline" }}
                    variant="captionBold2"
                    fontWeight={900}
                    textAlign="center"
                >
                    Tot Volume
                </Text>
            </Flex>
            <Divider />
        </Box>
    );
};

export default TrendingCollectionsHeader;
