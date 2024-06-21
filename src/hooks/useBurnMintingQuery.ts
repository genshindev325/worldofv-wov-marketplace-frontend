import useGraphQL from "@/hooks/useGraphQL";
import { userAddressSelector } from "@/store/selectors";
import { useContext, useMemo } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { BurnMintingContext } from "../components/BurnMintingSingle/BurnMintingContext";
import { useRefreshListener } from "../components/RefreshContext";
import { SortTokensByEnum } from "../generated/graphql";
import { useDebounce } from "../hooks/useDebounce";

const REFRESH_KEY = "burn-mint-select";

export const useBurnMintingQuery = (
    pageSize: number,
    page: number,
    query: string
) => {
    const userAddress = useRecoilValue(userAddressSelector);
    const { collection } = useContext(BurnMintingContext);
    const { sdk } = useGraphQL();

    const debouncedQuery = useDebounce(query, 250);

    const { data, error, isValidating, mutate } = useSWR(
        [
            {
                sortBy: SortTokensByEnum.RarityLowToHigh,
                pagination: { page, perPage: pageSize },
                filters: {
                    smartContractAddress: collection!.smartContractAddress,
                    ownerAddress: userAddress,
                    query: debouncedQuery || undefined,
                },
            },
            "GET_TOKENS", // unique id used for caching
        ],
        sdk.GetTokens, // fn
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
        }
    );

    useRefreshListener(REFRESH_KEY, async () => {
        await mutate(data, { revalidate: true });
    });

    const items = useMemo(() => data?.tokens?.items || [], [data]);
    const total = useMemo(() => data?.tokens?.meta?.total || 0, [data]);
    const loading = (!data && !error) || isValidating;

    return {
        error,
        loading,
        items,
        total,
    };
};
