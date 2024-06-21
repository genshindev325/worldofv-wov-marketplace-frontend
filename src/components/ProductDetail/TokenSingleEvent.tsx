import { useMediaQuery } from "@react-hook/media-query";
import moment from "moment";
import React from "react";
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
}

interface TokenSingleEventProps {
    event: Event;
}

const TokenSingleEvent: React.FC<TokenSingleEventProps> = ({ event }) => {
    const theme = useTheme();

    const breakpointA = useMediaQuery(`(max-width: ${theme.breakpoints.a})`);

    const { eventType } = useEventType(event);
    return (
        <>
            <Flex alignItems="center" height={breakpointA ? "105px" : "80px"}>
                <Flex
                    alignItems="center"
                    width={breakpointA ? "10%" : "25%"}
                    pl={3}
                >
                    {eventType.icon({ color: eventType.color })}
                    <Text
                        ml={3}
                        style={{ display: breakpointA ? "none" : "unset" }}
                    >
                        {eventType.text}
                    </Text>
                </Flex>
                <Box px={3} width={breakpointA ? "40%" : "25%"}>
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
                <Box pl={3} width={breakpointA ? "30%" : "25%"}>
                    <StyledText>
                        {event.price && formatPrice(event.price)}{" "}
                        {event.price &&
                            getPaymentFromContractAddress(event.payment)}
                    </StyledText>
                </Box>
                <Box pl={3} width={breakpointA ? "30%" : "25%"}>
                    <StyledText>{moment(event.dateTime).fromNow()}</StyledText>
                </Box>
            </Flex>
            <Divider />
        </>
    );
};

// TODO: go mobile first rather than the other way around
const StyledText = styled(Text)`
    ${({ theme }) => theme.typography.caption2}
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.a}) {
        ${({ theme }) => theme.typography.caption3}
    }
`;

export default TokenSingleEvent;
