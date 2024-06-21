import { userAddressSelector } from "@/store/selectors";
import BigNumber from "bignumber.js";
import _ from "lodash";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { useRecoilValue } from "recoil";
import useSWR, { KeyedMutator } from "swr";
import { useConnex } from "../components/ConnexProvider";
import { Currency } from "../types/Currencies";
import formatPrice from "../utils/formatPrice";

export type Balance = Record<Currency, BigNumber | undefined>;

export type BalanceFormatted = Record<keyof Balance, string>;

export interface BalanceContextProps {
    balance?: Balance;
    balanceFormatted?: BalanceFormatted;
    error?: any;
    isValidating: boolean;
    refreshBalance: KeyedMutator<Balance | undefined>;
}

const BalanceContext = createContext<BalanceContextProps>({
    isValidating: false,
    refreshBalance: async () => undefined,
});

export default function BalanceProvider(props: { children: ReactNode }) {
    const userAddress = useRecoilValue(userAddressSelector);
    const { getBalance } = useConnex();

    const {
        data: balance,
        mutate: refreshBalance,
        error,
        isValidating,
    } = useSWR(userAddress ? [userAddress, "USER_BALANCE"] : null, (address) =>
        getBalance(address)
    );
    const balanceFormatted = useMemo(
        () =>
            _.mapValues(balance, (value, key: keyof Balance) =>
                formatPrice(value, true, key)
            ) as unknown as BalanceFormatted,
        [balance]
    );

    return (
        <BalanceContext.Provider
            value={{
                balance,
                balanceFormatted,
                error,
                isValidating,
                refreshBalance,
            }}
            {...props}
        />
    );
}

export const useBalance = () => useContext(BalanceContext);
