import { Interval } from "@/generated/graphql";
import { useMemo } from "react";
import { Box } from "../common/Box";
import { Divider } from "../common/Divider";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";

interface TopBuyersHeaderProps {
    interval: Interval;
}

const TopBuyersHeader: React.FC<TopBuyersHeaderProps> = ({ interval }) => {
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
                justifyContent={{ _: "space-between", f: "flex-start" }}
                alignItems="center"
                height={60}
            >
                <Text
                    ml="2.5%"
                    width="22.5%"
                    variant="captionBold2"
                    fontWeight={900}
                >
                    User
                </Text>
                <Flex
                    width={{ _: "30%", p: "30%", f: "24%" }}
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
                    display={{ _: "none", f: "inline" }}
                    variant="captionBold2"
                    fontWeight={900}
                    whiteSpace="nowrap"
                    width="6%"
                >
                    {FormattedInterval} %
                </Text>
                <Text
                    width="8%"
                    whiteSpace="nowrap"
                    display={{ _: "none", p: "inline" }}
                    variant="captionBold2"
                    fontWeight={900}
                    textAlign="center"
                >
                    {FormattedInterval} #
                </Text>
                <Text
                    width="25%"
                    display={{ _: "none", f: "inline" }}
                    variant="captionBold2"
                    fontWeight={900}
                    textAlign="center"
                >
                    Tot Volume
                </Text>
                <Text
                    width="6%"
                    whiteSpace="nowrap"
                    display={{ _: "none", f: "inline" }}
                    variant="captionBold2"
                    fontWeight={900}
                    textAlign="center"
                >
                    Tot #
                </Text>
            </Flex>
            <Divider />
        </Box>
    );
};

export default TopBuyersHeader;
