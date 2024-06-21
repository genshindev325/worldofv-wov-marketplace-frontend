import { ContractId } from "@/pages/api/get-contract/[name]";
import ConnexService from "./ConnexService";

export interface CancelAuctionArgs {
    auctionId: string;
    smartContractAddress: string;
    tokenId: string;
}

export default class AuctionService {
    constructor(private readonly connexService: ConnexService) {}

    async cancel({
        smartContractAddress,
        tokenId,
        auctionId,
    }: CancelAuctionArgs) {
        const methods = await this.connexService.getMethods(
            ContractId.WorldOfVBidAuction,
            process.env.NEXT_PUBLIC_BID_AUCTION_CONTRACT_ADDRESS!
        );

        return methods.cancelAuction.asClause(
            auctionId,
            smartContractAddress,
            tokenId
        );
    }
}
