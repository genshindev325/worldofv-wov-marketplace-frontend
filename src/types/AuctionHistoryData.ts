import BigNumber from "bignumber.js";
import { UserFragment } from "../generated/graphql";
import formatPrice from "../utils/formatPrice";
import { UserData } from "./UserData";

export enum AuctionHistoryEventEnum {
    NEW_AUCTION = "newAuction",
    NEW_BID = "newBid",
    TIME_UPDATE = "timeUpdate",
    AUCTION_EXECUTED = "auctionExecuted",
    CANCEL_AUCTION = "cancelAuctionEvent",
    AUCTION_ENDED = "auctionEnded",
}

export interface IAuctionHistoryData {
    id: number;
    event: AuctionHistoryEventEnum;
    timestamp: number | Date;
    txID: string;
    auctionId: number;
    smartContractAddress: string;
    tokenId: string;
    price?: string | BigNumber;
    user?: UserFragment;
    updatedDate?: number | Date;
}

export class AuctionHistoryData implements IAuctionHistoryData {
    id: number;
    event: AuctionHistoryEventEnum;
    timestamp: Date;
    txID: string;
    auctionId: number;
    smartContractAddress: string;
    tokenId: string;
    price?: BigNumber;
    user?: UserData;
    updatedDate?: Date;

    constructor(data?: IAuctionHistoryData) {
        if (!data) {
            throw new Error(
                "Cannot initialize AuctionHistoryData with undefined object"
            );
        }

        this.id = data.id;
        this.event = data.event;
        this.timestamp = new Date((data.timestamp as number) * 1000);
        this.txID = data.txID;
        this.auctionId = data.auctionId;
        this.smartContractAddress = data.smartContractAddress;
        this.tokenId = data.tokenId;

        this.price = data.price
            ? new BigNumber(data.price as string)
            : undefined;

        this.user = data.user?.address ? new UserData(data.user) : undefined;

        this.updatedDate = data.updatedDate
            ? new Date((data.updatedDate as number) * 1000)
            : undefined;
    }

    get formattedPrice(): string {
        return formatPrice(this.price);
    }

    get checkTransactionLink(): string {
        return `${process.env.NEXT_PUBLIC_EXPLORE_VECHAIN}/transactions/${this.txID}`;
    }
}
