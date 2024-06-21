import useGraphQL from "@/hooks/useGraphQL";
import { userAddressSelector } from "@/store/selectors";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { useRefreshListener } from "../components/RefreshContext";
import { GetTokensQueryResult } from "../generated/graphql";
import { QueryGetTokens } from "../graphql/get-tokens.graphql";
import { useCollection } from "../providers/CollectionProvider";
import { useGlobalConfig } from "../providers/GlobalConfigProvider";
import { useDebounce } from "./useDebounce";

const REFRESH_KEY = "collection-tab";

export const useCollectionQuery = (itemType: string, pageSize: number) => {
    const globalConfig = useGlobalConfig();
    const userAddress = useRecoilValue(userAddressSelector);
    const {
        collection,
        selectedTab,
        page,
        query,
        sort,
        onlyStakeable,
        currency,
        minPrice,
        maxPrice,
        minRank,
        maxRank,
        activeProperties,
    } = useCollection();

    // const getKey = (pageIndex: number, previousPageData: any) => {
    //     if (previousPageData && !previousPageData.tokens?.meta?.hasMore)
    //         return null;

    const debouncedQuery = useDebounce(query, 250);

    const stakedStatus =
        itemType === "staked" ? "Staked" : onlyStakeable ? "Unstaked" : null;

    const ownerAddress =
        itemType === "collected" || itemType === "staked"
            ? userAddress
            : undefined;

    const minPriceWei = minPrice
        ? new BigNumber(minPrice).times(1e18).toFormat({ groupSeparator: "" })
        : undefined;

    const maxPriceWei = maxPrice
        ? new BigNumber(maxPrice).times(1e18).toFormat({ groupSeparator: "" })
        : undefined;

    const { client } = useGraphQL();

    const { data, error, isValidating, mutate } = useSWR<GetTokensQueryResult>(
        [
            QueryGetTokens,
            {
                pagination: {
                    page,
                    perPage: selectedTab?.value !== itemType ? 0 : pageSize,
                },
                filters: {
                    onSaleOnly: itemType === "onsale" || !!currency,
                    stakedStatus,
                    eligibleToStakeOnly: onlyStakeable,
                    attributes: activeProperties,
                    query: debouncedQuery ? debouncedQuery : undefined,
                    collectionId: collection?.collectionId,
                    ownerAddress,
                    payment: currency,
                    minPrice: minPriceWei,
                    maxPrice: maxPriceWei,
                    minRank,
                    maxRank,
                },
                sortBy: sort?.value?.toUpperCase()?.replaceAll("-", "_"),
            },
        ],
        (query: string, variables: any) => {
            if (!globalConfig.countersOn && selectedTab?.value !== itemType)
                return {};
            return client.request(query, variables);
        },
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
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
