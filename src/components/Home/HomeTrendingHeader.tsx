import { Interval } from "@/generated/graphql";
import { useMemo } from "react";
import { Divider } from "../common/Divider";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
interface HomeTrendingHeaderProps {
    interval: Interval;
}

const HomeTrendingHeader: React.FC<HomeTrendingHeaderProps> = ({
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
        <>
            <Flex justifyContent={{ _: "space-between", f: "flex-start" }}>
                <Text
                    ml="2.5%"
                    width={{ _: "unset", f: "35.5%" }}
                    variant="bodyBold2"
                >
                    Collection
                </Text>

                <Flex
                    width={{ _: "35%", f: "28%" }}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text variant="bodyBold2" whiteSpace="nowrap">
                        {FormattedInterval} Volume
                    </Text>

                    <Text variant="bodyBold2" whiteSpace="nowrap">
                        (VET + WoV)
                    </Text>
                </Flex>

                <Text
                    display={{ _: "none", f: "inline" }}
                    variant="bodyBold2"
                    whiteSpace="nowrap"
                    width="7%"
                >
                    {FormattedInterval} %
                </Text>

                <Text
                    width="13%"
                    whiteSpace="nowrap"
                    display={{ _: "none", f: "inline" }}
                    variant="bodyBold2"
                    textAlign="center"
                >
                    {FormattedInterval} Sales #
                </Text>

                <Text
                    width="14%"
                    display={{ _: "none", f: "inline" }}
                    variant="bodyBold2"
                    textAlign="end"
                >
                    Floor
                </Text>
            </Flex>

            <Divider />
        </>
    );
};

export default HomeTrendingHeader;
