import BigNumber from "bignumber.js";
import { UserFragment } from "../generated/graphql";
import formatPrice from "../utils/formatPrice";
import { getPaymentFromContractAddress } from "../utils/getPaymentFromContractAddress";
import { AuctionData, IAuctionData } from "./AuctionData";
import { SaleCurrency } from "./Currencies";
import { UserData } from "./UserData";

export interface IEditionData_v2 {
    editionId: string;
    tokenId: string;
    smartContractAddress: string;
    stakingContractAddress?: string;
    saleId?: string;
    salePrice?: string;
    saleAddressVIP180?: string;
    ownerAddress?: string;
    owner?: UserFragment;
    cooldownEnd?: number;
    isFreeShipping?: boolean | null;
}
export interface IEditionData {
    id: string;
    price?: string | bigint | null | BigNumber;
    payment?: SaleCurrency | null;
    saleId?: string;
    owner: UserFragment;
    auctions?: IAuctionData[];
    isFreeShipping?: boolean | null;
}

export class EditionData implements IEditionData {
    id: string;
    price?: BigNumber | null;
    payment?: SaleCurrency | null;
    saleId?: string;
    salePrice?: string;
    saleAddressVIP180?: string;
    owner: UserData;
    auctions?: AuctionData[];
    stakingContractAddress?: string;
    cooldownEnd?: number;
    isFreeShipping?: boolean | null;

    constructor(data?: IEditionData);
    constructor(data?: IEditionData_v2);
    constructor(data?: any) {
        if (!data) {
            throw new Error(
                "Cannot initialize EditionData with undefined object"
            );
        }

        // v1
        if (data.id) {
            this.id = data.id;
            this.price = data?.price
                ? new BigNumber(data.price as string)
                : null;
            this.saleId = data.saleId;
            this.payment = data.payment;
            this.owner = new UserData(data.owner);

            if (data.auctions?.length) {
                this.auctions = data.auctions.map(
                    (auction: any) => new AuctionData(auction)
                );
            }
        } else {
            // v2
            this.id = data.editionId;
            this.saleId = data.saleId;
            this.salePrice = data.salePrice;
            this.saleAddressVIP180 = data.saleAddressVIP180;
            this.price = data.salePrice;
            this.stakingContractAddress = data.stakingContractAddress;

            this.payment = data.saleId
                ? (getPaymentFromContractAddress(
                      data.saleAddressVIP180
                  ) as SaleCurrency)
                : null;

            this.owner = new UserData(
                data.owner || { address: data.ownerAddress }
            );

            this.cooldownEnd = data.cooldownEnd;
            this.isFreeShipping = data.isFreeShipping;
        }
    }

    get editionNumber(): number {
        return parseInt(this.id.slice(-5));
    }

    get formattedPrice(): string {
        return formatPrice(this.price);
    }

    get isOnSale(): boolean {
        return !!this.price;
    }

    get auction(): AuctionData | undefined {
        if (this.auctions?.length) {
            return this.auctions[0];
        }

        return undefined;
    }
}
