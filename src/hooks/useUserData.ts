import { UserFragment, VerifiedStatus } from "@/generated/graphql";
import { userAddressSelector } from "@/store/selectors";
import { UserData } from "@/types/UserData";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import useGraphQL from "./useGraphQL";

export function useUserData() {
    const walletAddress = useRecoilValue(userAddressSelector);

    const fallbackUser: UserFragment | undefined = useMemo(
        () =>
            walletAddress
                ? {
                      address: walletAddress!,
                      isAdmin: false,
                      isEmailNotificationEnabled: false,
                      showBalance: false,
                      showEmail: false,
                      verified: false,
                      verifiedLevel: VerifiedStatus.NotVerified,
                  }
                : undefined,
        [walletAddress]
    );

    const { sdk } = useGraphQL();

    const { data, ...rest } = useSWR(
        walletAddress ? [walletAddress, "GET_USER"] : null,
        async (address) => sdk.GetUser({ address }),
        {
            revalidateOnMount: true,
            revalidateOnReconnect: false,
        }
    );

    return { user: data?.user || fallbackUser, ...rest };
}

/**
 * @deprecated The `UserData` wrapper for the user info is pretty messy, prefer
 * to use `useUserData` instead.
 */
export function useUserDataLegacy() {
    const { user } = useUserData();
    return useMemo(() => (user ? new UserData(user) : null), [user]);
}
