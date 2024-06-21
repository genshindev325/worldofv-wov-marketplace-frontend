import picasso from "@vechain/picasso";
import {
    AssetFragment,
    ProfileTabs,
    UserFragment,
    VerifiedStatus,
} from "../generated/graphql";
import getShortAddress from "../utils/getShortAddress";
import { IOfferData } from "./OfferData";

export enum UserLandingTabEnum {
    Created = "CREATED",
    OnSale = "ON_SALE",
    OnAuction = "ON_AUCTION",
    Collected = "COLLECTED",
    Collections = "COLLECTIONS",
    Offers = "OFFERS",
    Staked = "STAKED",
    Activity = "ACTIVITY",
}

export interface IUserTokensCount {
    createdCount?: number;
    collectedCount?: number;
    onSaleCount?: number;
    collectionCount?: number;
    offersCount?: number;
}

export class UserData implements UserFragment, IUserTokensCount {
    address: string;
    profileId: number;
    name: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    description?: string | undefined;
    coverImage?: string | undefined;
    customUrl?: string | undefined;
    websiteUrl?: string | undefined;
    facebookUrl?: string | undefined;
    twitterUrl?: string | undefined;
    discordUrl?: string | undefined;
    instagramUrl?: string | undefined;
    verified: boolean;
    verifiedLevel: VerifiedStatus;
    blacklisted: boolean;

    email?: string;
    showEmail?: boolean;
    isAdmin?: boolean;
    isEmailNotificationEnabled?: boolean;
    landingTab?: ProfileTabs | undefined;

    showBalance?: boolean;

    createdCount?: number;
    collectedCount?: number;
    onSaleCount?: number;
    collectionCount?: number;
    offersCount?: number;

    activeIncomingOffers?: IOfferData[];
    activeOutgoingOffers?: IOfferData[];

    assets?: AssetFragment[];

    constructor(
        data?: UserFragment & any,
        tokensCount?: IUserTokensCount,
        activeIncomingOffers?: IOfferData[],
        activeOutgoingOffers?: IOfferData[]
    ) {
        if (!data) {
            throw new Error("Cannot initialize UserData with undefined object");
        }

        this.address = data.address;
        this.profileId = data.profileId;
        this.name = data.name;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.description = data.description;
        this.customUrl = data.customUrl;
        this.websiteUrl = data.websiteUrl;
        this.facebookUrl = data.facebookUrl;
        this.twitterUrl = data.twitterUrl;
        this.discordUrl = data.discordUrl;
        this.instagramUrl = data.instagramUrl;
        this.verified = data.verified;
        this.verifiedLevel = data.verifiedLevel;
        this.blacklisted = data.blacklisted;
        this.coverImage = data.coverImage || data.bannerImageUrl;

        this.email = data.email;
        this.showEmail = data.showEmail;
        this.isAdmin = data.isAdmin;
        this.isEmailNotificationEnabled = data.isEmailNotificationEnabled;
        this.landingTab = data.landingTab;

        this.showBalance = data.showBalance;

        this.activeIncomingOffers = activeIncomingOffers;
        this.activeOutgoingOffers = activeOutgoingOffers;

        this.assets = data.assets;

        if (tokensCount) {
            this.createdCount = tokensCount.createdCount;
            this.collectedCount = tokensCount.collectedCount;
            this.onSaleCount = tokensCount.onSaleCount;
            this.collectionCount = tokensCount.collectionCount;
            this.offersCount = tokensCount.offersCount;
        }
    }

    get shortAddress(): string {
        return getShortAddress(this.address)!;
    }

    get username(): string {
        return this.name || this.shortAddress;
    }

    get picassoImage(): string {
        const svg = picasso(this.address);
        return `data:image/svg+xml;utf8,${svg}`;
    }

    get profileImage(): string {
        return this.assets != null && this.assets.length > 0
            ? this.assets[this.assets.length - 1].url
            : this.picassoImage;
    }

    get profileIdentifier(): string {
        return this.customUrl || this.address;
    }

    get canMint(): boolean {
        return !this.blacklisted && !!this.name;
    }

    get canBuy(): boolean {
        return !this.blacklisted;
    }

    get canTransfer(): boolean {
        return !this.blacklisted;
    }

    get canSell(): boolean {
        return !this.blacklisted;
    }

    get hasImage(): boolean {
        return !!this.assets?.length;
    }
}
