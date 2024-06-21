import { ContractId } from "@/pages/api/get-contract/[name]";
import _ from "lodash";
import { AbiItem } from "web3-utils";
import ConnexService from "./ConnexService";
import Web3Service from "./Web3Service";

export interface TransferArgs {
    from: string;
    to: string;
    tokenId: string;
    smartContractAddress: string;
}

export default class NftService {
    constructor(
        private readonly connexService: ConnexService,
        private readonly web3Service: Web3Service
    ) {}

    async transfer(tokens: TransferArgs[]): Promise<Connex.VM.Clause[]> {
        const clauses: Connex.VM.Clause[] = [];

        for (const token of tokens) {
            const contract = await this.connexService.getMethods(
                ContractId.StandardNFT,
                token.smartContractAddress
            );
            clauses.push(
                contract.safeTransferFrom.asClause(
                    token.from,
                    token.to,
                    token.tokenId
                )
            );
        }

        return clauses;
    }

    async mintRandomToken(
        smartContractAddress: string
    ): Promise<Connex.VM.Clause> {
        // This applies to both DynamicNFT and BusinessPOA
        const abi: AbiItem = {
            inputs: [
                { internalType: "uint256", name: "seed", type: "uint256" },
            ],
            name: "purchaseTokenRandom",
            outputs: [],
            stateMutability: "payable",
            type: "function",
        };

        const methods = await this.connexService.getMethodsByABI(
            [abi],
            smartContractAddress
        );

        return methods.purchaseTokenRandom.asClause(_.random());
    }

    async getRandomTokenCount(
        smartContractAddress: string,
        userAddress: string
    ): Promise<number> {
        // This applies to both DynamicNFT and BusinessPOA
        const abi: AbiItem = {
            inputs: [
                {
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
            ],
            name: "balanceOf",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        };

        const contract = await this.web3Service.getContractByABI(
            [abi],
            smartContractAddress
        );

        const data = await contract.methods.balanceOf(userAddress).call();

        return parseInt(data);
    }

    async getLatestMintedTokenUri(
        smartContractAddress: string,
        userAddress: string,
        contractName: keyof typeof ContractId,
        fromBlock?: number
    ): Promise<string | null> {
        const contract = await this.web3Service.getContract(
            ContractId[contractName],
            smartContractAddress
        );

        const options = {
            // filter: { from: ZERO_ADDRESS, to: userAddress },
            filter: { to: userAddress },
            fromBlock: fromBlock || "earliest",
            toBlock: "latest",
        };

        const events: any[] = await contract.getPastEvents("Transfer", options);

        if (!events?.length) return null;

        // Sorting order option on `getPastEvents` does not work.
        const latestEvent = _.maxBy(events, (e) => parseInt(e.blockNumber));
        const tokenId = latestEvent.returnValues.tokenId;
        return contract.methods.tokenURI(tokenId).call();
    }
}
