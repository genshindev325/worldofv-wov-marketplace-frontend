import useGraphQL from "@/hooks/useGraphQL";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useRefreshListener } from "../components/RefreshContext";
import { GetTokensQueryResult } from "../generated/graphql";
import { QueryGetTokens } from "../graphql/get-tokens.graphql";
import { useDebounce } from "../hooks/useDebounce";
import { useGlobalConfig } from "../providers/GlobalConfigProvider";
import { useProfile } from "../providers/ProfileProvider";

const REFRESH_KEY = "profile-tab";

export const useProfileQuery = (itemType: string, pageSize: number) => {
    const globalConfig = useGlobalConfig();
    const {
        user,
        selectedTab,
        page,
        query,
        selectedSort,
        selectedTokenType,
        selectedCollectionId,
        properties,
    } = useProfile();

    const debouncedQuery = useDebounce(query, 250);

    const ownerAddress = [
        "collected",
        "onsale",
        "auctions-created",
        "auctions-to-settle",
        "staked",
    ].includes(itemType)
        ? user?.address
        : undefined;

    const typeFilter =
        selectedTokenType?.value?.toUpperCase() !== "ALL"
            ? selectedTokenType?.value?.toUpperCase()
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
                    hideCreated: itemType === "collected",
                    collectionId: selectedCollectionId,
                    query: debouncedQuery ? debouncedQuery : undefined,
                    attributes: properties,
                    typeFilter,
                    onSaleOnly: itemType === "onsale",
                    onAuctionOnly:
                        itemType === "auctions-created" ||
                        itemType === "auctions-to-settle" ||
                        selectedSort?.value === "auction-ending-soon",
                    auctionsToSettleOnly: itemType === "auctions-to-settle",
                    creatorAddress:
                        itemType === "created" ? user?.address : undefined,
                    ownerAddress,
                    stakedStatus: itemType === "staked" ? "Staked" : undefined,
                },
                sortBy: selectedSort?.value
                    ?.toUpperCase()
                    ?.replaceAll("-", "_"),
            },
        ],
        (urlOrQuery: string, data: string) => {
            if (!globalConfig.countersOn && selectedTab?.value !== itemType)
                return {};
            return client.request(urlOrQuery, data);
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
    const loading = (!data && !error) || isValidating;

    const [total, setTotal] = useState<number | null>(null);

    // We update the values this way to make sure the count doesn't glitch to 0
    // while loading.
    useEffect(() => {
        if (typeof data?.tokens?.meta?.total === "number") {
            setTotal(data.tokens.meta.total);
        }
    }, [data?.tokens?.meta?.total]);

    return {
        error,
        loading,
        items,
        total,
    };
};
