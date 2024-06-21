import React from "react";
import { AuctionData } from "../../types/AuctionData";
import {
    AuctionHistoryData,
    AuctionHistoryEventEnum,
} from "../../types/AuctionHistoryData";
import AuctionHistoryItemAuctionCancelled from "./AuctionHistoryItems/AuctionHistoryItemAuctionCancelled";
import AuctionHistoryItemAuctionEnded from "./AuctionHistoryItems/AuctionHistoryItemAuctionEnded";
import AuctionHistoryItemAuctionExecuted from "./AuctionHistoryItems/AuctionHistoryItemAuctionExecuted";
import AuctionHistoryItemNewAuction from "./AuctionHistoryItems/AuctionHistoryItemNewAuction";
import AuctionHistoryItemNewBid from "./AuctionHistoryItems/AuctionHistoryItemNewBid";

export interface AuctionHistoryItemProps {
    auction: AuctionData;
    item: AuctionHistoryData;
}

const AuctionHistoryItem: React.FC<AuctionHistoryItemProps> = ({
    item,
    auction,
}) => {
    const renderItem = () => {
        switch (item.event) {
            case AuctionHistoryEventEnum.NEW_AUCTION:
                return <AuctionHistoryItemNewAuction {...{ auction, item }} />;
            case AuctionHistoryEventEnum.NEW_BID:
                return <AuctionHistoryItemNewBid {...{ auction, item }} />;
            case AuctionHistoryEventEnum.AUCTION_EXECUTED:
                return (
                    <AuctionHistoryItemAuctionExecuted {...{ auction, item }} />
                );
            case AuctionHistoryEventEnum.CANCEL_AUCTION:
                return (
                    <AuctionHistoryItemAuctionCancelled
                        {...{ auction, item }}
                    />
                );
            case AuctionHistoryEventEnum.AUCTION_ENDED:
                return (
                    <AuctionHistoryItemAuctionEnded {...{ auction, item }} />
                );
            default:
                return null;
        }
    };

    return renderItem();
};

export default AuctionHistoryItem;
