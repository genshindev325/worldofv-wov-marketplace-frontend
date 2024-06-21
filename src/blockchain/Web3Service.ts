import { ContractId } from "@/pages/api/get-contract/[name]";
import Web3 from "web3";
import type { AbiItem } from "web3-utils";
import AbiService from "./AbiService";

export default class Web3Service {
    constructor(
        private readonly web3: Web3,
        private readonly abiService: AbiService
    ) {}

    async getContract(contractId: ContractId, address: string) {
        const abi = await this.abiService.getAbi(contractId);
        return new this.web3.eth.Contract(abi, address);
    }

    async getContractByABI(abi: AbiItem[] | AbiItem, address: string) {
        return new this.web3.eth.Contract(abi, address);
    }
}
