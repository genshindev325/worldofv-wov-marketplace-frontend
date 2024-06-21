import { OfferAssetFieldsFragment } from "../generated/graphql";
import formatPrice from "../utils/formatPrice";
import getShortAddress from "../utils/getShortAddress";
import { OfferCurrency } from "./Currencies";

export type OfferStatus = "ACTIVE" | "CANCELED" | "ACCEPTED" | "EXPIRED";

export const OFFER_TYPES = [
    "EDITION",
    "TOKEN",
    "COLLECTION",
    "UNKNOWN",
] as const;

export type OfferType = (typeof OFFER_TYPES)[number];

interface OfferInitiator {
    address: string;
    name: string | null;
}

interface OfferCollection {
    collectionId: string;
    smartContractAddress: string;
    thumbnailImageUrl: string;
    name: string;
}

interface OfferToken {
    tokenId: string;
    smartContractAddress: string;
    name: string;
    rank?: number;
}

export interface OfferEdition {
    smartContractAddress: string;
    tokenId: string;
    tokenName: string;
    editionId: string;
    ownerAddress: string;
    price: string | null;
    stakingContractAddress?: string | null;
    auctionId: string | null;
    saleId: string | null;
    saleAddressVIP180: string | null;
    royalty: number;
    rank: number;
    asset: OfferAssetFieldsFragment;
}

export interface HighestOffer {
    price: string;
    addressVIP180: string;
}

export interface IOfferData {
    offerId: string;
    smartContractAddress: string;
    tokenId: string;
    editionId: string;
    addressVIP180: string;
    price: string;
    currency: OfferCurrency;
    startingTime: string;
    bidderAddress: string;
    endTime: string;
    status: OfferStatus;
    type: OfferType;
    highestOffer: HighestOffer;
    asset: OfferAssetFieldsFragment;
    bidder?: OfferInitiator;
    token: OfferToken | null;
    collection: OfferCollection | null;
    editions: OfferEdition[];
}

export interface OfferData extends IOfferData {}

export class OfferData {
    constructor(offer: IOfferData) {
        Object.assign(this, offer);
    }

    get bidderName() {
        return this.bidder?.name || getShortAddress(this.bidderAddress);
    }

    get formattedPrice() {
        return `${formatPrice(this.price)} ${this.currency}`;
    }

    get href() {
        if (this.token) {
            return `/token/${this.smartContractAddress}/${this.tokenId}`;
        } else {
            return `/collection/${this.collection!.collectionId}`;
        }
    }
}
