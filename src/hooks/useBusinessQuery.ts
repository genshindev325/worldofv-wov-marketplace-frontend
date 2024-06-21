import useGraphQL from "@/hooks/useGraphQL";
import { useMemo } from "react";
import useSWR from "swr";
import { GetTokensQueryResult } from "../generated/graphql";
import { QueryGetTokens } from "../graphql/get-tokens.graphql";
import { useUserData } from "./useUserData";

export const useBusinessQuery = (
    collectionId: string,
    pageSize: number,
    page: number
) => {
    const { user } = useUserData();
    const { client } = useGraphQL();
    // export type GetTokensFilterArgs = {
    //     attributes?: InputMaybe<Scalars["JSON"]>;
    //     auctionsToSettleOnly?: InputMaybe<Scalars["Boolean"]>;
    //     category?: InputMaybe<TokenCategory>;
    //     collectionId?: InputMaybe<Scalars["String"]>;
    //     creatorAddress?: InputMaybe<Scalars["String"]>;
    //     eligibleToStakeOnly?: InputMaybe<Scalars["Boolean"]>;
    //     hideCreated?: InputMaybe<Scalars["Boolean"]>;
    //     lastListedAfter?: InputMaybe<Scalars["String"]>;
    //     maxPrice?: InputMaybe<Scalars["String"]>;
    //     maxRank?: InputMaybe<Scalars["Float"]>;
    //     minPrice?: InputMaybe<Scalars["String"]>;
    //     minRank?: InputMaybe<Scalars["Float"]>;
    //     onAuctionOnly?: InputMaybe<Scalars["Boolean"]>;
    //     onSaleOnly?: InputMaybe<Scalars["Boolean"]>;
    //     ownerAddress?: InputMaybe<Scalars["String"]>;
    //     payment?: InputMaybe<PaymentFilterEnum>;
    //     query?: InputMaybe<Scalars["String"]>;
    //     smartContractAddress?: InputMaybe<Scalars["String"]>;
    //     stakedStatus?: InputMaybe<StakedStatusEnum>;
    //     typeFilter?: InputMaybe<TokenTypeFilterEnum>;
    //     verifiedLevel?: InputMaybe<VerifiedStatusEnum>;
    // };
    const { data, error, isValidating, mutate } = useSWR<GetTokensQueryResult>(
        [
            QueryGetTokens,
            {
                pagination: {
                    page,
                    perPage: pageSize,
                },
                filters: {
                    collectionId,
                    ownerAddress: user?.address,
                },
                // sortBy: selectedSort?.value
                //     ?.toUpperCase()
                //     ?.replaceAll("-", "_"),
            },
        ],
        (urlOrQuery: string, data: string) => {
            if (user == null) return {};
            return client.request(urlOrQuery, data);
        },
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const items = useMemo(
        () =>
            data?.tokens?.items?.filter(
                (t) =>
                    t.editions[0].cooldownEnd == null ||
                    (t.editions[0].cooldownEnd != null &&
                        t.editions[0].cooldownEnd < Date.now() / 1000)
            ) || [],
        [data]
    );
    const total = useMemo(() => data?.tokens?.meta?.total || 0, [data]);
    const loading = (!data && !error) || isValidating;

    return {
        error,
        loading,
        items,
        total,
        mutate,
    };
};
