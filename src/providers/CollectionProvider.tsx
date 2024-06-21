import { useUserData } from "@/hooks/useUserData";
import { isEmpty } from "lodash";
import {
    BooleanParam,
    NumberParam,
    StringParam,
    useQueryParams,
    withDefault,
} from "next-query-params";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useMemo } from "react";
import { OptionItemProps } from "../components/FormInputs/Select";
import { NavItemProps } from "../components/PillsNav";
import {
    COLLECTION_ON_SALE_SORT_OPTIONS,
    COLLECTION_PFP_ON_SALE_SORT_OPTIONS,
    COLLECTION_PFP_SORT_OPTIONS,
    COLLECTION_SORT_OPTIONS,
} from "../constants/collectionFilterOptions";
import { CollectionFragment } from "../generated/graphql";
import {
    ISelectedTokenAttributes,
    SelectedTokenAttributesParam,
} from "../types/TokenData";
import { findOrFallback } from "../utils/findOrFallback";
import { removeQueryParams } from "../utils/removeQueryParams";

// TODO: add types for OptionItems
export const CollectionContext = React.createContext<{
    collection: CollectionFragment;
    tabs: NavItemProps[];
    selectedTab: NavItemProps;
    setSelectedTab: (value: NavItemProps) => void;
    page: number;
    setPage: (value: number) => void;
    query: string;
    setQuery: (value: string) => void;
    sortOptions: OptionItemProps[];
    sort: OptionItemProps;
    setSort: (value: OptionItemProps) => void;
    onlyStakeable: boolean;
    setOnlyStakeable: (value: boolean) => void;
    currency: string | null;
    setCurrency: (value: string | null) => void;
    minPrice: number | null;
    setMinPrice: (value: number | null) => void;
    maxPrice: number | null;
    setMaxPrice: (value: number | null) => void;
    minRank: number | null;
    setMinRank: (value: number | null) => void;
    maxRank: number | null;
    setMaxRank: (value: number | null) => void;
    activeProperties: ISelectedTokenAttributes | null;
    setActiveProperties: (value: ISelectedTokenAttributes | null) => void;
}>({} as any);

interface CollectionProviderProps {
    collection: CollectionFragment;
    referer: string | null;
    host: string | null;
}

const CollectionProvider: FC<CollectionProviderProps> = ({
    children,
    collection,
    referer,
    host,
}) => {
    const router = useRouter();
    const { user } = useUserData();

    const tabs = useMemo(() => {
        const tabs = [
            {
                // id: "all",
                label: "All",
                value: "all",
            },
            {
                // id: "onSale",
                label: "On Sale",
                value: "onsale",
            },
        ];

        if (user) {
            tabs.push({
                // id: "collected",
                label: "Collected",
                value: "collected",
            });

            if (
                collection?.stakingContractAddresses?.length &&
                process.env.NEXT_PUBLIC_DISABLE_STAKING?.toLowerCase() != "true"
            ) {
                tabs.push({
                    // id: "staked",
                    label: "Staked",
                    value: "staked",
                });
            }
        }
        tabs.push({
            // id: "sales",
            label: "Sales",
            value: "sales",
        });

        return tabs;
    }, [collection?.stakingContractAddresses?.length, user]) as NavItemProps[];

    const [state, setState] = useQueryParams({
        tab: withDefault(StringParam, tabs[0].value), // TODO: use id instead
        page: withDefault(NumberParam, 1),
        query: withDefault(StringParam, ""),
        sort: withDefault(StringParam, undefined),
        // ^ We can't set a default value because it depends
        // on the selected tab. See `sort` value below.
        onlyStakeable: withDefault(BooleanParam, false),
        currency: withDefault(StringParam, null),
        minPrice: withDefault(NumberParam, null),
        maxPrice: withDefault(NumberParam, null),
        minRank: withDefault(NumberParam, null),
        maxRank: withDefault(NumberParam, null),
        activeProperties: withDefault(SelectedTokenAttributesParam, null),
    });

    const stateKeys = useMemo(() => Object.keys(state), []);

    // Reset state when switching from one collection page to another
    // or when landing on the intial collection page (no query params)
    useEffect(() => {
        // If the previous page is `collection`
        if (referer?.includes("/collection/")) {
            // Compare collection urls
            const prevCollId = removeQueryParams(referer)
                .replace(/https?:\/\//, "")
                .replace(`${host}/collection/`, "");

            const curCollIds = [
                collection.customUrl,
                collection.collectionId,
            ].filter((id) => id != null);

            // When collection urls don't match or is initial profile page
            // (no query params), reset state
            const { id, ...queryParams } = router.query;

            if (!curCollIds.includes(prevCollId) || isEmpty(queryParams)) {
                setState(
                    stateKeys.reduce(
                        (obj, key) => ({ ...obj, [key]: undefined }),
                        {}
                    )
                );
            }
        }
    }, [collection, stateKeys, setState, referer, host]);

    const setStateField = useCallback(
        (field: keyof typeof state) => (value: any) => {
            // We don't reset the state on tab change because of UX.
            setState((prev) => ({
                ...prev,
                page: 1,
                // ^ Reset page number when any of the filters change
                [field]: value,
            }));
        },
        [setState]
    );

    const sortOptions = useMemo(() => {
        if (collection.type === "EXTERNAL" && state.tab === "onsale")
            return COLLECTION_PFP_ON_SALE_SORT_OPTIONS;
        if (collection.type === "EXTERNAL") return COLLECTION_PFP_SORT_OPTIONS;
        if (state.tab === "onsale") return COLLECTION_ON_SALE_SORT_OPTIONS;
        return COLLECTION_SORT_OPTIONS;
    }, [collection.type, state.tab]);

    return (
        <CollectionContext.Provider
            value={{
                collection,
                tabs,
                // Convert obj to string and viceversa
                selectedTab: findOrFallback(tabs, (t) => t.value === state.tab), // TODO: use id instead
                setSelectedTab: (tab: NavItemProps) =>
                    setStateField("tab")(tab.value), // TODO: use id instead
                sortOptions,
                sort: findOrFallback(
                    sortOptions,
                    (o) => o.value === state.sort
                ),
                setSort: (opt: OptionItemProps) =>
                    setStateField("sort")(opt.value),
                // End convert obj to string
                currency: state.currency,
                setCurrency: setStateField("currency"),
                minPrice: state.minPrice,
                setMinPrice: setStateField("minPrice"),
                maxPrice: state.maxPrice,
                setMaxPrice: setStateField("maxPrice"),
                minRank: state.minRank,
                setMinRank: setStateField("minRank"),
                maxRank: state.maxRank,
                setMaxRank: setStateField("maxRank"),
                activeProperties: state.activeProperties,
                setActiveProperties: setStateField("activeProperties"),
                page: state.page,
                setPage: setStateField("page"),
                query: state.query,
                setQuery: setStateField("query"),
                onlyStakeable: state.onlyStakeable,
                setOnlyStakeable: setStateField("onlyStakeable"),
            }}
        >
            {children}
        </CollectionContext.Provider>
    );
};

export const useCollection = () => React.useContext(CollectionContext);

export default CollectionProvider;
