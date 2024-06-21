import { ContractId } from "@/pages/api/get-contract/[name]";
import LZString from "lz-string";
import { AbiItem } from "web3-utils";

export default class AbiService {
    private readonly abis = new Map<ContractId, AbiItem[]>();

    async getAbi(contractId: ContractId) {
        let abi = this.abis.get(contractId);

        if (!abi) {
            const data = await fetch(`/api/get-contract/${contractId}`);
            const compressed = await data.text();
            const decompressed = LZString.decompressFromBase64(compressed);

            if (!decompressed) {
                throw new Error("Invalid ABI.");
            }

            abi = JSON.parse(decompressed) as AbiItem[];
            this.abis.set(contractId, abi);
        }

        return abi;
    }
}
