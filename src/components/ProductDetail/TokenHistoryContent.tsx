import { useMediaQuery } from "@react-hook/media-query";
import styled, { useTheme } from "styled-components";
import { Divider } from "../common/Divider";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import FlatLoader from "../FlatLoader";
import { useItem } from "./ProductDetailProvider";
import TokenSingleEvent from "./TokenSingleEvent";

const TokenHistoryContent = () => {
    const { events } = useItem();
    const theme = useTheme();

    const breakPoint = useMediaQuery(`(min-width: ${theme.breakpoints.a})`);
    const textProps = {
        width: "25%",
        ml: 3,
        color: "neutral" as "neutral",
        variant: "hairline2" as "hairline2",
    };

    return (
        <>
            <Flex flexDirection="column">
                {breakPoint && (
                    <Flex py={2}>
                        <Text {...textProps}>Event</Text>
                        <Text {...textProps} textAlign="center" ml={0}>
                            From/To
                        </Text>
                        <Text {...textProps}>Price</Text>
                        <Text {...textProps}>Time</Text>
                    </Flex>
                )}
                <Divider />
                {events?.data?.map((event: any, idx: number) => (
                    <TokenSingleEvent
                        key={`${event.dateTime}_${idx}`}
                        event={event}
                    />
                ))}
            </Flex>
            {events.meta.isValidating && (
                <LoadMore>
                    <FlatLoader size={24} />
                </LoadMore>
            )}
            {events.meta.hasMore && (
                <LoadMore
                    onClick={() => events.meta.setPage(events.meta.page + 1)}
                >
                    Load More
                </LoadMore>
            )}
        </>
    );
};

const LoadMore = styled.div`
    cursor: pointer;
    text-align: center;
    background: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.muted};
    border-radius: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    width: 235px;
    margin: 20px auto;
`;

export default TokenHistoryContent;
