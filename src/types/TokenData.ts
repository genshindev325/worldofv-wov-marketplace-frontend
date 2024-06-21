import { SALE_BLACKLIST_COLLECTIONS } from "@/constants/saleBlacklist";
import BigNumber from "bignumber.js";
import {
    decodeDelimitedArray,
    decodeObject,
    encodeArray,
    encodeObject,
    QueryParamConfig,
} from "next-query-params";
import { AssetFragment, AssetSize, UserFragment } from "../generated/graphql";
import formatPrice from "../utils/formatPrice";
import { isSameAddress } from "../utils/isSameAddress";
import { AuctionData, IAuctionData } from "./AuctionData";
import { ICollectionStats } from "./CollectionData";
import { EditionData, IEditionData } from "./EditionData";
import { IOfferData } from "./OfferData";
import { UserData } from "./UserData";

export interface ITokenDataCollection {
    id: string;
    collectionId: string;
    name: string;
    customUrl?: string;
    thumbnailImageUrl: string;
    isVerified?: boolean;
    type: "USER_CREATED" | "PFP" | "MARKETPLACE" | "EXTERNAL";
    stats: ICollectionStats | any;
}

export interface ITokenAttribute {
    trait_type: string;
    value: string | number;
}

export interface ISelectedTokenAttributes {
    [key: string]: string[];
}

export const SelectedTokenAttributesParam: QueryParamConfig<
    ISelectedTokenAttributes | null | undefined
> = {
    encode(obj) {
        if (obj == null) return undefined;
        const flatObj: any = {};
        Object.entries(obj).forEach(([key, value]) => {
            flatObj[key] = encodeArray(value);
        });
        return encodeObject(flatObj);
    },
    decode(objStr) {
        if (objStr == null) return null;
        const flatObj = decodeObject(objStr);
        if (flatObj == null) return null;
        const obj: any = {};
        Object.entries(flatObj).forEach(([key, value]) => {
            obj[key] = decodeDelimitedArray(value, ",");
        });
        return obj;
    },
};

export interface ITokenData {
    id: string;
    smartContractAddress: string;
    name: string;
    description?: string;
    editionsCount: number;
    onSale?: number;
    royalty: number;
    rank?: number;
    score?: number;
    createdAtBlockTimestamp: number;
    creator?: UserFragment;
    collection?: ITokenDataCollection | any;
    externalCollection?: ITokenDataCollection;
    assets: AssetFragment[];
    attributes?: ITokenAttribute[];
    stakingEarnings?: string;
}

interface TokenDataProps {
    tokenData: ITokenData;
    editionsData?: IEditionData[];
    offersData?: IOfferData[];
    auctionData?: IAuctionData;
}

export class TokenData implements ITokenData {
    id: string;
    smartContractAddress: string;
    name: string;
    description?: string;
    editionsCount: number;
    onSale?: number;
    royalty: number;
    rank?: number;
    score?: number;
    createdAtBlockTimestamp: number;
    creator: UserData;
    collection?: ITokenDataCollection | any;
    auction?: AuctionData;
    assets: AssetFragment[];
    activeOffers?: IOfferData[];
    attributes?: ITokenAttribute[];
    stakingEarnings?: string;

    private readonly _editions?: IEditionData[];

    constructor({
        tokenData,
        editionsData,
        offersData,
        auctionData,
    }: TokenDataProps) {
        if (!tokenData) {
            throw new Error(
                "Cannot initialize TokenData with undefined object"
            );
        }

        this.id = tokenData.id || (tokenData as any).tokenId;
        this.smartContractAddress = tokenData.smartContractAddress;
        this.name = tokenData.name;
        this.description = tokenData.description?.replace(/<\/*br>/g, "\n");
        this.editionsCount = tokenData.editionsCount;
        this.onSale = tokenData.onSale;
        this.royalty = tokenData.royalty;
        this.createdAtBlockTimestamp =
            tokenData.createdAtBlockTimestamp || (tokenData as any).mintedAt;

        this.creator =
            tokenData.creator &&
            !isSameAddress(
                tokenData.smartContractAddress,
                tokenData.creator.address
            )
                ? new UserData(tokenData.creator)
                : isSameAddress(
                      tokenData.smartContractAddress,
                      tokenData.collection?.smartContractAddress
                  )
                ? new UserData({
                      address: tokenData.collection.smartContractAddress,
                      name: tokenData.collection.name,
                      customUrl: tokenData.collection.customUrl,
                      verified: tokenData.collection.isVerified,
                      verifiedLevel: tokenData.collection.isVerified
                          ? "VERIFIED"
                          : "NOT_VERIFIED",
                      assets: [
                          {
                              url: tokenData.collection.thumbnailImageUrl,
                              size: AssetSize.Original,
                              mimeType: "image/*",
                          },
                      ],
                  })
                : ({} as UserData);

        this.activeOffers = offersData;
        this.collection = tokenData.collection || tokenData.externalCollection;

        this.assets = tokenData.assets;
        this._editions = editionsData;

        this.rank = tokenData.rank;
        this.score = Number(tokenData.score);
        this.attributes = tokenData.attributes;
        this.stakingEarnings = tokenData.stakingEarnings;

        this.auction = auctionData ? new AuctionData(auctionData) : undefined;
    }

    get editions(): EditionData[] {
        return this._editions?.map((el) => new EditionData(el)) || [];
    }

    get editionsOnSale(): EditionData[] {
        return this.editions.filter((edition) => edition.isOnSale);
    }

    get editionsNotOnSale(): EditionData[] {
        return this.editions.filter((edition) => !edition.isOnSale);
    }

    get floorPriceEdition() {
        return this.editions.length
            ? this.editions.reduce((a, b) => {
                  if (a.price && b.price) {
                      return new BigNumber(a.price).lte(new BigNumber(b.price))
                          ? a
                          : b;
                  }

                  return a?.price ? a : b;
              })
            : undefined;
    }

    get isOnAuction() {
        if (this.auction?.id) {
            if (
                this.auction.ended &&
                (this.auction.cancelled || this.auction.settled)
            ) {
                return false;
            }

            return true;
        }

        return false;
    }

    get auctionPrice() {
        return this.auction?.currentBid || this.auction?.reservePrice;
    }

    get formattedAuctionPrice() {
        return this.auctionPrice ? formatPrice(this.auctionPrice) : undefined;
    }

    get canBeBought() {
        return !this.creator.blacklisted;
    }

    get canBeSold() {
        return (
            !this.creator.blacklisted &&
            !SALE_BLACKLIST_COLLECTIONS.some((a) =>
                isSameAddress(this.smartContractAddress, a)
            )
        );
    }

    public getEditionsOwnedBy(address?: string): EditionData[] {
        return address
            ? this.editions.filter((edition) =>
                  isSameAddress(edition.owner.address, address)
              )
            : [];
    }

    public getEditionsOnSaleOwnedBy(address?: string): EditionData[] {
        return address
            ? this.getEditionsOwnedBy(address).filter(
                  (edition) => edition.isOnSale
              )
            : [];
    }

    public getEditionsNotOnSaleOwnedBy(address?: string): EditionData[] {
        return address
            ? this.getEditionsOwnedBy(address).filter(
                  (edition) => !edition.isOnSale
              )
            : [];
    }

    public getActiveOffersInitiatedBy(
        address?: string
    ): IOfferData[] | undefined {
        return this.activeOffers?.filter((o: IOfferData) =>
            isSameAddress(o.bidderAddress, address)
        );
    }

    public getFloorPriceEdition(
        priceConversion: { [key: string]: number } | undefined
    ) {
        return this.editions.length
            ? this.editions.reduce((a, b) => {
                  if (a.price && b.price && priceConversion) {
                      const usdPriceA = new BigNumber(a.price).multipliedBy(
                          priceConversion[a.payment!]
                      );
                      const usdPriceB = new BigNumber(b.price).multipliedBy(
                          priceConversion[b.payment!]
                      );
                      return usdPriceA.lte(usdPriceB) ? a : b;
                  } else if (a.price && b.price) {
                      return new BigNumber(a.price).lte(new BigNumber(b.price))
                          ? a
                          : b;
                  }
                  return a?.price ? a : b;
              })
            : undefined;
    }
}
