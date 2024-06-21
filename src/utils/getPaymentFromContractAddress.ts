import Web3 from "web3";

export const getPaymentFromContractAddress = (address?: string | null) => {
    if (address) {
        const checksumAddress = Web3.utils.toChecksumAddress(address);

        switch (checksumAddress) {
            case Web3.utils.toChecksumAddress(
                process.env.NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS!
            ):
                return "WoV";
            case Web3.utils.toChecksumAddress(
                process.env.NEXT_PUBLIC_WRAPPED_VET_CONTRACT_ADDRESS!
            ):
                return "vVET";
        }
    }

    return "VET";
};
