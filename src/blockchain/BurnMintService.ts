import { ContractId } from "@/pages/api/get-contract/[name]";
import _ from "lodash";
import type { AbiItem } from "web3-utils";
import ZERO_ADDRESS from "../constants/zeroAddress";
import AuctionService from "./AuctionService";
import ConnexService from "./ConnexService";
import SaleService from "./SaleService";
import Web3Service from "./Web3Service";

export interface BurnMintTokenInfo {
    tokenId: string;
    saleId?: string | null;
    auctionId?: string | null;
    onSale: boolean;
}

export interface BurnMintParams {
    smartContractAddress: string;
    burnContractAddress: string;
    tokensToBurn: BurnMintTokenInfo[];
}

export interface LatestMintedTokenParams {
    smartContractAddress: string;
    userAddress: string;
    contractName: keyof typeof ContractId;
    fromBlock?: number;
    count?: number;
}

export default class BurnMintService {
    constructor(
        private readonly connexService: ConnexService,
        private readonly web3Service: Web3Service,
        private readonly saleService: SaleService,
        private readonly auctionService: AuctionService
    ) {}

    async burnMint({
        smartContractAddress,
        burnContractAddress,
        tokensToBurn,
    }: BurnMintParams) {
        const clauses: Connex.VM.Clause[] = [];

        const nftContractMethods = await this.connexService.getMethods(
            ContractId.StandardNFT,
            smartContractAddress
        );

        const burnContractMethods = await this.connexService.getMethods(
            ContractId.BurnMintingPFP,
            burnContractAddress
        );

        for (const params of tokensToBurn) {
            if (params.auctionId) {
                const clause = await this.auctionService.cancel({
                    auctionId: params.auctionId,
                    tokenId: params.tokenId,
                    smartContractAddress,
                });
                clauses.push(clause);
            }

            if (params.saleId) {
                const clause = await this.saleService.cancel({
                    saleId: params.saleId,
                    tokenId: params.tokenId,
                    smartContractAddress,
                });
                clauses.push(clause);
            }
        }

        for (const { tokenId } of tokensToBurn) {
            clauses.push(
                nftContractMethods.approve.asClause(
                    burnContractAddress,
                    tokenId
                )
            );
            clauses.push(
                burnContractMethods.mintWithBurn.asClause(
                    _.random(),
                    smartContractAddress,
                    [tokenId],
                    ZERO_ADDRESS,
                    []
                )
            );
        }

        return clauses;
    }

    async getLatestMintedToken({
        smartContractAddress,
        userAddress,
        contractName,
        fromBlock,
        count = 1,
    }: LatestMintedTokenParams) {
        // const pfpContractMethods = await this.connexService.getMethods(
        //     ContractId[contractName],
        //     smartContractAddress
        // );

        let options = {
            // filter: { from: ZERO_ADDRESS, to: userAddress },
            filter: { to: userAddress },
            fromBlock: fromBlock || "earliest",
            toBlock: "latest",
        };
        const abi = [
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "collection",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                ],
                name: "tokenURISpecialLottery",
                outputs: [
                    {
                        internalType: "string",
                        name: "",
                        type: "string",
                    },
                ],
                stateMutability: "view",
                type: "function",
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "address",
                        name: "from",
                        type: "address",
                    },
                    {
                        indexed: true,
                        internalType: "address",
                        name: "to",
                        type: "address",
                    },
                    {
                        indexed: true,
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        indexed: false,
                        internalType: "address",
                        name: "collection",
                        type: "address",
                    },
                ],
                name: "TransferLottery",
                type: "event",
            },
        ] as AbiItem[];

        const pfpContractMethods = await this.web3Service.getContractByABI(
            abi,
            smartContractAddress
        );

        const events: any[] = await pfpContractMethods.getPastEvents(
            "TransferLottery",
            options
        );

        if (!events?.length) return null;

        // Sorting order option on `getPastEvents` does not work.
        const sortedEvents = events.sort((e) => parseInt(e.blockNumber));
        const latestEvents = sortedEvents.slice(-count);

        return latestEvents.map((event) => event.returnValues);
    }
}
