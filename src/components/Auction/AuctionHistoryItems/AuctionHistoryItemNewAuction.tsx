import moment from "moment";
import React from "react";
import styled from "styled-components";
import variables from "../../../styles/_variables";
import Link from "../../Link";
import UserAvatar from "../../UserAvatar";
import { AuctionHistoryItemProps } from "../AuctionHistoryItem";

const {
    colors: { neutrals },
} = variables;

const AuctionHistoryItemNewAuction: React.FC<AuctionHistoryItemProps> = ({
    item,
    auction,
}) =>
    item.user ? (
        <>
            <Container>
                <Link href={`/profile/${item.user.profileIdentifier}`} passHref>
                    <a>
                        <Avatar
                            src={item.user.profileImage}
                            verified={item.user.verified}
                            verifiedLevel={item.user.verifiedLevel}
                        />
                    </a>
                </Link>

                <InfoWrapper>
                    <Text>
                        Auction created by{" "}
                        <Link
                            href={`/profile/${item.user.profileIdentifier}`}
                            passHref
                        >
                            <a>
                                <strong>{item.user.username}</strong>
                            </a>
                        </Link>{" "}
                        for{" "}
                        <Link href={item.checkTransactionLink} passHref>
                            <a target="_blank">
                                <strong>
                                    {item.formattedPrice} {auction.payment}
                                </strong>
                            </a>
                        </Link>
                    </Text>

                    <Time>{moment(item.timestamp).fromNow()}</Time>
                </InfoWrapper>
            </Container>
        </>
    ) : null;

const Container = styled.div`
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    color: inherit;
`;

const InfoWrapper = styled.div`
    flex-grow: 1;
`;

const Text = styled.div``;

const Time = styled.div`
    font-weight: 500;
    color: ${neutrals[4]};
`;

const Avatar = styled(UserAvatar).attrs(() => ({
    size: 48,
    verifiedSize: 16,
}))`
    margin-right: 16px;
`;

export default AuctionHistoryItemNewAuction;
