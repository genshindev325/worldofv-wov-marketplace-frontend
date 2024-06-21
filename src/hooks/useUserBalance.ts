import { mapValues } from "lodash";
import useSWR from "swr";
import { Balance } from "../components/BalanceProvider";
import { useConnex } from "../components/ConnexProvider";
import formatPrice from "../utils/formatPrice";
import { useUserData } from "./useUserData";

export const useUserBalance = () => {
    const { user } = useUserData();
    const { getBalance } = useConnex();

    const { data: balance } = useSWR(
        user ? [user.address, "PROFILE_BALANCE"] : null,
        async (address) => {
            const balance = await getBalance(address);
            return mapValues(balance, formatPrice) as unknown as Record<
                keyof Balance,
                string
            >;
        }
    );

    return balance;
};
