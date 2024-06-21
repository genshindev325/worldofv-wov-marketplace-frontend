import ZERO_ADDRESS from "@/constants/zeroAddress";
import { ContractId } from "@/pages/api/get-contract/[name]";
import { SaleCurrency } from "@/types/Currencies";
import formatBigNumber from "@/utils/formatBigNumber";
import BigNumber from "bignumber.js";
import ConnexService from "./ConnexService";

export interface SellArgs {
    smartContractAddress: string;
    tokenId: string;
    sellerAddress: string;
    priceWei: BigNumber;
    addressVIP180: string;
    previousSaleId?: string | null;
}

export interface CancelSaleArgs {
    saleId: string;
    smartContractAddress: string;
    tokenId: string;
}

export interface BuyArgs {
    saleId: string;
    smartContractAddress: string;
    tokenId: string;
    priceWei: BigNumber;
    payment: SaleCurrency;
}

export default class SaleService {
    constructor(private readonly connexService: ConnexService) {}

    private async getSaleMethods(version: "v2" | "v3") {
        let address: string;
        let contractId: ContractId;

        switch (version) {
            case "v2":
                address = process.env.NEXT_PUBLIC_SALE_V2_CONTRACT_ADDRESS!;
                contractId = ContractId.WorldOfVSaleV2;
                break;

            case "v3":
                address = process.env.NEXT_PUBLIC_SALE_V3_CONTRACT_ADDRESS!;
                contractId = ContractId.WorldOfVSaleV3;
                break;
        }

        return this.connexService.getMethods(contractId, address);
    }

    private async getSaleMethodsFromSaleId(saleId: string) {
        // V3 => 4xxxxxxxxx
        // V2 => 2xxxxxxxxx
        const version = saleId.startsWith("4") ? "v3" : "v2";
        return this.getSaleMethods(version);
    }

    async cancel({ saleId, smartContractAddress, tokenId }: CancelSaleArgs) {
        const methods = await this.getSaleMethodsFromSaleId(saleId);

        return methods.cancelListing.asClause(
            saleId,
            smartContractAddress,
            tokenId
        );
    }

    async sell(...args: SellArgs[]) {
        const saleMethodsV3 = await this.getSaleMethods("v3");

        const clauses: Connex.VM.Clause[] = [];

        for (const {
            smartContractAddress,
            tokenId,
            sellerAddress,
            priceWei,
            addressVIP180,
            previousSaleId,
        } of args) {
            const nftMethods = await this.connexService.getMethods(
                ContractId.StandardNFT,
                smartContractAddress
            );

            if (previousSaleId) {
                const cancelClause = await this.cancel({
                    smartContractAddress,
                    tokenId,
                    saleId: previousSaleId,
                });

                clauses.push(cancelClause);
            }

            clauses.push(
                nftMethods.approve.asClause(
                    process.env.NEXT_PUBLIC_SALE_V3_CONTRACT_ADDRESS,
                    tokenId
                )
            );

            const isVIP180 = addressVIP180 !== ZERO_ADDRESS;
            const startingTime = Math.floor(Date.now() / 1000);

            clauses.push(
                saleMethodsV3.createListing.asClause(
                    smartContractAddress,
                    Number(tokenId),
                    sellerAddress,
                    formatBigNumber(priceWei),
                    startingTime,
                    isVIP180,
                    addressVIP180
                )
            );
        }

        return clauses;
    }

    async buy(...args: BuyArgs[]) {
        const clauses: Connex.VM.Clause[] = [];

        for (const {
            saleId,
            smartContractAddress,
            tokenId,
            payment,
            priceWei,
        } of args) {
            const saleMethods = await this.getSaleMethodsFromSaleId(saleId);

            const formattedPrice = formatBigNumber(priceWei);

            switch (payment) {
                case "VET": {
                    clauses.push(
                        saleId.startsWith("4")
                            ? saleMethods.purchaseToken
                                  .value(formattedPrice)
                                  .asClause(
                                      saleId,
                                      smartContractAddress,
                                      tokenId,
                                      formattedPrice,
                                      false, // isVip180
                                      ZERO_ADDRESS // addressVip180
                                  )
                            : saleMethods.purchaseToken
                                  .value(formattedPrice)
                                  .asClause(
                                      saleId,
                                      smartContractAddress,
                                      tokenId
                                  )
                    );

                    break;
                }

                case "WoV": {
                    const wovMethods = await this.connexService.getMethods(
                        ContractId.WorldOfVGovernanceToken,
                        process.env
                            .NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS!
                    );

                    // V3 => 4xxxxxxxxx
                    // V2 => 2xxxxxxxxx
                    const saleAddress = saleId.startsWith("4")
                        ? process.env.NEXT_PUBLIC_SALE_V3_CONTRACT_ADDRESS!
                        : process.env.NEXT_PUBLIC_SALE_V2_CONTRACT_ADDRESS!;

                    clauses.push(
                        wovMethods.increaseAllowance.asClause(
                            saleAddress,
                            formattedPrice
                        )
                    );

                    const addressVip180 =
                        process.env
                            .NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS;

                    clauses.push(
                        saleId.startsWith("4")
                            ? saleMethods.purchaseToken.asClause(
                                  saleId,
                                  smartContractAddress,
                                  tokenId,
                                  formattedPrice,
                                  true, // isVip180
                                  addressVip180
                              )
                            : saleMethods.purchaseToken.asClause(
                                  saleId,
                                  smartContractAddress,
                                  tokenId
                              )
                    );

                    break;
                }

                default: {
                    throw new Error(`Payment '${payment}' is not implemented.`);
                }
            }
        }

        return clauses;
    }
}
