import { ContractId } from "@/pages/api/get-contract/[name]";
import ConnexService from "./ConnexService";
import Web3Service from "./Web3Service";

export interface DelegateStakingArgs {
    addresses: string[];
    ratesPercentages: number[];
    daysDuration: number;
}

export default class DelegationService {
    constructor(
        private readonly connexService: ConnexService,
        private readonly web3Service: Web3Service,
        private readonly userAddress: string
    ) {}

    async delegateStaking({
        addresses,
        ratesPercentages,
        daysDuration,
    }: DelegateStakingArgs) {
        // we can't know what allowance we need in advance as a user could add staking after delegation
        // so it's a big hardcode value, it's not optimal but it is what we have for now
        const allowance = "1000000000000000000000000000000000000";
        const clauses: Connex.VM.Clause[] = [];
        const delegationMethods = await this.connexService.getMethods(
            ContractId.DelegationStaking,
            // Temorary Hardcoded value for hitting 4k limit in AWS env variables
            "0x964c113DE750C39D23889078B2F4ac3Da49BAC8e"
        );
        const governanceMethods = await this.connexService.getMethods(
            ContractId.WorldOfVGovernanceToken,
            process.env.NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS!
        );

        const unixTimestamp = Math.round(new Date().getTime() / 1000);
        const secondsDuration = daysDuration * 60 * 60 * 24;
        const endDate = unixTimestamp + secondsDuration;
        const rates = ratesPercentages.map((percentage) => percentage * 100);
        clauses.push(
            governanceMethods.increaseAllowance.asClause(
                "0x964c113DE750C39D23889078B2F4ac3Da49BAC8e",
                allowance
            )
        );
        clauses.push(
            delegationMethods.ownerAddDelegation.asClause(
                addresses,
                rates,
                endDate
            )
        );
        return clauses;
    }

    async getDelegationInfo() {
        const contract = await this.web3Service.getContract(
            ContractId.DelegationStaking,
            "0x964c113DE750C39D23889078B2F4ac3Da49BAC8e"
        );
        const decoded = await contract.methods
            .userDelegationDetails(this.userAddress)
            .call();
        return decoded;
    }
}
