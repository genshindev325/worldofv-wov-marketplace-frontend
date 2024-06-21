import styled from "styled-components";
import variables from "../../styles/_variables";
import { useAuction } from "./AuctionProvider";

const {
    colors: { neutrals },
    typography: { bodyBold1, captionBold1, hairline2 },
} = variables;

const AuctionCurrentBid = () => {
    const { auction } = useAuction();

    return (
        <AuctionCurrentBidContainer>
            <AuctionCurrentBidLabel>
                {auction?.currentBid
                    ? auction.ended
                        ? "Winning Bid"
                        : "Highest Bid"
                    : "Reserve Price"}
            </AuctionCurrentBidLabel>

            <AuctionCurrentBidValue>
                <AuctionCurrentBidNumber>
                    {auction?.currentBid
                        ? auction?.formattedCurrentBid
                        : auction?.formattedReservePrice}
                </AuctionCurrentBidNumber>
                &nbsp;{auction?.payment}
            </AuctionCurrentBidValue>
        </AuctionCurrentBidContainer>
    );
};

const AuctionCurrentBidContainer = styled.div``;

const AuctionCurrentBidLabel = styled.div`
    ${hairline2};
    color: ${neutrals[5]};
    margin-bottom: 4px;
`;

const AuctionCurrentBidValue = styled.div`
    display: flex;
    align-items: flex-end;
    ${captionBold1};
`;

const AuctionCurrentBidNumber = styled.div`
    ${bodyBold1};
`;

export default AuctionCurrentBid;
