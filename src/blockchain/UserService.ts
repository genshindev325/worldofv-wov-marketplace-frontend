import { ContractId } from "@/pages/api/get-contract/[name]";
import ConnexService from "./ConnexService";

export enum AccountType {
    ARTIST,
    COLLECTOR,
    ALL,
}

export interface UpdateUserArgs {
    name: string;
    profileId: number;
}

const ACCOUNT_TYPE = AccountType.ALL;

// All the user data is managed directly through the backend so there is no need
// to upload the metadata to the blockchain.
const FILE_HASH = "Qme6p3zYYhTHQ4DSw5x1RCdyMEZEUrJDSCyHerFCNUb71s";
const METADATA_HASH = "QmbJWAESqCsf4RFCqEY7jecCashj8usXiyDNfKtZCwwzGb";

export default class UserService {
    constructor(private readonly connexService: ConnexService) {}

    async updateUser(name: string, profileId: number) {
        const contract = await this.connexService.getMethods(
            ContractId.WorldOfVOpenMarketplaceAccount,
            process.env.NEXT_PUBLIC_ACCOUNT_CONTRACT_ADDRESS!
        );

        return contract.updateAccount.asClause(
            METADATA_HASH,
            FILE_HASH,
            name,
            profileId
        );
    }

    async registerUser(name: string) {
        const contract = await this.connexService.getMethods(
            ContractId.WorldOfVOpenMarketplaceAccount,
            process.env.NEXT_PUBLIC_ACCOUNT_CONTRACT_ADDRESS!
        );

        return contract.registerAccount.asClause(
            METADATA_HASH,
            FILE_HASH,
            name,
            ACCOUNT_TYPE
        );
    }

    async isUsernameAlreadyInUse(name: string) {
        const contract = await this.connexService.getMethods(
            ContractId.WorldOfVOpenMarketplaceAccount,
            process.env.NEXT_PUBLIC_ACCOUNT_CONTRACT_ADDRESS!
        );

        return contract.accountNameExist
            .call(name)
            .then((res) => res.decoded[0]);
    }
}
