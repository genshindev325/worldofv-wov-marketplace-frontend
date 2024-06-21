import Web3 from "web3";

export const isSameAddress = (a: any, b: any) => {
    try {
        return (
            Web3.utils.toChecksumAddress(a) === Web3.utils.toChecksumAddress(b)
        );
    } catch {
        return false;
    }
};
