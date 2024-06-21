import BigNumber from "bignumber.js";
import { TokenAttributesFragment, UserFragment } from "../generated/graphql";
import formatNumber from "../utils/formatNumber";
import formatPrice from "../utils/formatPrice";
import { IOfferData } from "./OfferData";
import { UserData } from "./UserData";

export interface ICollectionData {
    id: string;
    collectionId?: string;
    name: string;
    description?: string;
    visible: boolean;
    thumbnailImageUrl?: string;
    bannerImageUrl?: string;
    creator: UserFragment;
    customUrl?: string;
    mintPageUrl?: string;
    minimumOffer?: string | BigNumber;
    isVerified?: boolean;
    type: "USER_CREATED" | "PFP";
    stakingContractAddresses?: string;
}

export interface ICollectionTokensCount {
    allCount?: number;
    onSaleCount?: number;
}

export interface ICollectionStats {
    tokensCount?: number;
    ownersCount?: number;
    offersCount?: number;
    highestOffer?: string | BigNumber;
    floorPrices?: any;
    floorPrice?: string | BigNumber;
    floorPricePayment?: string;
}

type TCollectionProperties = { properties?: TokenAttributesFragment[] };

export class CollectionData
    implements
        ICollectionData,
        ICollectionTokensCount,
        ICollectionStats,
        TCollectionProperties
{
    id: string;
    collectionId?: string | undefined;
    name: string;
    description?: string | undefined;
    visible: boolean;
    thumbnailImageUrl?: string | undefined;
    bannerImageUrl?: string | undefined;
    creator: UserData;
    customUrl?: string;
    mintPageUrl?: string;
    minimumOffer?: string | BigNumber;
    isVerified?: boolean;
    isMinting?: boolean;
    type: "USER_CREATED" | "PFP";
    smartContractAddress?: string;
    stakingContractAddresses?: string;

    allCount?: number;
    onSaleCount?: number;

    tokensCount?: number;
    ownersCount?: number;
    offersCount?: number;
    highestOffer?: BigNumber;
    floorPrice?: BigNumber;
    floorPricePayment?: string;

    activeOffers?: IOfferData[];

    properties?: TokenAttributesFragment[];

    constructor(
        data?: ICollectionData,
        tokensCount?: ICollectionTokensCount,
        stats?: ICollectionStats,
        activeOffers?: IOfferData[],
        properties?: TokenAttributesFragment[]
    ) {
        if (!data) {
            throw new Error(
                "Cannot initialize CollectionData with undefined object"
            );
        }

        this.id = data.id;
        this.collectionId = data.collectionId;
        this.name = data.name;
        this.description = data.description;
        this.visible = data.visible;
        this.thumbnailImageUrl = data.thumbnailImageUrl || (data as any)?.image;
        this.bannerImageUrl = data.bannerImageUrl;
        this.creator = new UserData(data.creator);
        this.customUrl = data.customUrl;
        this.mintPageUrl = data.mintPageUrl;
        this.minimumOffer = data.minimumOffer;
        this.isVerified = data.isVerified;
        this.isMinting = (data as any).isMinting;
        this.type = data.type;
        this.stakingContractAddresses = data.stakingContractAddresses;

        if (tokensCount) {
            this.allCount = tokensCount.allCount;
            this.onSaleCount = tokensCount.onSaleCount;
        }

        if (stats) {
            this.tokensCount = stats.tokensCount;
            this.ownersCount = stats.ownersCount;
            this.offersCount = stats.offersCount;

            this.highestOffer = stats.highestOffer
                ? new BigNumber(stats.highestOffer)
                : undefined;

            this.floorPrice = stats.floorPrice
                ? new BigNumber(stats.floorPrice)
                : undefined;

            this.floorPricePayment = stats.floorPricePayment;
        }

        this.activeOffers = activeOffers;

        this.properties = properties;
    }

    get formattedHighestOffer() {
        return this.highestOffer
            ? formatNumber(formatPrice(this.highestOffer))
            : undefined;
    }

    get formattedFloorPrice() {
        return this.floorPrice
            ? formatNumber(formatPrice(this.floorPrice))
            : undefined;
    }
}
