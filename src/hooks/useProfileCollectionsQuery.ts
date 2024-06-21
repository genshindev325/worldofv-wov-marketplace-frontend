import useGraphQL from "@/hooks/useGraphQL";
import { useMemo } from "react";
import useSWR from "swr";
import { useRefreshListener } from "../components/RefreshContext";
import { useProfile } from "../providers/ProfileProvider";

const REFRESH_KEY = "profile-tab-collection";

export const useProfileCollectionsQuery = (
    itemType: string,
    pageSize: number
) => {
    const { user, selectedTab } = useProfile();
    const { sdk } = useGraphQL();

    const { data, error, isValidating, mutate } = useSWR(
        [
            {
                filters: { creatorAddress: user.address },
                pagination: {
                    perPage: selectedTab?.value !== itemType ? 0 : pageSize,
                },
            },
            "GET_COLLECTIONS",
        ],
        (args) => sdk.GetCollections(args),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    useRefreshListener(REFRESH_KEY, async () => {
        await mutate(data, { revalidate: true });
    });

    const items = useMemo(() => data?.collections?.items || [], [data]);
    const total = useMemo(() => data?.collections?.meta?.total || 0, [data]);
    const loading = (!data && !error) || isValidating;

    return {
        error,
        loading,
        items,
        total,
    };
};
