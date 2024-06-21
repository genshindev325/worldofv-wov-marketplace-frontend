import BigNumber from "bignumber.js";
import moment from "moment";
import { UserFragment } from "../generated/graphql";
import formatPrice from "../utils/formatPrice";
import { getPaymentFromContractAddress } from "../utils/getPaymentFromContractAddress";
import { AuctionHistoryData, IAuctionHistoryData } from "./AuctionHistoryData";
import { AuctionCurrency } from "./Currencies";
import { ITokenData, TokenData } from "./TokenData";
import { UserData } from "./UserData";

export interface IAuctionData {
    id: number;
    smartContractAddress: string;
    tokenId: string;
    editionId: string;
    sellerAddress: string;
    bidderAddress?: string;
    settlorAddress?: null;
    reservePrice?: string | bigint | BigNumber;
    currentBid?: string | bigint | BigNumber;
    bidFixedIncrement?: string;
    bidPercentageIncrement?: number;
    startDate: Date;
    endDate: Date;
    updatedEndDate?: Date;
    settled: boolean;
    ended: boolean;
    cancelled: boolean;
    addressVIP180?: string;
    createdAt: number;
    updatedAt?: number;
    payment: AuctionCurrency;
    seller?: UserFragment;
    bidder?: UserFragment;
    settlor?: UserFragment;
    token?: ITokenData;
}

export class AuctionData implements IAuctionData {
    id: number;
    smartContractAddress: string;
    tokenId: string;
    editionId: string;
    sellerAddress: string;
    bidderAddress?: string;
    settlorAddress?: null;
    reservePrice?: BigNumber;
    currentBid?: BigNumber;
    bidFixedIncrement?: string;
    bidPercentageIncrement?: number;
    startDate: Date;
    endDate: Date;
    updatedEndDate?: Date;
    settled: boolean;
    ended: boolean;
    cancelled: boolean;
    addressVIP180?: string;
    createdAt: number;
    updatedAt?: number;
    payment: AuctionCurrency;
    seller?: UserData;
    bidder?: UserData;
    settlor?: UserData;
    token?: TokenData;
    history?: AuctionHistoryData[];

    constructor(data?: IAuctionData | any, history?: IAuctionHistoryData[]) {
        if (!data) {
            throw new Error(
                "Cannot initialize AuctionData with undefined object"
            );
        }

        this.id = data.id || data.auctionId;
        this.tokenId = data.tokenId;
        this.editionId = data.editionId;
        this.smartContractAddress = data.smartContractAddress;

        this.sellerAddress = data.sellerAddress;
        this.bidderAddress = data.bidderAddress;
        this.settlorAddress = data.settlorAddress;

        this.reservePrice = data.reservePrice
            ? new BigNumber(data.reservePrice as string)
            : undefined;

        this.currentBid = data.highestBid
            ? new BigNumber(data.highestBid)
            : undefined;

        this.bidFixedIncrement = data.bidFixedIncrement;
        this.bidPercentageIncrement = data.bidPercentageIncrement || 10;

        this.startDate = new Date(data.startDate || data.startingTime);
        this.endDate = new Date(data.endDate || data.endTime);
        this.updatedEndDate = data.updatedEndDate
            ? new Date(data.updatedEndDate)
            : undefined;

        this.settled = data.settled || data.status === "SETTLED";

        this.ended =
            data.ended ||
            data.status === "SETTLED" ||
            data.status === "CANCELLED" ||
            data.status === "TO_SETTLE";

        this.cancelled = data.cancelled || data.status === "CANCELLED";

        this.payment = data.payment
            ? data.payment
            : getPaymentFromContractAddress(data.addressVIP180);

        this.addressVIP180 = data.addressVIP180;

        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        this.seller = data.seller ? new UserData(data.seller) : undefined;

        this.bidder = data.bidder
            ? new UserData(data.bidder)
            : data.highestBidderAddress
            ? new UserData({ address: data.highestBidderAddress })
            : undefined;

        this.settlor = data.settlor ? new UserData(data.settlor) : undefined;

        this.token = data.token
            ? new TokenData({ tokenData: data.token })
            : undefined;

        this.history = history?.length
            ? history.map((el) => new AuctionHistoryData(el))?.reverse()
            : undefined;
    }

    get minimumBid() {
        if (!this.currentBid) {
            return this.reservePrice;
        }

        if (this.bidFixedIncrement) {
            return this.currentBid.plus(this.bidFixedIncrement);
        }

        if (this.bidPercentageIncrement) {
            const percentageToDecimal = 1 + this.bidPercentageIncrement / 100;
            return this.currentBid.multipliedBy(percentageToDecimal);
        }

        return this.currentBid.plus(10 ** 18);
    }

    get formattedReservePrice(): string {
        return formatPrice(this.reservePrice);
    }

    get formattedCurrentBid(): string {
        return formatPrice(this.currentBid);
    }

    get formattedMinimumBid(): string {
        return formatPrice(this.minimumBid);
    }

    get endingPhaseDate(): Date {
        return moment(this.updatedEndDate || this.endDate)
            .subtract(10, "minutes")
            .toDate();
    }
}
