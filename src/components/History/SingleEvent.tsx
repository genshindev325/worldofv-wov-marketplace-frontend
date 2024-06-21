import { useMediaQuery } from "@react-hook/media-query";
import moment from "moment";
import React from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import styled, { useTheme } from "styled-components";
import useEventType from "../../hooks/useEventType";
import formatPrice from "../../utils/formatPrice";
import { formatUsername } from "../../utils/formatUsername";
import { getPaymentFromContractAddress } from "../../utils/getPaymentFromContractAddress";
import getShortAddress from "../../utils/getShortAddress";
import { Box } from "../common/Box";
import { Divider } from "../common/Divider";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import { TokenAsset } from "../common/TokenAsset";
import Link from "../Link";

export interface Event {
    event: string;
    dateTime: string;
    smartContractAddress: string;
    tokenId: string;
    editionId: string;
    price?: string;
    payment?: string;
    fromAddress: string;
    fromUser: any;
    toUser: any;
    toAddress?: string;
    token?: any; //TODO pass proper interface
    asset?: any; //TODO pass proper interface
    collection?: any; //TODO pass proper interface
    address: string;
}

interface SingleEventProps {
    event: Event;
}

const SingleEvent: React.FC<SingleEventProps> = ({ event }) => {
    const theme = useTheme();

    const [isOpen, setIsOpen] = React.useState(false);
    const [showMore, setShowMore] = React.useState(false);

    React.useEffect(() => {
        if (event.price || (event.fromAddress && event.toAddress)) {
            setShowMore(true);
        }
    }, []);

    const breakpointA = useMediaQuery(`(max-width: ${theme.breakpoints.a})`);
    const breakpointS = useMediaQuery(`(max-width: ${theme.breakpoints.s})`);

    const { eventType } = useEventType(event);
    return (
        <>
            <Flex
                alignItems="center"
                height={{ _: "105px", a: "80px" }}
                position="relative"
            >
                <Flex alignItems="center" width={{ _: "10%", a: "16%" }} pl={3}>
                    {eventType.icon({ color: eventType.color })}
                    <Text
                        ml={3}
                        style={{ display: breakpointA ? "none" : "unset" }}
                    >
                        {eventType.text}
                    </Text>
                </Flex>
                <Link
                    href={
                        event.editionId
                            ? `/token/${event.smartContractAddress}/${event.editionId}`
                            : `/collection/${
                                  event.collection?.customUrl ??
                                  event.smartContractAddress
                              }`
                    }
                    passHref
                >
                    <StyledFlex
                        pl={2}
                        alignItems="center"
                        width={{ _: "60%", a: "31%" }}
                        rowGap={3}
                    >
                        <TokenAsset asset={event.asset} />
                        <StyledFlex flexDirection="column">
                            <Text
                                variant={breakpointS ? "caption3" : "caption1"}
                            >
                                {event.token?.name ?? event.collection?.name}
                            </Text>
                            <Text variant="caption3" fontSize={{ _: 0, a: 1 }}>
                                {!!event.token?.rank &&
                                    `Rank: #${event.token?.rank}`}
                                {event.event === "BURN" &&
                                    `Edition: #${event.editionId}`}
                            </Text>
                        </StyledFlex>
                    </StyledFlex>
                </Link>
                <Box px={3} width="16%" display={{ _: "none", a: "unset" }}>
                    {event.fromAddress && (
                        <StyledText textAlign="center">
                            <Link
                                href={`/profile/${event.fromAddress}`}
                                passHref
                            >
                                {(event.fromUser &&
                                    formatUsername(event.fromUser.name)) ??
                                    getShortAddress(event.fromAddress)}
                            </Link>
                        </StyledText>
                    )}
                    {event.toAddress && (
                        <StyledText textAlign="center">
                            {event.fromAddress && (
                                <StyledText textAlign="center">⬇</StyledText>
                            )}
                            <Link href={`/profile/${event.toAddress}`} passHref>
                                {(event.toUser &&
                                    formatUsername(event.toUser.name)) ??
                                    getShortAddress(event.toAddress)}
                            </Link>
                        </StyledText>
                    )}
                </Box>
                <Text
                    ml={2}
                    variant="caption2"
                    width="25%"
                    style={{ display: breakpointA ? "none" : "unset" }}
                >
                    {event.price && formatPrice(event.price)}{" "}
                    {event.price &&
                        getPaymentFromContractAddress(event.payment)}
                </Text>
                <Text variant={breakpointS ? "caption3" : "caption2"} ml={2}>
                    {moment(event.dateTime).fromNow()}
                </Text>
                {showMore && (
                    <Flex
                        style={{
                            position: "absolute",
                            display: breakpointA ? "flex" : "none",
                            bottom: "2px",
                            right: "46%",
                        }}
                        alignItems="center"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {!isOpen ? (
                            <>
                                <Text variant="caption3" mr={2}>
                                    More
                                </Text>
                                <BsChevronDown />
                            </>
                        ) : (
                            <>
                                <Text variant="caption3" mr={2}>
                                    Less
                                </Text>
                                <BsChevronUp />
                            </>
                        )}
                    </Flex>
                )}
            </Flex>

            {isOpen && (
                <Flex justifyContent="space-around" alignItems="center" py={2}>
                    {event.fromAddress && event.toAddress && (
                        <Flex flexDirection="column">
                            <Text variant="caption2" textAlign="center">
                                From/To:
                            </Text>
                            <Flex
                                px={3}
                                justifyContent="center"
                                alignItems="center"
                            >
                                {event.fromAddress && (
                                    <StyledText textAlign="center">
                                        <Link
                                            href={`/profile/${event.fromAddress}`}
                                            passHref
                                        >
                                            {(event.fromUser &&
                                                formatUsername(
                                                    event.fromUser.name
                                                )) ??
                                                getShortAddress(
                                                    event.fromAddress
                                                )}
                                        </Link>
                                    </StyledText>
                                )}

                                <Text
                                    variant="bodyBold1"
                                    textAlign="center"
                                    mx={2}
                                >
                                    ⭢
                                </Text>
                                <StyledText textAlign="center">
                                    <Link
                                        href={`/profile/${event.toAddress}`}
                                        passHref
                                    >
                                        {(event.toUser &&
                                            formatUsername(
                                                event.toUser.name
                                            )) ??
                                            getShortAddress(event.toAddress)}
                                    </Link>
                                </StyledText>
                            </Flex>
                        </Flex>
                    )}
                    {event.price && (
                        <Box>
                            <Text variant="caption2" textAlign="center">
                                Value:
                            </Text>
                            <Text variant="caption2">
                                {formatPrice(event.price)}{" "}
                                {getPaymentFromContractAddress(event.payment)}
                            </Text>
                        </Box>
                    )}
                </Flex>
            )}
            <Divider />
        </>
    );
};

const StyledFlex = styled(Flex)`
    cursor: pointer;
    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const StyledText = styled(Text)`
    ${({ theme }) => theme.typography.caption2}
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.a}) {
        ${({ theme }) => theme.typography.caption3}
    }
`;

export default SingleEvent;
