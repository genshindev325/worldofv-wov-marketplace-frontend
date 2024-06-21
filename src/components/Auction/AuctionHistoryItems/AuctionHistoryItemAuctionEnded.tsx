import moment from "moment";
import React from "react";
import styled from "styled-components";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";
import Link from "../../Link";
import UserAvatar from "../../UserAvatar";
import { AuctionHistoryItemProps } from "../AuctionHistoryItem";

const { dark } = mixins;
const {
    colors: { neutrals },
} = variables;

const AuctionHistoryItemAuctionEnded: React.FC<AuctionHistoryItemProps> = ({
    item,
    auction,
}) => (
    <Container>
        <InfoWrapper>
            {item?.user && (
                <Link href={`/profile/${item.user.profileIdentifier}`} passHref>
                    <a>
                        <Avatar
                            src={item.user.profileImage}
                            verified={item.user.verified}
                            verifiedLevel={item.user.verifiedLevel}
                        />
                    </a>
                </Link>
            )}

            {item?.user ? (
                <Text>
                    Auction won by{" "}
                    <strong>
                        <Link href={`/profile/${item.user.profileIdentifier}`}>
                            {item.user.username}
                        </Link>
                    </strong>
                </Text>
            ) : (
                <Text>
                    <strong>Auction ended</strong>
                </Text>
            )}

            {item?.user ? (
                <Text>
                    Sold for{" "}
                    <strong>
                        {auction.currentBid
                            ? auction.formattedCurrentBid
                            : auction.formattedReservePrice}{" "}
                        {auction.payment}
                    </strong>{" "}
                </Text>
            ) : (
                <Text>
                    The reserve price of{" "}
                    <strong>
                        {auction.formattedReservePrice} {auction.payment}
                    </strong>{" "}
                    hasn&apos;t been met
                </Text>
            )}

            <Time>{moment(item.timestamp).fromNow()}</Time>
        </InfoWrapper>
    </Container>
);

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px 0 32px;

    &::before,
    &::after {
        content: "";
        flex: 1 1;
        margin: auto;
        border-bottom: 1px solid ${neutrals[6]};

        ${dark`
            border-color: ${neutrals[3]};
        `}
    }

    &::before {
        padding-right: 32px;
    }

    &::after {
        padding-left: 32px;
    }
`;

const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
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
    margin-bottom: 8px;
`;

export default AuctionHistoryItemAuctionEnded;
