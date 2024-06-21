import useGraphQL from "@/hooks/useGraphQL";
import { usePhygitals } from "@/providers/PhygitalsProvider";
import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { GetTokensQueryResult } from "../generated/graphql";
import { QueryGetTokens } from "../graphql/get-tokens.graphql";

// Hide all listings older than 14 days.
const LISTING_UPDATED_AT_LIMIT_MS = 14 * 24 * 60 * 60 * 1000;

export const usePhygitalsQuery = (pageSize: number) => {
    const { page, showOnSaleOnly, selectedSort, selectedCreator } =
        usePhygitals();

    const lastListedAfter = useMemo(() => {
        // No need to have a limit when developing in testnet.
        if (process.env.NEXT_PUBLIC_NETWORK === "test") return null;
        if (!showOnSaleOnly) return null;
        const now = new Date();
        now.setTime(now.getTime() - LISTING_UPDATED_AT_LIMIT_MS);
        return now.toISOString();
    }, []);

    const { client } = useGraphQL();

    const fetcher = useCallback(
        (query: string, variables: any) => client.request(query, variables),
        [client]
    );

    const { data, error, isValidating } = useSWR<GetTokensQueryResult>(
        [
            QueryGetTokens,
            {
                pagination: { page, perPage: pageSize },
                filters: {
                    lastListedAfter,
                    onSaleOnly: showOnSaleOnly,
                    // onAuctionOnly:
                    //     selectedSort?.value === "auction-ending-soon",
                    // payment:
                    //     selectedPayment?.value !== "ALL"
                    //         ? selectedPayment?.value
                    //         : undefined,
                    category: "PHYGITAL",
                    // query: debouncedQuery ? debouncedQuery : undefined,
                    verifiedLevel:
                        selectedCreator?.value?.toUpperCase() !== "ALL"
                            ? selectedCreator?.value
                                  ?.toUpperCase()
                                  .replaceAll("-", "_")
                            : undefined,
                    // typeFilter:
                    //     selectedTokenType?.value?.toUpperCase() !== "ALL"
                    //         ? selectedTokenType?.value?.toUpperCase()
                    //         : undefined,
                },
                sortBy: selectedSort?.value
                    ?.toUpperCase()
                    ?.replaceAll("-", "_"),
            },
        ],
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

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
