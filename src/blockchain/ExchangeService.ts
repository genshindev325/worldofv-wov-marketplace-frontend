import { ContractId } from "@/pages/api/get-contract/[name]";
import { PurchaseCurrency, SaleCurrency } from "@/types/Currencies";
import formatBigNumber from "@/utils/formatBigNumber";
import BigNumber from "bignumber.js";
import ConnexService from "./ConnexService";
import Web3Service from "./Web3Service";

export interface GetAmountsInArgs {
    fromCurrency: PurchaseCurrency;
    toCurrency: SaleCurrency;
    amountOutWei: BigNumber;
}

export interface SwapArgs {
    fromCurrency: PurchaseCurrency;
    toCurrency: SaleCurrency;
    amountInWei: BigNumber;
    amountOutWei: BigNumber;
    recipientAddress: string;
    slippage?: number;
    deadline?: number;
}

export interface TransferCurrencyArgs {
    currency: PurchaseCurrency;
    amountWei: BigNumber;
    recipientAddress: string;
}

export default class ExchangeService {
    constructor(
        private readonly connexService: ConnexService,
        private readonly web3Service: Web3Service
    ) {}

    private getPath(from: PurchaseCurrency, to: SaleCurrency) {
        const path = [];

        switch (from) {
            case "VET":
                path.push(
                    process.env.NEXT_PUBLIC_VEXCHANGE_VET_CONTRACT_ADDRESS!
                );
                break;
            case "WoV":
                path.push(
                    process.env
                        .NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS!
                );
                break;
            case "VTHO":
                path.push(process.env.NEXT_PUBLIC_VTHO_CONTRACT_ADDRESS!);
                break;
            case "VEUSD":
                path.push(process.env.NEXT_PUBLIC_VEUSD_CONTRACT_ADDRESS!);
                break;
            case "SHA":
                path.push(process.env.NEXT_PUBLIC_SHA_CONTRACT_ADDRESS!);
                break;
            case "VSEA":
                path.push(process.env.NEXT_PUBLIC_VSEA_CONTRACT_ADDRESS!);
                break;
            default:
                throw new Error(
                    `Currency '${from}' is not supported for swap.`
                );
        }

        if (from === "VSEA") {
            path.push(process.env.NEXT_PUBLIC_VEROCKET_VET_CONTRACT_ADDRESS!);
        } else if (from !== "VET") {
            path.push(process.env.NEXT_PUBLIC_VEXCHANGE_VET_CONTRACT_ADDRESS!);
        }

        if (to === "WoV") {
            path.push(
                process.env.NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS!
            );
        }

        return path;
    }

    private async getRouterContract(currency: PurchaseCurrency) {
        if (currency === "VSEA") {
            return this.web3Service.getContract(
                ContractId.VerocketRouter02,
                process.env.NEXT_PUBLIC_VEROCKET_ROUTER02_CONTRACT_ADDRESS!
            );
        } else {
            return this.web3Service.getContract(
                ContractId.VexchangeRouter02,
                process.env.NEXT_PUBLIC_VEXCHANGE_ROUTER02_CONTRACT_ADDRESS!
            );
        }
    }

    private async getRouterMethods(currency: PurchaseCurrency) {
        if (currency === "VSEA") {
            return this.connexService.getMethods(
                ContractId.VerocketRouter02,
                process.env.NEXT_PUBLIC_VEROCKET_ROUTER02_CONTRACT_ADDRESS!
            );
        } else {
            return this.connexService.getMethods(
                ContractId.VexchangeRouter02,
                process.env.NEXT_PUBLIC_VEXCHANGE_ROUTER02_CONTRACT_ADDRESS!
            );
        }
    }

    async getAmountsIn({
        fromCurrency,
        toCurrency,
        amountOutWei,
    }: GetAmountsInArgs) {
        const contract = await this.getRouterContract(fromCurrency);
        const path = this.getPath(fromCurrency, toCurrency);

        const result = await contract.methods
            .getAmountsIn(formatBigNumber(amountOutWei), path)
            .call();

        return new BigNumber(result[0]);
    }

    async swap({
        fromCurrency,
        toCurrency,
        amountInWei,
        amountOutWei,
        recipientAddress,
        slippage = ["Wov", "VET"].includes(fromCurrency) ? 0.05 : 0.1, // 5% if WoV or VET else 10%
        deadline = Math.round(new Date().getTime() / 1000) + 120, // 2 minutes
    }: SwapArgs) {
        const clauses: Connex.VM.Clause[] = [];

        const amountInMax = amountInWei.plus(amountInWei.times(slippage));

        const formattedAmountInMax = formatBigNumber(amountInMax);

        switch (fromCurrency) {
            case "VET":
                break;

            case "WoV":
                const wovContract = await this.connexService.getMethods(
                    ContractId.WorldOfVGovernanceToken,
                    process.env
                        .NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS!
                );
                clauses.push(
                    wovContract.approve.asClause(
                        process.env
                            .NEXT_PUBLIC_VEXCHANGE_ROUTER02_CONTRACT_ADDRESS!,
                        formattedAmountInMax
                    )
                );
                break;

            case "VTHO":
                const vthoContract = await this.connexService.getMethods(
                    ContractId.VTHOContract,
                    process.env.NEXT_PUBLIC_VTHO_CONTRACT_ADDRESS!
                );
                clauses.push(
                    vthoContract.approve.asClause(
                        process.env
                            .NEXT_PUBLIC_VEXCHANGE_ROUTER02_CONTRACT_ADDRESS!,
                        formattedAmountInMax
                    )
                );
                break;

            case "VEUSD":
                const veusdContract = await this.connexService.getMethods(
                    ContractId.VTHOContract,
                    process.env.NEXT_PUBLIC_VEUSD_CONTRACT_ADDRESS!
                );
                clauses.push(
                    veusdContract.approve.asClause(
                        process.env
                            .NEXT_PUBLIC_VEXCHANGE_ROUTER02_CONTRACT_ADDRESS!,
                        formattedAmountInMax
                    )
                );
                break;

            case "SHA":
                const shaContract = await this.connexService.getMethods(
                    ContractId.VTHOContract,
                    process.env.NEXT_PUBLIC_SHA_CONTRACT_ADDRESS!
                );
                // The double clause is intentional, DO NOT REMOVE.
                clauses.push(
                    shaContract.approve.asClause(
                        process.env
                            .NEXT_PUBLIC_VEXCHANGE_ROUTER02_CONTRACT_ADDRESS!,
                        0
                    )
                );
                clauses.push(
                    shaContract.approve.asClause(
                        process.env
                            .NEXT_PUBLIC_VEXCHANGE_ROUTER02_CONTRACT_ADDRESS!,
                        formattedAmountInMax
                    )
                );
                break;

            case "VSEA":
                const vseaContract = await this.connexService.getMethods(
                    ContractId.VTHOContract,
                    process.env.NEXT_PUBLIC_VSEA_CONTRACT_ADDRESS!
                );
                clauses.push(
                    vseaContract.approve.asClause(
                        process.env
                            .NEXT_PUBLIC_VEROCKET_ROUTER02_CONTRACT_ADDRESS!,
                        formattedAmountInMax
                    )
                );
                break;

            default:
                throw new Error(
                    `Swap from '${fromCurrency}' is not implemented.`
                );
        }

        const routerMethods = await this.getRouterMethods(fromCurrency);

        const formattedAmountOut = formatBigNumber(amountOutWei);

        const path = this.getPath(fromCurrency, toCurrency);

        switch (toCurrency) {
            case "VET":
                const swapMethod =
                    fromCurrency === "VSEA"
                        ? "swapTokensForExactETH"
                        : "swapTokensForExactVET";

                clauses.push(
                    routerMethods[swapMethod].asClause(
                        formattedAmountOut,
                        formattedAmountInMax,
                        path,
                        recipientAddress,
                        deadline
                    )
                );
                break;

            case "WoV":
                if (fromCurrency === "VET") {
                    clauses.push(
                        routerMethods.swapVETForExactTokens
                            .value(formattedAmountInMax)
                            .asClause(
                                formattedAmountOut,
                                path,
                                recipientAddress,
                                deadline
                            )
                    );
                } else {
                    clauses.push(
                        routerMethods.swapTokensForExactTokens.asClause(
                            formattedAmountOut,
                            formattedAmountInMax,
                            path,
                            recipientAddress,
                            deadline
                        )
                    );
                }
                break;

            default:
                throw new Error(
                    `Swap from to '${toCurrency}' is not implemented.`
                );
        }

        return clauses;
    }

    async transfer({
        currency,
        amountWei,
        recipientAddress,
    }: TransferCurrencyArgs) {
        const clauses: Connex.VM.Clause[] = [];

        const formattedAmountWei = formatBigNumber(amountWei);

        switch (currency) {
            case "VET":
                const veTransferContract = await this.connexService.getMethods(
                    ContractId.VeTransfer,
                    process.env.NEXT_PUBLIC_VET_EXCHANGE_CONTRACT_ADDRESS!
                );
                clauses.push(
                    veTransferContract.transfer
                        .value(formattedAmountWei)
                        .asClause(recipientAddress)
                );
                break;

            case "WoV":
                const wovContract = await this.connexService.getMethods(
                    ContractId.WorldOfVGovernanceToken,
                    process.env
                        .NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS!
                );
                clauses.push(
                    wovContract.transfer.asClause(
                        recipientAddress,
                        formattedAmountWei
                    )
                );
                break;

            case "VTHO":
                const vthoContract = await this.connexService.getMethods(
                    ContractId.VTHOContract,
                    process.env.NEXT_PUBLIC_VTHO_CONTRACT_ADDRESS!
                );
                clauses.push(
                    vthoContract.transfer.asClause(
                        recipientAddress,
                        formattedAmountWei
                    )
                );
                break;

            case "VEUSD":
                const veusdContract = await this.connexService.getMethods(
                    ContractId.VTHOContract,
                    process.env.NEXT_PUBLIC_VEUSD_CONTRACT_ADDRESS!
                );
                clauses.push(
                    veusdContract.transfer.asClause(
                        recipientAddress,
                        formattedAmountWei
                    )
                );
                break;

            case "SHA":
                const shaContract = await this.connexService.getMethods(
                    ContractId.VTHOContract,
                    process.env.NEXT_PUBLIC_SHA_CONTRACT_ADDRESS!
                );
                clauses.push(
                    shaContract.transfer.asClause(
                        recipientAddress,
                        formattedAmountWei
                    )
                );
                break;

            case "VSEA":
                const vseaContract = await this.connexService.getMethods(
                    ContractId.VTHOContract,
                    process.env.NEXT_PUBLIC_VSEA_CONTRACT_ADDRESS!
                );
                clauses.push(
                    vseaContract.transfer.asClause(
                        recipientAddress,
                        formattedAmountWei
                    )
                );
                break;

            default:
                throw new Error(
                    `Transfer of '${currency}' is not implemented.`
                );
        }

        return clauses;
    }
}
