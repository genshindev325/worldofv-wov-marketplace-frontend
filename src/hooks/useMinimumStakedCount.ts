import { useCallback, useMemo } from "react";
import Web3 from "web3";

/**
 * @returns a callback to fetch the minimum staked count for the provided
 * contract from the environment.
 */
export function useGetMinimumStakedCount() {
    const counts = useMemo(() => {
        const values = process.env.NEXT_PUBLIC_MIN_STAKED_COUNTS?.match(
            /0x[a-fA-F0-9]{40}=\d+/g
        );

        const entries = values?.map((v) => {
            const value = v.split("=", 2);
            const address = Web3.utils.toChecksumAddress(value[0]);
            const count = parseInt(value[1]);
            return [address, count] as const;
        });

        return new Map(entries);
    }, []);

    return useCallback(
        (stakingContractAddress: string) =>
            counts.get(Web3.utils.toChecksumAddress(stakingContractAddress)),
        [counts]
    );
}

/**
 * Retrieve the the minimum staked count for the provided contract from the
 * environment.
 */
export function useMinimumStakedCount(stakingContractAddress?: string) {
    const getMinimumStakedCount = useGetMinimumStakedCount();

    return useMemo(
        () => getMinimumStakedCount(stakingContractAddress || ""),
        [getMinimumStakedCount, stakingContractAddress]
    );
}
